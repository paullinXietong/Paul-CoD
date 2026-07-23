# Change: Upgrade Procurement Search Filters

## Why
The current search page uses an oversized filter panel, mixes category refinements with keyword additions, and does not expose the procurement fields already returned by the production product API. Buyers need compact, accurate filters and richer product cards, while unsupported supplier claims must not be presented as real data.

## What Changes
- Replace the expanded filter rows with a compact two-line filter bar that keeps products visible in the first viewport.
- Keep category filters multi-selectable and merge category searches without duplicate products.
- Add a typed filter capability model that distinguishes filters supported by the current search API, fields present in search results, fields available only in product detail, and fields with no current data source.
- Add real product-card procurement data from existing responses, including unit price, MOQ, monthly sales, supplier scores, supplier identity, repurchase rate, one-piece dropshipping and dispatch guarantee.
- Add filter controls for category, price, MOQ, fulfillment, supplier quality and category-specific specifications.
- Apply only filters that have correct all-results semantics. Filters that need backend support MUST remain unavailable in the public interface until the backend contract is implemented.
- Define backend search-index and supplier-profile fields for inventory, tier pricing, normalized product attributes, supplier years, audit status, response time, sample availability, production lead time and explicit OEM/ODM support.
- Add a dedicated product-search backend service on the existing server, exposed under `/search-api`, without changing the existing logistics, member-center or upstream `/api` services.
- Add isolated MySQL search-index tables, background indexing jobs, facet endpoints and protected supplier-profile import endpoints.
- Preserve existing route paths, navigation labels, login, registration, cart and product-detail links.

## Impact
- Affected specs: `procurement-search`
- Affected frontend code: `pages/searchResult.vue`, `data/productTaxonomy.ts`, new typed search-filter configuration and optional reusable filter components
- Affected services: `services/api.ts`, new product-search API container and Caddy `/search-api` routing
- Backend implementation: server-side price range, MOQ, fulfillment, supplier score and indexed product-attribute filters
- Data model: isolated normalized product search index, query membership and supplier search profile tables in the existing MySQL service
- Existing server: the installed logistics API is unrelated and will remain unchanged
- Deployment: frontend changes will be verified locally first and will not be deployed until explicitly approved
