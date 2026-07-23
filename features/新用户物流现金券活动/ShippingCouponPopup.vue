<template>
  <Teleport to="body">
    <div v-if="isOpen" class="shipping-coupon-layer" role="presentation">
      <div
        class="shipping-coupon-backdrop"
        aria-hidden="true"
        @click="closeCoupon"
      />

      <section
        ref="dialogRef"
        class="shipping-coupon-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shipping-coupon-title"
        aria-describedby="shipping-coupon-description"
      >
        <button
          ref="closeButtonRef"
          class="shipping-coupon-close"
          type="button"
          aria-label="Close shipping coupon offer"
          @click="closeCoupon"
        >
          <span aria-hidden="true">×</span>
        </button>

        <div class="shipping-coupon-copy">
          <p class="shipping-coupon-kicker">New user shipping coupon</p>
          <h2 id="shipping-coupon-title">Claim $5-$100 off shipping</h2>
          <p id="shipping-coupon-description" class="shipping-coupon-text">
            Sign up to activate one shipping coupon. The final reward is confirmed by your account.
          </p>
        </div>

        <div class="shipping-coupon-ticket" aria-live="polite">
          <div class="shipping-coupon-topline">
            <span>Coupon amount</span>
            <span>{{ hasWonCoupon ? 'Coupon won' : 'Drawing now' }}</span>
          </div>

          <div
            class="shipping-coupon-amount"
            :aria-label="`Current coupon amount is ${currentAmount} dollars`"
          >
            <span>$</span>
            <strong :key="currentAmount">{{ currentAmount }}</strong>
          </div>

          <a
            v-if="hasWonCoupon"
            class="shipping-coupon-action"
            href="/admin/signUp"
            @click="claimCoupon"
          >
            Sign up to claim
          </a>
          <button
            v-else
            class="shipping-coupon-action shipping-coupon-action-disabled"
            type="button"
            disabled
          >
            Drawing...
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import {
  isNewUserShippingCouponActivityEnabled,
  newUserShippingCouponActivity,
} from './config'

const couponOptions = newUserShippingCouponActivity.couponOptions
const couponAmounts = couponOptions.map((option) => option.amount)
const campaignCode = newUserShippingCouponActivity.campaignCode
const userInfoKey = 'userInfo'
const couponImpressionKey = 'coddrop_shipping_coupon_impressions'
const couponNextOpenKey = 'coddrop_shipping_coupon_next_open'
const pendingCouponKey = 'coddrop_pending_coupon_amount'
const pendingCouponCampaignKey = 'coddrop_pending_coupon_campaign'
const pendingCouponMinimumKey = 'coddrop_pending_coupon_minimum'
const couponInitialDelayMs = newUserShippingCouponActivity.initialDelayMs
const couponReopenDelayMs = newUserShippingCouponActivity.reopenDelayMs
const couponMaximumImpressions = newUserShippingCouponActivity.maximumImpressions

type CouponDrawStatus = 'drawing' | 'won'

const isOpen = ref(false)
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const drawStatus = ref<CouponDrawStatus>('drawing')
const currentAmount = ref<number>(couponAmounts[0])
const currentCoupon = computed(() => (
  couponOptions.find((option) => option.amount === currentAmount.value) || couponOptions[0]
))
const dialogRef = ref<HTMLElement | null>(null)
const closeButtonRef = ref<HTMLButtonElement | null>(null)
const hasWonCoupon = computed(() => drawStatus.value === 'won')
const isLocalPreview = computed(() => import.meta.dev && route.query.couponPreview === '1')
const activityEnabled = computed(() => (
  isNewUserShippingCouponActivityEnabled(
    runtimeConfig.public.newUserShippingCouponEnabled
  )
))

let openTimer: number | undefined
let rollTimer: number | undefined
let resultTimer: number | undefined
let previousFocusedElement: HTMLElement | null = null
let previousBodyOverflow = ''

function getStorageNumber(key: string) {
  const value = Number(window.localStorage.getItem(key) || '0')
  return Number.isFinite(value) ? value : 0
}

function hasSignedInUser() {
  const cachedUser = window.localStorage.getItem(userInfoKey)
  if (!cachedUser) return false

  try {
    const parsedUser = JSON.parse(cachedUser)
    return Boolean(
      parsedUser &&
      typeof parsedUser === 'object' &&
      (parsedUser.id || parsedUser.email || window.localStorage.getItem('TOKEN'))
    )
  } catch {
    return false
  }
}

function isEligibleForCoupon() {
  return activityEnabled.value && (
    isLocalPreview.value || (
      !hasSignedInUser() && getStorageNumber(couponImpressionKey) < couponMaximumImpressions
    )
  )
}

function clearDrawTimers() {
  if (rollTimer !== undefined) window.clearInterval(rollTimer)
  if (resultTimer !== undefined) window.clearTimeout(resultTimer)
  rollTimer = undefined
  resultTimer = undefined
}

function pickCouponAmount() {
  const draw = Math.random() * 100
  let cumulativeWeight = 0

  for (const option of couponOptions) {
    cumulativeWeight += option.weight
    if (draw < cumulativeWeight) return option.amount
  }

  return couponOptions[couponOptions.length - 1].amount
}

function startDraw() {
  clearDrawTimers()
  drawStatus.value = 'drawing'
  currentAmount.value = couponAmounts[0]

  let index = 0
  rollTimer = window.setInterval(() => {
    index = (index + 1) % couponAmounts.length
    currentAmount.value = couponAmounts[index]
  }, 80)

  resultTimer = window.setTimeout(() => {
    if (rollTimer !== undefined) window.clearInterval(rollTimer)
    rollTimer = undefined
    currentAmount.value = pickCouponAmount()
    drawStatus.value = 'won'
  }, 1_000)
}

async function openCoupon() {
  if (!isEligibleForCoupon()) return

  if (!isLocalPreview.value) {
    const impressions = getStorageNumber(couponImpressionKey)
    window.localStorage.setItem(couponImpressionKey, String(impressions + 1))
    window.localStorage.removeItem(couponNextOpenKey)
  }

  previousFocusedElement = document.activeElement instanceof HTMLElement
    ? document.activeElement
    : null
  previousBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  isOpen.value = true
  startDraw()

  await nextTick()
  closeButtonRef.value?.focus()
}

function scheduleCoupon() {
  if (openTimer !== undefined) window.clearTimeout(openTimer)
  if (!isEligibleForCoupon()) return

  const storedNextOpen = getStorageNumber(couponNextOpenKey)
  const nextOpenAt = isLocalPreview.value
    ? Date.now()
    : storedNextOpen > 0
      ? storedNextOpen
      : Date.now() + couponInitialDelayMs

  openTimer = window.setTimeout(() => {
    openTimer = undefined
    void openCoupon()
  }, Math.max(0, nextOpenAt - Date.now()))
}

function restorePageAfterDialog() {
  document.body.style.overflow = previousBodyOverflow
  previousFocusedElement?.focus()
  previousFocusedElement = null
}

function closeCoupon() {
  if (!isOpen.value) return

  clearDrawTimers()
  isOpen.value = false
  restorePageAfterDialog()

  if (!isLocalPreview.value && isEligibleForCoupon()) {
    window.localStorage.setItem(couponNextOpenKey, String(Date.now() + couponReopenDelayMs))
    scheduleCoupon()
  }
}

function claimCoupon() {
  window.localStorage.setItem(pendingCouponKey, String(currentAmount.value))
  window.localStorage.setItem(pendingCouponCampaignKey, campaignCode)
  window.localStorage.setItem(pendingCouponMinimumKey, String(currentCoupon.value.minimum))
}

function handleDialogKeydown(event: KeyboardEvent) {
  if (!isOpen.value) return

  if (event.key === 'Escape') {
    event.preventDefault()
    closeCoupon()
    return
  }

  if (event.key !== 'Tab' || !dialogRef.value) return

  const focusableElements = Array.from(
    dialogRef.value.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
  ).filter((element) => !element.hasAttribute('tabindex') || element.tabIndex >= 0)

  if (focusableElements.length === 0) return

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement.focus()
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement.focus()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleDialogKeydown)
  scheduleCoupon()
})

onUnmounted(() => {
  if (openTimer !== undefined) window.clearTimeout(openTimer)
  clearDrawTimers()
  document.removeEventListener('keydown', handleDialogKeydown)
  if (isOpen.value) restorePageAfterDialog()
})
</script>

<style scoped>
.shipping-coupon-layer {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  padding: 24px;
}

.shipping-coupon-backdrop {
  position: absolute;
  inset: 0;
  background: rgb(5 24 54 / 48%);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.shipping-coupon-dialog {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(246px, 0.92fr);
  gap: 22px;
  width: min(100%, 678px);
  overflow: hidden;
  border: 1px solid rgb(255 118 52 / 34%);
  border-radius: 10px;
  background:
    linear-gradient(135deg, rgb(253 253 253 / 98%), rgb(248 250 253 / 94%)),
    #fdfdfd;
  box-shadow: 0 28px 80px rgb(5 24 54 / 24%);
}

.shipping-coupon-dialog::before {
  position: absolute;
  top: -94px;
  right: -96px;
  width: 214px;
  height: 214px;
  border-radius: 50%;
  background: rgb(255 118 52 / 12%);
  content: '';
}

.shipping-coupon-close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 1px solid rgb(5 24 54 / 14%);
  border-radius: 50%;
  background: #fdfdfd;
  color: #253044;
  font: inherit;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  transition: transform 160ms ease, border-color 160ms ease;
}

.shipping-coupon-close:hover {
  border-color: rgb(255 118 52 / 70%);
}

.shipping-coupon-close:active {
  transform: translateY(1px);
}

.shipping-coupon-close:focus-visible,
.shipping-coupon-action:focus-visible {
  outline: 3px solid rgb(255 118 52 / 46%);
  outline-offset: 3px;
}

.shipping-coupon-close span {
  margin-top: -2px;
}

.shipping-coupon-copy {
  position: relative;
  z-index: 1;
  align-self: center;
  padding: 38px 0 34px 38px;
}

.shipping-coupon-kicker {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  margin: 0 0 14px;
  padding: 0 12px;
  border: 1px solid rgb(255 118 52 / 44%);
  border-radius: 999px;
  background: rgb(255 118 52 / 9%);
  color: #c6420a;
  font-size: 11px;
  font-weight: 800;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.shipping-coupon-copy h2 {
  max-width: 320px;
  margin: 0;
  color: #071932;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 36px;
  font-weight: 800;
  line-height: 1.04;
  letter-spacing: -0.025em;
}

.shipping-coupon-text {
  max-width: 320px;
  margin: 14px 0 0;
  color: #4e596b;
  font-size: 14px;
  line-height: 1.45;
}

.shipping-coupon-ticket {
  position: relative;
  z-index: 1;
  display: grid;
  align-content: space-between;
  min-height: 318px;
  margin: 22px 22px 22px 0;
  padding: 22px;
  overflow: hidden;
  border-radius: 8px;
  background: linear-gradient(145deg, rgb(5 24 54 / 98%), rgb(19 46 104 / 96%));
  color: #f8fafc;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 16%);
}

.shipping-coupon-ticket::before {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(120deg, transparent 0%, rgb(255 255 255 / 16%) 36%, transparent 58%),
    radial-gradient(circle at 92% 8%, rgb(255 118 52 / 38%), transparent 28%);
  content: '';
  opacity: 0.72;
  transform: translateX(-18%);
}

.shipping-coupon-topline,
.shipping-coupon-action,
.shipping-coupon-amount {
  position: relative;
  z-index: 1;
}

.shipping-coupon-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: rgb(248 250 252 / 78%);
  font-size: 11px;
  font-weight: 800;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.shipping-coupon-amount {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 4px;
  margin: 34px 0 24px;
  color: #f8fafc;
  line-height: 0.9;
  text-shadow: 0 8px 20px rgb(5 24 54 / 32%);
}

.shipping-coupon-amount span {
  margin-top: 12px;
  color: #ffb27a;
  font-size: 34px;
  font-weight: 900;
}

.shipping-coupon-amount strong {
  font-size: 96px;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.shipping-coupon-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 44px;
  padding: 0 18px;
  border: 0;
  border-radius: 999px;
  background: #ff7634;
  color: #071932;
  font: inherit;
  font-size: 14px;
  font-weight: 800;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  box-shadow: 0 10px 20px rgb(255 118 52 / 26%);
  transition: transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease;
}

.shipping-coupon-action:hover {
  box-shadow: 0 12px 24px rgb(255 118 52 / 34%);
}

.shipping-coupon-action:active {
  transform: translateY(1px);
}

.shipping-coupon-action:disabled,
.shipping-coupon-action-disabled {
  cursor: wait;
  opacity: 0.74;
  box-shadow: none;
}

@media (prefers-reduced-motion: no-preference) {
  .shipping-coupon-dialog {
    animation: shipping-coupon-dialog-in 360ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .shipping-coupon-backdrop {
    animation: shipping-coupon-backdrop-in 240ms ease both;
  }

  .shipping-coupon-ticket::before {
    animation: shipping-coupon-ticket-shine 2.8s ease-in-out infinite;
  }

  .shipping-coupon-amount strong {
    animation: shipping-coupon-amount-lift 180ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }
}

@keyframes shipping-coupon-dialog-in {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.97);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes shipping-coupon-backdrop-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes shipping-coupon-ticket-shine {
  0%, 64% { transform: translateX(-22%); }
  100% { transform: translateX(42%); }
}

@keyframes shipping-coupon-amount-lift {
  from {
    opacity: 0;
    transform: translateY(7px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-transparency: reduce) {
  .shipping-coupon-backdrop {
    background: rgb(5 24 54 / 78%);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}

@media (max-width: 680px) {
  .shipping-coupon-layer {
    align-items: end;
    padding: 14px;
  }

  .shipping-coupon-dialog {
    grid-template-columns: 1fr;
    gap: 0;
    width: min(100%, 420px);
    max-height: calc(100dvh - 28px);
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .shipping-coupon-copy {
    padding: 34px 24px 8px;
  }

  .shipping-coupon-copy h2 {
    max-width: none;
    font-size: 30px;
  }

  .shipping-coupon-text {
    max-width: none;
  }

  .shipping-coupon-ticket {
    min-height: 280px;
    margin: 14px;
    padding: 20px;
  }

  .shipping-coupon-amount {
    margin: 24px 0 18px;
  }

  .shipping-coupon-amount strong {
    font-size: 82px;
  }

  .shipping-coupon-amount span {
    font-size: 30px;
  }
}

@media (max-width: 380px) {
  .shipping-coupon-layer {
    padding: 8px;
  }

  .shipping-coupon-dialog {
    max-height: calc(100dvh - 16px);
  }

  .shipping-coupon-copy {
    padding: 30px 20px 6px;
  }

  .shipping-coupon-copy h2 {
    font-size: 27px;
  }

  .shipping-coupon-ticket {
    min-height: 250px;
    margin: 10px;
    padding: 18px;
  }

  .shipping-coupon-amount strong {
    font-size: 70px;
  }
}
</style>
