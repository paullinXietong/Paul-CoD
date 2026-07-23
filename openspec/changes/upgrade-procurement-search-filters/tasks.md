## 1. Frontend data model
- [x] 1.1 Add typed product-search and filter-capability definitions.
- [x] 1.2 Map current search response fields to procurement card data.
- [x] 1.3 Map category-specific filter labels to category IDs without shoe-only defaults.

## 2. Compact filter interface
- [x] 2.1 Replace the expanded filter rows with the approved compact two-line layout.
- [x] 2.2 Add multi-select chips, automatic application and clear-all behavior.
- [x] 2.3 Add category, price, MOQ, fulfillment, supplier-quality and product-specification filter menus.
- [x] 2.4 Hide or disable capabilities that do not have correct global filtering support.

## 3. Product results
- [x] 3.1 Redesign product cards using only fields present in the search response.
- [x] 3.2 Add unit price, MOQ, monthly sales, seller score, seller identity, repurchase rate, dropshipping and dispatch data.
- [x] 3.3 Preserve product detail, chat and sourcing-list actions.
- [x] 3.4 Preserve pagination, category merge, deduplication and sorting.

## 4. Interaction states
- [x] 4.1 Provide loading skeletons matching the new cards.
- [x] 4.2 Provide accurate empty and error states.
- [x] 4.3 Verify keyboard focus, button labels and responsive collapse behavior.

## 5. Product-search backend
- [x] 5.1 Add a dedicated Node search API service and health endpoint.
- [x] 5.2 Add isolated MySQL migrations for products, query memberships, attributes, inventory, supplier profiles and indexing jobs.
- [x] 5.3 Add the upstream product-search client and bounded background indexing worker.
- [x] 5.4 Add server-side filters for price, MOQ, monthly sales, fulfillment and supplier quality.
- [x] 5.5 Add facet counts and filter-coverage metadata.
- [x] 5.6 Add protected supplier-profile import and update endpoints for missing business fields.
- [x] 5.7 Add rate limiting, input validation, admin authorization and indexing concurrency limits.
- [x] 5.8 Add the search service to Docker Compose and route `/search-api/*` through Caddy.

## 6. Verification
- [x] 6.1 Run the production build.
- [x] 6.2 Verify multiple product keywords and multiple selected categories.
- [ ] 6.3 Verify existing login, registration, cart and product-detail routes remain reachable.
- [x] 6.4 Capture desktop screenshots and compare them with the approved concept.
- [x] 6.5 Run search API tests for pre-pagination filtering, incomplete-index behavior and unauthorized writes.
- [ ] 6.6 Verify the existing logistics API, member center and upstream product API are unaffected.

## 7. Deployment
- [ ] 7.1 Obtain explicit deployment approval.
- [ ] 7.2 Build and deploy the approved version.
- [ ] 7.3 Verify production routes and search behavior.
