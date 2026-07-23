## ADDED Requirements

### Requirement: Compact Procurement Filter Bar
The search page SHALL present procurement filters in a compact layout that keeps product results visible in the first desktop viewport.

#### Scenario: Search results load on desktop
- **WHEN** a buyer opens a keyword search result on a desktop viewport
- **THEN** the filter controls SHALL use no more than two compact rows before the results toolbar
- **AND** the first product row SHALL remain visible without scrolling

### Requirement: Multi-Select Product Categories
The search page SHALL allow buyers to select multiple category values and SHALL merge the corresponding product searches without duplicate products.

#### Scenario: Buyer selects two product categories
- **WHEN** the buyer selects two category values
- **THEN** the page SHALL search both category IDs
- **AND** SHALL deduplicate results using product ID and source
- **AND** SHALL show both selected values as removable chips

### Requirement: Truthful Filter Capability
The public search page MUST enable a filter only when the system can apply that filter to the complete result set before pagination.

#### Scenario: Field exists only on the current product page
- **WHEN** a field is returned for displayed products but the backend cannot filter the complete result set
- **THEN** the corresponding public filter MUST remain unavailable
- **AND** the page MUST NOT filter only the current page while presenting the result as global

#### Scenario: Backend capability becomes available
- **WHEN** a backend filter parameter or indexed facet is validated
- **THEN** the corresponding filter MAY be enabled through the capability configuration

### Requirement: Procurement Product Cards
Each product card SHALL use real API fields to show procurement-relevant information without inventing supplier claims.

#### Scenario: Search product contains procurement fields
- **WHEN** a product contains price, MOQ, sales, seller score, seller identity, repurchase, dropshipping or dispatch data
- **THEN** the card SHALL display the available values in a compact hierarchy
- **AND** SHALL omit any unavailable value

#### Scenario: Supplier verification is not defined
- **WHEN** the API does not provide an approved verified or audited supplier field
- **THEN** the card MUST NOT label the supplier as verified or audited

### Requirement: Category-Specific Product Specifications
The filter system SHALL support category-specific specification groups sourced from normalized product attributes.

#### Scenario: Indexed attributes exist for a category
- **WHEN** the selected category has indexed attribute names and facet values
- **THEN** the product-specification menu SHALL show only the relevant attribute groups and values

#### Scenario: Indexed attributes do not exist
- **WHEN** no indexed attribute facets are available
- **THEN** the product-specification menu SHALL remain unavailable
- **AND** the page SHALL continue to show products normally

### Requirement: Search Interaction States
The redesigned search page SHALL provide loading, empty and error states that preserve layout stability and explain the next available action.

#### Scenario: Product request fails
- **WHEN** a product request fails
- **THEN** the page SHALL show an inline error message without removing the search and filter controls

#### Scenario: Filters return no products
- **WHEN** an applied filter combination returns no products
- **THEN** the page SHALL show the active filters and offer a clear-all action

### Requirement: Existing Route Preservation
The search redesign MUST preserve existing storefront and member-center navigation behavior.

#### Scenario: Buyer opens an existing action
- **WHEN** the buyer opens product detail, chat, sourcing list, login, registration or cart from the redesigned page
- **THEN** the existing route and target behavior SHALL remain unchanged

### Requirement: Server-Side Search Index
The system SHALL maintain a server-side query index so procurement filters apply to the complete indexed result set before pagination.

#### Scenario: First-time keyword is not indexed
- **WHEN** a buyer searches for a keyword without a complete query index
- **THEN** the system SHALL return the upstream first page
- **AND** SHALL start a bounded background indexing job
- **AND** SHALL report that complete filters are still being prepared

#### Scenario: Query index is complete
- **WHEN** a buyer applies supported filters to a completely indexed query
- **THEN** the backend SHALL apply every filter before pagination
- **AND** SHALL return the filtered total and facet counts

### Requirement: Search Index Isolation
The product-search backend MUST use isolated routes, storage and resource limits so existing production services are not disrupted.

#### Scenario: Search backend is deployed
- **WHEN** the new backend starts in production
- **THEN** only `/search-api/*` SHALL route to it
- **AND** existing `/api`, `/admin`, `/mall-api` and logistics routes SHALL retain their current destinations

### Requirement: Governed Supplier Profile Data
Supplier years, audit status, response time, sample availability, production lead time and OEM/ODM support MUST come from an authenticated supplier-profile source.

#### Scenario: Supplier profile has no governed value
- **WHEN** a supplier profile field is empty or unverified
- **THEN** the corresponding public filter and product claim MUST remain unavailable

#### Scenario: Authorized profile data is imported
- **WHEN** an authorized administrator imports a valid supplier profile
- **THEN** the backend SHALL validate and store the source metadata
- **AND** the field MAY become available after index refresh
