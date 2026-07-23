## 1. Campaign popup
- [x] 1.1 Replace the equal draw with the brief's weighted distribution.
- [x] 1.2 Show the matching minimum order, 14-day validity, and one-claim rule.
- [x] 1.3 Preserve signed-in suppression and same-origin registration handoff.

## 2. Account claim
- [x] 2.1 Submit the campaign claim after successful registration.
- [x] 2.2 Prevent duplicate client submissions and retain pending state on transient failure.
- [ ] 2.3 Enforce the one-claim-per-account rule atomically in the API and database.

## 3. Eligibility UI
- [x] 3.1 Mark campaign coupons in the coupon wallet.
- [x] 3.2 Query backend order history and gray campaign coupons after any prior order.
- [x] 3.3 Prevent ineligible campaign coupon selection in both checkout implementations.

## 4. Cancellation contract
- [x] 4.1 Send cancellation intent that requires an attached campaign coupon to be voided.
- [x] 4.2 Display void campaign coupons as unavailable when returned by the API.
- [ ] 4.3 Persist the permanent coupon void state in the API and database when an order is canceled.

## 5. Verification
- [x] 5.1 Build the Nuxt storefront.
- [x] 5.2 Build the Vue 2 member center.
- [x] 5.3 Verify the public popup on desktop and mobile.
