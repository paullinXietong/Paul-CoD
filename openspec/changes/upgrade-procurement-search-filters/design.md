## Context

The production keyword search response currently exposes product price, MOQ, monthly sales, repurchase rate, category IDs, supplier identities, supplier score data, one-piece dropshipping, dispatch guarantee and invoice flags. Product detail additionally exposes normalized-looking attribute pairs, inventory, tier pricing, supplier company name, shipping origin, dimensions and certificates. Several desirable B2B fields have no trustworthy source.

The existing live facet endpoint returned an empty parsing result for tested keywords. Client-side filtering of only the current 18 products would produce incorrect results for a 2,000-product search and is therefore not acceptable.

## Goals / Non-Goals

- Goals:
  - Deliver a compact, high-density B2B search interface.
  - Use only real production response fields on product cards.
  - Keep multi-select category search accurate.
  - Provide one explicit integration contract for all additional global filters.
  - Prevent unsupported supplier claims from reaching buyers.
- Non-Goals:
  - Do not crawl thousands of product details in the browser.
  - Do not treat keyword refinement as structured database filtering.
  - Do not rename 1688 seller identities as audited or verified without a confirmed business definition.
  - Do not invent sample, lead-time, supplier-year or OEM/ODM values.

## Decisions

### Deployment architecture

- Add a separate `search-api` Node service to the Codropshipping deployment.
- Route only `/search-api/*` to the new service. Existing `/api`, `/admin`, `/mall-api` and logistics routes remain unchanged.
- Connect the service to the existing MySQL container through an explicit external Docker network.
- Use a dedicated database or dedicated `product_search_*` tables and a least-privilege database user.
- Limit the search service to 256 MB memory and cap upstream indexing concurrency to protect the current 3.4 GB server.
- Protect indexing and supplier-profile write endpoints with an admin token. Public endpoints remain read-only and rate-limited.

### Search indexing lifecycle

1. A first-time keyword request returns the upstream first page and creates a query-index job.
2. The worker fetches additional upstream search pages with bounded concurrency and records query membership.
3. Search-result fields become globally filterable when the query index is complete.
4. Detail-only attributes are indexed asynchronously with stricter rate limits and coverage reporting.
5. The frontend enables each filter only when the API reports sufficient coverage and a complete query index.
6. Popular queries and categories are refreshed on a schedule using upstream modification timestamps where available.

The UI MUST show an honest preparing-filters state while indexing is incomplete. It MUST NOT present partial local filtering as complete.

### Search backend storage

- `product_search_products`: normalized fields available in keyword search results.
- `product_search_query_memberships`: products belonging to a normalized keyword and category query.
- `product_search_attributes`: normalized detail attributes and values.
- `product_search_inventory`: product and SKU inventory, tier pricing, origin, weight and volume.
- `product_search_supplier_profiles`: governed supplier metadata and missing business fields.
- `product_search_jobs`: indexing status, coverage, retry count and last error.

### Filter capability model

Each filter definition will use one capability state:

- `native`: current API already supports correct global behavior.
- `searchField`: the field is returned in search results but needs a backend query parameter.
- `detailIndex`: the field exists in product detail and needs server-side normalization and indexing.
- `missingSource`: no trustworthy field exists.

Public controls will be enabled only for `native` filters. Other filters may appear in internal previews, but MUST not be enabled publicly until the capability changes.

### Current frontend scope

- Category multi-select uses existing category IDs, separate searches, merge and deduplication.
- Price and monthly-sales sorting continue to use the existing `sort` payload.
- Product cards use search-result fields only, so every visible metric is available without extra requests.
- Filter selections update automatically after a short debounce and remain removable as chips.
- Loading, empty and error states keep the same layout footprint.

### Proposed backend filter contract

The search service should accept a structured filter object equivalent to:

```ts
type ProcurementSearchFilters = {
  categoryIds?: string[]
  minSourcePrice?: number
  maxSourcePrice?: number
  maxMoq?: number
  minMonthlySales?: number
  onePieceDropshipping?: boolean
  dispatchGuarantee?: '48h'
  shippingIncluded?: boolean
  onlineInvoice?: boolean
  sellerIdentities?: string[]
  minTradeScore?: number
  minServiceScore?: number
  minRepurchaseRate?: number
  minTradeMedalLevel?: number
  attributes?: Record<string, string[]>
  inStock?: boolean
  hasTierPricing?: boolean
  origins?: string[]
  certificateTypes?: string[]
}
```

The server MUST apply these filters before pagination and MUST return facet counts for the filtered result set.

### Proposed indexed product fields

- Product identifiers and category hierarchy
- Normalized source price and promotion price
- MOQ, monthly sales and repurchase rate
- One-piece dropshipping and dispatch guarantee
- Seller identity and supplier score fields
- Normalized product attributes keyed by category and attribute ID
- Total inventory and SKU inventory
- Tier-pricing breaks
- Shipping origin, normalized weight and volume
- Certificate types
- Last indexed time and source modification time

### Proposed supplier profile fields

- `yearsInBusiness`
- `auditStatus`, `auditProvider`, `auditDate`
- `averageResponseMinutes`
- `sampleAvailable`
- `productionLeadTimeMinDays`, `productionLeadTimeMaxDays`
- `oemSupported`, `odmSupported`, `privateLabelSupported`

These fields require a backend source and governance rule before public use.

## Risks / Trade-offs

- Upstream 1688 fields may be missing or category-specific. Mitigation: capability gating and per-category attribute normalization.
- Product-detail indexing can be expensive. Mitigation: asynchronous indexing based on source modification time, never browser-side crawling.
- Supplier identity names can be misunderstood. Mitigation: show the original business identity or an approved translation only.
- Currency conversion can make range boundaries unstable. Mitigation: filter in source currency and display the converted USD range using the same exchange rate snapshot.

## Migration Plan

1. Introduce typed frontend filter configuration and compact UI without changing routes.
2. Replace fake or unavailable card fields with existing search-response fields.
3. Add backend filter parameters for search-response fields.
4. Build and backfill the product search index for detail-only fields.
5. Add governed supplier-profile sources for missing fields.
6. Enable each public filter only after contract tests confirm correct pre-pagination filtering.

## Open Questions

- The existing product API source is not on the server, so the new service will integrate through the current production API rather than modifying it.
- The business meaning of each `sellerIdentities` value needs confirmation before customer-facing translation.
- Supplier audit and OEM/ODM data require an authoritative source owner.
