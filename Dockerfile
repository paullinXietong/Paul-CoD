# syntax=docker/dockerfile:1

FROM node:22.13-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22.13-alpine AS builder
WORKDIR /app

ARG NUXT_PUBLIC_BASE_URL=/api
ARG NUXT_PUBLIC_ORDER_URL=/admin/order
ARG NUXT_PUBLIC_LOGIN_URL=/admin/login
ARG NUXT_PUBLIC_WSS_URL=wss://chat.co-logistics.cn/wss
ARG NUXT_PUBLIC_MALL_BASE_URL=/mall-api
ARG NUXT_PUBLIC_NEW_USER_SHIPPING_COUPON_ENABLED=false

ENV NODE_ENV=production \
    NUXT_PUBLIC_BASE_URL=${NUXT_PUBLIC_BASE_URL} \
    NUXT_PUBLIC_ORDER_URL=${NUXT_PUBLIC_ORDER_URL} \
    NUXT_PUBLIC_LOGIN_URL=${NUXT_PUBLIC_LOGIN_URL} \
    NUXT_PUBLIC_WSS_URL=${NUXT_PUBLIC_WSS_URL} \
    NUXT_PUBLIC_MALL_BASE_URL=${NUXT_PUBLIC_MALL_BASE_URL} \
    NUXT_PUBLIC_NEW_USER_SHIPPING_COUPON_ENABLED=${NUXT_PUBLIC_NEW_USER_SHIPPING_COUPON_ENABLED}

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22.13-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    NITRO_HOST=0.0.0.0 \
    NITRO_PORT=3000

RUN addgroup -S nodejs && adduser -S appuser -G nodejs
COPY --from=builder --chown=appuser:nodejs /app/.output ./.output

USER appuser
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]

