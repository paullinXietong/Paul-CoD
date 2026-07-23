import mysql from 'mysql2/promise'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

let pool
let ready = false

function createPool() {
  return mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME || 'cargosoon',
    user: process.env.DB_USER || 'product_search',
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_POOL_SIZE || 5),
    queueLimit: 30,
    decimalNumbers: true,
    multipleStatements: true,
    charset: 'utf8mb4'
  })
}

export async function initializeDatabase() {
  if (ready) return true
  if (!pool) pool = createPool()
  const migrationPath = fileURLToPath(new URL('../migrations/001_search_index.sql', import.meta.url))
  const migration = await readFile(migrationPath, 'utf8')
  await pool.query(migration)
  ready = true
  return true
}

export function databaseReady() {
  return ready
}

function asNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function asBoolean(value) {
  return value === true || value === 1 || value === '1' ? 1 : 0
}

function asPercent(value) {
  const number = asNumber(value)
  if (number === null) return null
  return number > 0 && number <= 1 ? number * 100 : number
}

function normalizedProduct(item) {
  const sourcePrice = item.priceInfo?.promotionPrice
    ?? item.priceInfo?.price
    ?? item.priceInfo?.jxhyPrice
    ?? item.priceInfo?.consignPrice
  return [
    String(item.offerId || item.id || ''),
    String(item.source || ''),
    item.subject || null,
    item.subjectTrans || null,
    item.imageUrl || null,
    item.topCategoryId ? String(item.topCategoryId) : null,
    item.secondCategoryId ? String(item.secondCategoryId) : null,
    item.thirdCategoryId ? String(item.thirdCategoryId) : null,
    asNumber(sourcePrice),
    asNumber(item.priceInfo?.promotionPrice),
    asNumber(item.minOrderQuantity),
    asNumber(item.monthSold),
    asPercent(item.repurchaseRate ?? item.sellerDataInfo?.repeatPurchasePercent),
    asBoolean(item.isOnePsale),
    asBoolean(item.isShippingIncluded),
    asBoolean(item.invoiceInfo?.supportOnlineInvoice),
    asBoolean(item.invoiceInfo?.supportFastInvoice),
    item.productSimpleShippingInfo?.shippingTimeGuarantee == null
      ? null
      : String(item.productSimpleShippingInfo.shippingTimeGuarantee),
    asNumber(item.tradeScore),
    asNumber(item.sellerDataInfo?.compositeServiceScore),
    asNumber(item.sellerDataInfo?.tradeMedalLevel),
    JSON.stringify(item.sellerIdentities || []),
    JSON.stringify(item.offerIdentities || []),
    item.modifyDate ? String(item.modifyDate) : null,
    JSON.stringify(item)
  ]
}

export async function storeProducts({ queryHash, keyword, categoryId = '', items, page, pageSize }) {
  if (!ready || !items.length) return
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const productSql = `
      INSERT INTO product_search_products (
        offer_id, source, subject, subject_trans, image_url,
        top_category_id, second_category_id, third_category_id,
        source_price, promotion_price, min_order_quantity, month_sold,
        repurchase_rate, one_piece_dropshipping, shipping_included,
        online_invoice, fast_invoice, dispatch_guarantee, trade_score,
        service_score, trade_medal_level, seller_identities, offer_identities,
        source_modified_at, raw_json
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        subject=VALUES(subject), subject_trans=VALUES(subject_trans), image_url=VALUES(image_url),
        top_category_id=VALUES(top_category_id), second_category_id=VALUES(second_category_id),
        third_category_id=VALUES(third_category_id), source_price=VALUES(source_price),
        promotion_price=VALUES(promotion_price), min_order_quantity=VALUES(min_order_quantity),
        month_sold=VALUES(month_sold), repurchase_rate=VALUES(repurchase_rate),
        one_piece_dropshipping=VALUES(one_piece_dropshipping),
        shipping_included=VALUES(shipping_included), online_invoice=VALUES(online_invoice),
        fast_invoice=VALUES(fast_invoice), dispatch_guarantee=VALUES(dispatch_guarantee),
        trade_score=VALUES(trade_score), service_score=VALUES(service_score),
        trade_medal_level=VALUES(trade_medal_level), seller_identities=VALUES(seller_identities),
        offer_identities=VALUES(offer_identities), source_modified_at=VALUES(source_modified_at),
        raw_json=VALUES(raw_json)
    `
    const membershipSql = `
      INSERT INTO product_search_query_memberships
        (query_hash, normalized_keyword, category_id, offer_id, source, source_rank)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE source_rank=LEAST(source_rank, VALUES(source_rank))
    `
    for (let index = 0; index < items.length; index += 1) {
      const product = normalizedProduct(items[index])
      if (!product[0]) continue
      await connection.execute(productSql, product)
      await connection.execute(membershipSql, [
        queryHash,
        keyword,
        String(categoryId || ''),
        product[0],
        product[1],
        (page - 1) * pageSize + index
      ])
    }
    await connection.commit()
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

export async function upsertJob({ queryHash, keyword, categoryId = '', status, indexedProducts, expectedProducts, error }) {
  if (!ready) return
  await pool.execute(`
    INSERT INTO product_search_jobs (
      query_hash, normalized_keyword, category_id, status, indexed_products,
      expected_products, last_error, started_at, completed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, IF(?='running', NOW(), NULL), IF(?='complete', NOW(), NULL))
    ON DUPLICATE KEY UPDATE
      status=VALUES(status),
      indexed_products=GREATEST(indexed_products, VALUES(indexed_products)),
      expected_products=GREATEST(expected_products, VALUES(expected_products)),
      last_error=VALUES(last_error),
      started_at=IF(VALUES(status)='running', COALESCE(started_at, NOW()), started_at),
      completed_at=IF(VALUES(status)='complete', NOW(), completed_at),
      retry_count=IF(VALUES(status)='failed', retry_count + 1, retry_count)
  `, [
    queryHash,
    keyword,
    String(categoryId || ''),
    status,
    Number(indexedProducts || 0),
    Number(expectedProducts || 0),
    error ? String(error).slice(0, 4000) : null,
    status,
    status
  ])
}

export async function getJobs(queryHashes) {
  if (!ready || !queryHashes.length) return []
  const placeholders = queryHashes.map(() => '?').join(',')
  const [rows] = await pool.query(
    `SELECT * FROM product_search_jobs WHERE query_hash IN (${placeholders})`,
    queryHashes
  )
  return rows
}

function normalizeFacetValue(value) {
  return String(value ?? '').trim().toLowerCase().replace(/\s+/g, ' ').slice(0, 500)
}

function detailAttributeValues(attribute) {
  const raw = attribute.attributeValue
    ?? attribute.valueTrans
    ?? attribute.value
    ?? attribute.attributeValueTrans
    ?? attribute.values
  const values = Array.isArray(raw) ? raw : [raw]
  return values
    .flatMap((value) => {
      if (value && typeof value === 'object') {
        return [value.valueTrans ?? value.value ?? value.name ?? value.text]
      }
      return [value]
    })
    .map(value => String(value ?? '').trim())
    .filter(Boolean)
}

export async function getDetailCandidates(queryHash, limit = 100) {
  if (!ready) return []
  const [rows] = await pool.query(`
    SELECT p.offer_id AS offerId, p.source
    FROM product_search_query_memberships m
    JOIN product_search_products p
      ON p.offer_id=m.offer_id AND p.source=m.source
    LEFT JOIN product_search_inventory i
      ON i.offer_id=p.offer_id AND i.source=p.source
    WHERE m.query_hash=? AND i.offer_id IS NULL
    ORDER BY m.source_rank ASC
    LIMIT ?
  `, [queryHash, Number(limit)])
  return rows
}

export async function storeProductDetail({ offerId, source = '', detail }) {
  if (!ready) return
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    await connection.execute(
      'DELETE FROM product_search_attributes WHERE offer_id=? AND source=?',
      [String(offerId), String(source || '')]
    )
    const attributes = detail.productAttribute || detail.productAttributes || []
    for (const attribute of attributes) {
      const attributeId = String(attribute.attributeId || attribute.attrId || attribute.id || attribute.attributeName || '')
      const attributeName = String(
        attribute.attributeNameTrans
        || attribute.attributeName
        || attribute.nameTrans
        || attribute.name
        || ''
      ).trim()
      if (!attributeId || !attributeName) continue
      const values = detailAttributeValues(attribute)
      for (const value of values) {
        await connection.execute(`
          INSERT INTO product_search_attributes (
            offer_id, source, category_id, attribute_id, attribute_name,
            attribute_value, normalized_name, normalized_value
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            attribute_name=VALUES(attribute_name), attribute_value=VALUES(attribute_value)
        `, [
          String(offerId),
          String(source || ''),
          String(detail.thirdCategoryId || detail.secondCategoryId || detail.topCategoryId || ''),
          attributeId,
          attributeName.slice(0, 255),
          value.slice(0, 500),
          normalizeFacetValue(attributeName).slice(0, 255),
          normalizeFacetValue(value)
        ])
      }
    }

    const skuInfos = detail.productSkuInfos || detail.productSaleInfo?.productSkuInfos || []
    const totalInventory = skuInfos.length
      ? skuInfos.reduce((sum, sku) => sum + Number(sku.amountOnSale || 0), 0)
      : Number(detail.productSaleInfo?.amountOnSale || 0)
    const priceRanges = detail.productSaleInfo?.priceRangeList || []
    const shipping = detail.productShippingInfo || {}
    const length = Number(shipping.length || shipping.packageLength || 0)
    const width = Number(shipping.width || shipping.packageWidth || 0)
    const height = Number(shipping.height || shipping.packageHeight || 0)
    const certificateTypes = (detail.certificateList || [])
      .map(certificate => certificate.certificateType || certificate.type || certificate.name)
      .filter(Boolean)

    await connection.execute(`
      INSERT INTO product_search_inventory (
        offer_id, source, total_inventory, has_tier_pricing, tier_pricing_json,
        origin, weight_grams, volume_cm3, certificate_types
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        total_inventory=VALUES(total_inventory), has_tier_pricing=VALUES(has_tier_pricing),
        tier_pricing_json=VALUES(tier_pricing_json), origin=VALUES(origin),
        weight_grams=VALUES(weight_grams), volume_cm3=VALUES(volume_cm3),
        certificate_types=VALUES(certificate_types)
    `, [
      String(offerId),
      String(source || ''),
      Number.isFinite(totalInventory) ? totalInventory : null,
      priceRanges.length > 1 ? 1 : 0,
      JSON.stringify(priceRanges),
      shipping.sendGoodsAddressText || shipping.sendGoodsAddress || null,
      asNumber(shipping.weight ?? shipping.packageWeight),
      length && width && height ? length * width * height : null,
      JSON.stringify(certificateTypes)
    ])
    await connection.commit()
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

export async function updateDetailProgress(queryHash) {
  if (!ready) return 0
  const [rows] = await pool.query(`
    SELECT COUNT(*) AS total
    FROM product_search_query_memberships m
    JOIN product_search_inventory i
      ON i.offer_id=m.offer_id AND i.source=m.source
    WHERE m.query_hash=?
  `, [queryHash])
  const count = Number(rows[0]?.total || 0)
  await pool.execute(
    'UPDATE product_search_jobs SET detail_indexed_products=? WHERE query_hash=?',
    [count, queryHash]
  )
  return count
}

function addRangeFilter(clauses, params, field, minValue, operator = '>=') {
  const number = Number(minValue)
  if (Number.isFinite(number)) {
    clauses.push(`${field} ${operator} ?`)
    params.push(number)
  }
}

export function buildFilterSql(filters = {}) {
  const clauses = []
  const params = []
  addRangeFilter(clauses, params, 'p.source_price', filters.minSourcePrice)
  addRangeFilter(clauses, params, 'p.source_price', filters.maxSourcePrice, '<=')
  addRangeFilter(clauses, params, 'p.min_order_quantity', filters.maxMoq, '<=')
  addRangeFilter(clauses, params, 'p.month_sold', filters.minMonthlySales)
  addRangeFilter(clauses, params, 'p.trade_score', filters.minTradeScore)
  addRangeFilter(clauses, params, 'p.service_score', filters.minServiceScore)
  addRangeFilter(clauses, params, 'p.repurchase_rate', filters.minRepurchaseRate)
  addRangeFilter(clauses, params, 'p.trade_medal_level', filters.minTradeMedalLevel)
  if (filters.onePieceDropshipping === true) clauses.push('p.one_piece_dropshipping = 1')
  if (filters.shippingIncluded === true) clauses.push('p.shipping_included = 1')
  if (filters.onlineInvoice === true) clauses.push('p.online_invoice = 1')
  if (filters.dispatchGuarantee === '48h') {
    clauses.push(`(LOWER(p.dispatch_guarantee) LIKE '%48%' OR p.dispatch_guarantee IN ('1', 'true'))`)
  }
  Object.entries(filters.attributes || {}).forEach(([name, rawValues]) => {
    const values = Array.isArray(rawValues)
      ? rawValues.map(normalizeFacetValue).filter(Boolean).slice(0, 20)
      : []
    if (!values.length) return
    clauses.push(`
      EXISTS (
        SELECT 1 FROM product_search_attributes selected_attribute
        WHERE selected_attribute.offer_id=p.offer_id
          AND selected_attribute.source=p.source
          AND selected_attribute.normalized_name=?
          AND selected_attribute.normalized_value IN (${values.map(() => '?').join(',')})
      )
    `)
    params.push(normalizeFacetValue(name), ...values)
  })
  return {
    sql: clauses.length ? ` AND ${clauses.join(' AND ')}` : '',
    params
  }
}

export async function queryProducts({ queryHashes, filters, page, pageSize, sortBy, direction }) {
  const placeholders = queryHashes.map(() => '?').join(',')
  const filter = buildFilterSql(filters)
  const sortColumns = {
    relevance: 'm.source_rank',
    price: 'p.source_price',
    monthSold: 'p.month_sold'
  }
  const sortColumn = sortColumns[sortBy] || sortColumns.relevance
  const sortDirection = String(direction).toLowerCase() === 'asc' ? 'ASC' : 'DESC'
  const relevanceDirection = sortBy === 'relevance' ? 'ASC' : sortDirection
  const membershipJoin = `
    FROM product_search_products p
    JOIN (
      SELECT offer_id, source, MIN(source_rank) AS source_rank
      FROM product_search_query_memberships
      WHERE query_hash IN (${placeholders})
      GROUP BY offer_id, source
    ) m ON m.offer_id=p.offer_id AND m.source=p.source
    WHERE 1=1 ${filter.sql}
  `
  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total ${membershipJoin}`,
    [...queryHashes, ...filter.params]
  )
  const offset = (page - 1) * pageSize
  const [rows] = await pool.query(`
    SELECT p.offer_id, p.source, p.raw_json, m.source_rank
    ${membershipJoin}
    ORDER BY ${sortColumn} ${relevanceDirection}, p.offer_id ASC
    LIMIT ? OFFSET ?
  `, [...queryHashes, ...filter.params, pageSize, offset])

  return {
    items: rows.map((row) => {
      const raw = typeof row.raw_json === 'string' ? JSON.parse(row.raw_json) : row.raw_json
      return raw
    }),
    total: Number(countRows[0]?.total || 0)
  }
}

export async function queryFacets({ queryHashes, filters }) {
  const placeholders = queryHashes.map(() => '?').join(',')
  const filter = buildFilterSql(filters)
  const [rows] = await pool.query(`
    SELECT
      MIN(p.source_price) AS minPrice,
      MAX(p.source_price) AS maxPrice,
      MIN(p.min_order_quantity) AS minMoq,
      MAX(p.min_order_quantity) AS maxMoq,
      SUM(p.one_piece_dropshipping = 1) AS onePieceDropshipping,
      SUM(p.shipping_included = 1) AS shippingIncluded,
      SUM(p.online_invoice = 1) AS onlineInvoice
    FROM product_search_products p
    JOIN product_search_query_memberships m
      ON m.offer_id=p.offer_id AND m.source=p.source
    WHERE m.query_hash IN (${placeholders})
    ${filter.sql}
  `, [...queryHashes, ...filter.params])
  const [attributeRows] = await pool.query(`
    SELECT
      a.normalized_name AS facetKey,
      MAX(a.attribute_name) AS facetLabel,
      a.attribute_value AS facetValue,
      COUNT(DISTINCT CONCAT(a.offer_id, '\\0', a.source)) AS facetCount
    FROM product_search_attributes a
    JOIN product_search_query_memberships m
      ON m.offer_id=a.offer_id AND m.source=a.source
    JOIN product_search_products p
      ON p.offer_id=a.offer_id AND p.source=a.source
    WHERE m.query_hash IN (${placeholders})
    ${filter.sql}
    GROUP BY a.normalized_name, a.normalized_value, a.attribute_value
    HAVING facetCount >= 2
    ORDER BY facetCount DESC
    LIMIT 160
  `, [...queryHashes, ...filter.params])
  const attributeGroups = new Map()
  attributeRows.forEach((row) => {
    if (!attributeGroups.has(row.facetKey)) {
      attributeGroups.set(row.facetKey, {
        key: row.facetKey,
        label: row.facetLabel,
        values: []
      })
    }
    const group = attributeGroups.get(row.facetKey)
    if (group.values.length < 12) {
      group.values.push({ value: row.facetValue, count: Number(row.facetCount) })
    }
  })
  return {
    summary: rows[0] || {},
    attributes: [...attributeGroups.values()].slice(0, 10)
  }
}

export async function importSupplierProfiles(profiles) {
  if (!ready) throw new Error('Database is not ready')
  const sql = `
    INSERT INTO product_search_supplier_profiles (
      supplier_key, company_name, years_in_business, audit_status, audit_provider,
      audit_date, average_response_minutes, sample_available,
      production_lead_time_min_days, production_lead_time_max_days,
      oem_supported, odm_supported, private_label_supported,
      source_name, source_reference, verified_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      company_name=VALUES(company_name), years_in_business=VALUES(years_in_business),
      audit_status=VALUES(audit_status), audit_provider=VALUES(audit_provider),
      audit_date=VALUES(audit_date), average_response_minutes=VALUES(average_response_minutes),
      sample_available=VALUES(sample_available),
      production_lead_time_min_days=VALUES(production_lead_time_min_days),
      production_lead_time_max_days=VALUES(production_lead_time_max_days),
      oem_supported=VALUES(oem_supported), odm_supported=VALUES(odm_supported),
      private_label_supported=VALUES(private_label_supported),
      source_name=VALUES(source_name), source_reference=VALUES(source_reference),
      verified_at=VALUES(verified_at)
  `
  for (const profile of profiles) {
    await pool.execute(sql, [
      profile.supplierKey,
      profile.companyName || null,
      profile.yearsInBusiness ?? null,
      profile.auditStatus || null,
      profile.auditProvider || null,
      profile.auditDate || null,
      profile.averageResponseMinutes ?? null,
      profile.sampleAvailable ?? null,
      profile.productionLeadTimeMinDays ?? null,
      profile.productionLeadTimeMaxDays ?? null,
      profile.oemSupported ?? null,
      profile.odmSupported ?? null,
      profile.privateLabelSupported ?? null,
      profile.sourceName,
      profile.sourceReference || null,
      profile.verifiedAt || null
    ])
  }
  return profiles.length
}
