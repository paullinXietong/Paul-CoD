## ADDED Requirements

### Requirement: Homepage Shipping Coupon Campaign
The storefront SHALL show the new-user shipping coupon draw on the homepage only when the visitor is not signed in and remains within the browser impression limit.

#### Scenario: Eligible visitor sees the campaign
- **WHEN** a visitor without local `userInfo` opens the homepage and has fewer than three recorded impressions
- **THEN** the shipping coupon popup appears after approximately three seconds

#### Scenario: Signed-in visitor is excluded
- **WHEN** the homepage detects a valid local `userInfo` value
- **THEN** the shipping coupon popup does not open

#### Scenario: Impression limit is reached
- **WHEN** the browser has recorded three shipping coupon popup impressions
- **THEN** the popup does not open again

### Requirement: Automatic Coupon Draw
The popup SHALL automatically animate through the configured shipping coupon amounts and finish with one displayed amount.

#### Scenario: Draw completes
- **WHEN** the popup opens
- **THEN** the amount cycles briefly and resolves to one of 5, 8, 10, 18, 20, 30, 50, or 100 US dollars

### Requirement: Coupon Claim Handoff
The popup SHALL preserve the selected amount locally and send the visitor to the existing account entry when they choose to claim it.

#### Scenario: Visitor chooses to claim
- **WHEN** the draw has completed and the visitor activates the claim action
- **THEN** the selected amount is stored as `coddrop_pending_coupon_amount` and the browser navigates to `/admin/signUp`

### Requirement: Accessible Responsive Dialog
The popup SHALL provide modal semantics, keyboard and pointer close actions, reduced-motion support, and a mobile layout that remains usable within the viewport.

#### Scenario: Visitor closes the popup
- **WHEN** the visitor presses Escape, selects the close control, or selects the backdrop
- **THEN** the popup closes, page scrolling is restored, and the next eligible opening is scheduled five minutes later

#### Scenario: Visitor uses a mobile viewport
- **WHEN** the viewport is 680 pixels wide or narrower
- **THEN** the popup changes to a single-column layout and stays within the visible viewport

#### Scenario: Visitor prefers reduced motion
- **WHEN** the browser reports a reduced-motion preference
- **THEN** the popup does not use the entrance, shine, or amount-lift animations
