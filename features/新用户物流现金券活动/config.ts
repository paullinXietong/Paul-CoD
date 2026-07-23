export const newUserShippingCouponActivity = {
  name: '新用户物流现金券活动',
  campaignCode: 'new_user_shipping_2026',
  initialDelayMs: 3_000,
  reopenDelayMs: 5 * 60 * 1_000,
  maximumImpressions: 3,
  couponOptions: [
    { amount: 5, weight: 78, minimum: 99 },
    { amount: 8, weight: 19, minimum: 149 },
    { amount: 10, weight: 2, minimum: 199 },
    { amount: 18, weight: 0.7, minimum: 399 },
    { amount: 20, weight: 0.2, minimum: 499 },
    { amount: 30, weight: 0.06, minimum: 799 },
    { amount: 50, weight: 0.02, minimum: 1499 },
    { amount: 100, weight: 0.02, minimum: 2999 },
  ],
} as const

export function isNewUserShippingCouponActivityEnabled(value: unknown) {
  return value !== false && String(value).toLowerCase() !== 'false'
}
