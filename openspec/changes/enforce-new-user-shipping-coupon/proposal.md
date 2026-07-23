# Change: Enforce New User Shipping Coupon Rules

## Why
The current homepage popup uses an equal browser-side random draw and only stores the result locally. The approved campaign brief requires a weighted 5,000-user coupon pool, account-based eligibility, one claim per user, first-order-only redemption, and permanent invalidation when an order using the coupon is canceled.

## What Changes
- Replace the equal draw preview with the campaign brief's weighted coupon amounts and matching order thresholds.
- Keep the popup available to signed-out visitors and suppress it for signed-in users.
- Hand the selected campaign amount to the existing registration flow and submit a campaign-aware claim after successful registration.
- Identify campaign coupons in the member center and use backend order history to disable them after any order has been placed.
- Prevent disabled campaign coupons from being selected at checkout.
- Require the coupon service to enforce one claim per account, first-order-only redemption, 14-day expiry, threshold checks, and cancellation invalidation.

## Impact
- Affected specs: `shipping-coupon-popup`, `new-user-shipping-coupon`
- Affected code: Nuxt campaign popup, Vue 2 registration, coupon wallet, order checkout, coupon API client
- Backend contract: coupon claim and redemption remain authoritative on the existing `/customer/api/user/coupon/*` and order APIs
