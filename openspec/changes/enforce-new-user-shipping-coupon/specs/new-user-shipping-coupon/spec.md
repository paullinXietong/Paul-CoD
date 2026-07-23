## ADDED Requirements

### Requirement: Weighted Campaign Pool
The system SHALL allocate new-user shipping coupons according to the approved 5,000-user pool: $5 at 78%, $8 at 19%, $10 at 2%, $18 at 0.70%, $20 at 0.20%, $30 at 0.06%, $50 at 0.02%, and $100 at 0.02%.

#### Scenario: Coupon amount is allocated
- **WHEN** an eligible account claims the campaign coupon
- **THEN** the backend allocates one amount from the active campaign pool and records the result against the account

### Requirement: One Claim Per Account
The system MUST allow an account to receive the campaign coupon no more than once.

#### Scenario: Repeated claim is rejected
- **WHEN** an account that already has a campaign claim requests another coupon
- **THEN** the backend rejects the request without creating another coupon

### Requirement: First Order Redemption
The system MUST allow the campaign coupon to be used only by an account that has never placed an order and whose current eligible shipping charge meets the coupon threshold.

#### Scenario: Account has no prior orders
- **WHEN** the account has no order history and the current charge reaches the coupon threshold
- **THEN** the coupon is available for selection

#### Scenario: Account has prior orders
- **WHEN** backend order history contains any order for the account
- **THEN** the campaign coupon is disabled and labeled `New users only`

### Requirement: Cancellation Permanently Voids Coupon
The system MUST permanently void a campaign coupon attached to a canceled order.

#### Scenario: Coupon order is canceled
- **WHEN** an order that used the campaign coupon is canceled
- **THEN** the coupon status becomes void and the coupon is not returned to the unused list

### Requirement: Campaign Validity
The system SHALL expire the campaign coupon 14 days after it is issued.

#### Scenario: Validity window ends
- **WHEN** 14 days have passed since issuance
- **THEN** the coupon cannot be selected or redeemed
