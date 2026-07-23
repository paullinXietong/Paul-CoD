## MODIFIED Requirements

### Requirement: Automatic Coupon Draw
The popup SHALL animate through the configured shipping coupon amounts and finish with a weighted preview result that follows the approved campaign distribution.

#### Scenario: Draw completes
- **WHEN** the popup opens for a signed-out visitor
- **THEN** the amount cycles briefly and resolves to a weighted preview of 5, 8, 10, 18, 20, 30, 50, or 100 US dollars with its matching order threshold

### Requirement: Coupon Claim Handoff
The popup SHALL preserve the selected preview and send the visitor to the existing registration page, while the backend remains authoritative for the issued coupon.

#### Scenario: Visitor chooses to claim
- **WHEN** the draw has completed and the visitor activates the claim action
- **THEN** the preview amount and campaign code are stored for the same-origin registration flow and the browser navigates to `/admin/signUp`

#### Scenario: Signed-in visitor opens the homepage
- **WHEN** a valid signed-in account is detected
- **THEN** the campaign popup does not open
