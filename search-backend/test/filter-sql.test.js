import test from 'node:test'
import assert from 'node:assert/strict'
import { buildFilterSql } from '../src/db.js'
import { normalizeKeyword, queryHash } from '../src/indexer.js'

test('normalizes keywords and makes category-specific stable hashes', () => {
  assert.equal(normalizeKeyword('  Disposable   COMB '), 'disposable comb')
  assert.equal(normalizeKeyword('  宠物   用品 '), '宠物 用品')
  assert.equal(queryHash('Shoes', '1'), queryHash(' shoes ', '1'))
  assert.notEqual(queryHash('Shoes', '1'), queryHash('Shoes', '2'))
})

test('builds supported filters before pagination', () => {
  const result = buildFilterSql({
    minSourcePrice: 5,
    maxSourcePrice: 20,
    maxMoq: 10,
    onePieceDropshipping: true,
    minTradeScore: 4
  })
  assert.match(result.sql, /p\.source_price >= \?/)
  assert.match(result.sql, /p\.source_price <= \?/)
  assert.match(result.sql, /p\.min_order_quantity <= \?/)
  assert.match(result.sql, /p\.one_piece_dropshipping = 1/)
  assert.deepEqual(result.params, [5, 20, 10, 4])
})

test('builds category-specific attribute filters as indexed EXISTS clauses', () => {
  const result = buildFilterSql({
    attributes: {
      Brand: ['Acme', 'Example'],
      Material: ['Stainless steel']
    }
  })
  assert.match(result.sql, /product_search_attributes selected_attribute/)
  assert.match(result.sql, /selected_attribute\.normalized_name=\?/)
  assert.deepEqual(result.params, ['brand', 'acme', 'example', 'material', 'stainless steel'])
})
