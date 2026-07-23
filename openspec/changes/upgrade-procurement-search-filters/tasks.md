## 1. Frontend data model
- [ ] 1.1 Add typed product-search and filter-capability definitions.
- [ ] 1.2 Map current search response fields to procurement card data.
- [ ] 1.3 Map category-specific filter labels to category IDs without shoe-only defaults.

## 2. Compact filter interface
- [ ] 2.1 Replace the expanded filter rows with the approved compact two-line layout.
- [ ] 2.2 Add multi-select chips, automatic application and clear-all behavior.
- [ ] 2.3 Add category, price, MOQ, fulfillment, supplier-quality and product-specification filter menus.
- [ ] 2.4 Hide or disable capabilities that do not have correct global filtering support.

## 3. Product results
- [ ] 3.1 Redesign product cards using only fields present in the search response.
- [ ] 3.2 Add unit price, MOQ, monthly sales, seller score, seller identity, repurchase rate, dropshipping and dispatch data.
- [ ] 3.3 Preserve product detail, chat and sourcing-list actions.
- [ ] 3.4 Preserve pagination, category merge, deduplication and sorting.

## 4. Interaction states
- [ ] 4.1 Provide loading skeletons matching the new cards.
- [ ] 4.2 Provide accurate empty and error states.
- [ ] 4.3 Verify keyboard focus, button labels and responsive collapse behavior.

## 5. Backend integration contract
- [ ] 5.1 Document server-side filter parameters for fields already present in search results.
- [ ] 5.2 Document the normalized product search-index schema for detail-only fields.
- [ ] 5.3 Document the supplier-profile schema for currently missing fields.
- [ ] 5.4 Integrate and enable filters only after the backend repository or endpoint is available.

## 6. Verification
- [ ] 6.1 Run the production build.
- [ ] 6.2 Verify multiple product keywords and multiple selected categories.
- [ ] 6.3 Verify existing login, registration, cart and product-detail routes remain reachable.
- [ ] 6.4 Capture desktop screenshots and compare them with the approved concept.

## 7. Deployment
- [ ] 7.1 Obtain explicit deployment approval.
- [ ] 7.2 Build and deploy the approved version.
- [ ] 7.3 Verify production routes and search behavior.

