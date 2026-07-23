## Context
`New codropshipping` contains a React homepage-only popup that gives a signed-out visitor an animated random shipping coupon amount. The current storefront is Nuxt 3 with Vue components, uses `userInfo` in local storage for login state, and exposes the original member registration page at `/admin/signUp`.

## Goals / Non-Goals
- Goals: reproduce the campaign popup on the current homepage, preserve the current orange and navy visual language, and support desktop and mobile interaction.
- Goals: avoid repeatedly interrupting the same visitor and avoid showing the offer to logged-in users.
- Non-goals: create, validate, redeem, or persist coupons on the backend.
- Non-goals: replace or modify the existing `/activity` rewards page.

## Decisions
- Decision: implement the popup as a standalone Vue component and mount it only in `pages/index.vue`, matching the homepage-only scope of the source project.
- Decision: treat the existing `userInfo` local-storage value as the signed-in signal.
- Decision: preserve the source campaign timing: open after 3 seconds, reopen after 5 minutes when dismissed, and stop after 3 impressions per browser.
- Decision: store the selected amount as `coddrop_pending_coupon_amount` and navigate to `/admin/signUp` when the visitor chooses to claim it.
- Decision: allow `?couponPreview=1` to bypass frequency and login checks only in local development so the popup can be reviewed repeatedly without changing production behavior.
- Decision: use the existing project stack only. No new package is required.

## Risks / Trade-offs
- A local pending amount is not a secure coupon entitlement. The interface will not claim that the coupon has been activated, and backend issuance remains future work.
- Local-storage frequency limits are per browser and can be cleared by the visitor. This is acceptable for the current frontend campaign preview.
- The popup competes with other homepage overlays. A dedicated z-index and body scroll lock will keep modal behavior predictable.

## Migration Plan
1. Add the standalone popup component.
2. Mount it once on the homepage.
3. Verify production build, keyboard close, backdrop close, desktop layout, and mobile layout.
4. Remove the component mount to roll back without affecting other pages.
