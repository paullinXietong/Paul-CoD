## Context
The public Nuxt storefront and the Vue 2 member center share one origin under `/admin`. The member center already exposes coupon creation, coupon list, order history, checkout coupon selection, and order cancellation clients. The supplied `codropshipping-serve-master` repository is the Vue 2 member frontend, not the API server source.

## Goals / Non-Goals
- Goals: implement the approved campaign UI and connect it to existing account, coupon, and order APIs.
- Goals: make the backend order history the source for first-order eligibility in every visible coupon state.
- Goals: send a stable campaign code and all required rule metadata to the coupon service.
- Non-goals: replace the existing account, order, or payment systems.

## Decisions
- Decision: use campaign code `new_user_shipping_2026` to distinguish this offer from membership and operational coupons.
- Decision: preserve the eight brief amounts and thresholds. The public roll animation is a preview; the coupon API response remains authoritative.
- Decision: pass the pending campaign amount through same-origin local storage only as a registration handoff, never as proof of entitlement.
- Decision: consider any returned order record as prior ordering. A canceled first order still makes the user ineligible for future use.
- Decision: mark only campaign coupons as disabled. Other coupon programs keep their existing behavior.
- Decision: send `invalidate_coupon: 1` on order cancellation so the API can permanently void a coupon attached to that order.

## Risks / Trade-offs
- The API server source is not present locally. Frontend checks improve the user experience but cannot replace server-side uniqueness, redemption, or cancellation enforcement.
- Older API responses may not include `campaign_code`. The UI accepts several compatible campaign marker fields while the stable contract is rolled out.

## Backend Contract
- Claim request fields: `campaign_code`, `preview_amount`, `min_price`, `valid_days`, `claim_source`.
- Claim response: the created coupon with `id`, `campaign_code`, `type_value`, `min_price`, `end_time`, and `status`.
- Coupon list response: include `campaign_code` and a status that can represent unused, used, expired, and void.
- Checkout must reject the campaign coupon when the authenticated account already has any order, when the threshold is not met, or when the coupon is expired/used/void.
- Claim must be atomic and unique by account plus campaign code.
- Order cancellation must set an attached campaign coupon to void and must never return it to unused.

## Migration Plan
1. Deploy the API contract and database uniqueness/void rules.
2. Deploy the Vue 2 member-center claim and eligibility UI.
3. Deploy the Nuxt weighted campaign popup.
4. Monitor claim conflicts and redemption rejection reasons.
