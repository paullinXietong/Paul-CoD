# Change: Add New User Shipping Coupon Popup

## Why
The current Nuxt storefront has no entry point for the new-user shipping coupon campaign implemented in `New codropshipping`. Adding the campaign popup to the homepage lets signed-out visitors discover and draw a coupon without changing the existing product, search, or activity-page flows.

## What Changes
- Add a Vue 3 shipping coupon popup based on the `ShippingCouponPopup` interaction from `New codropshipping`.
- Show it on the storefront homepage after a short delay for visitors without `userInfo` in local storage.
- Preserve the original draw amounts, automatic draw, impression limit, close behavior, and delayed reopening rule.
- Store the drawn amount locally before sending the visitor to the existing `/admin/signUp` registration page.
- Add keyboard, backdrop, reduced-motion, scroll-lock, desktop, and mobile behavior for the modal.
- Keep coupon issuing and server-side redemption outside this frontend-only change.

## Impact
- Affected specs: `shipping-coupon-popup`
- Affected code: `components/ShippingCouponPopup.vue`, `pages/index.vue`
- Existing routes, navigation labels, product APIs, and `/activity` behavior remain unchanged.
