export default defineNuxtConfig({
  ssr: false,
  modules: ['@nuxtjs/tailwindcss', 'nuxt-swiper'],
  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'https://test-codrop.cargosoon.online/api',
      orderUrl: process.env.NUXT_PUBLIC_ORDER_URL || 'https://test-codrop.cargosoon.online/admin/order',
      loginUrl: process.env.NUXT_PUBLIC_LOGIN_URL || 'https://test-codrop.cargosoon.online/admin/login',
      wssUrl: process.env.NUXT_PUBLIC_WSS_URL || 'wss://testchat.cargosoon.online/wss',
      mallBaseUrl: process.env.NUXT_PUBLIC_MALL_BASE_URL || 'https://cc.cargosoon.online',
      newUserShippingCouponEnabled: process.env.NUXT_PUBLIC_NEW_USER_SHIPPING_COUPON_ENABLED !== 'false'
    }
  },
  app: {
    head: {
      title: 'Codropshipping - China sourcing & dropshipping platform',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Professional China sourcing agent for 1688 and Alibaba. Fast global shipping, quality inspection, and warehouse services. Start dropshipping from China today!' },
        {
          property: 'og:title',
          content: 'Codropshipping - China Sourcing & Dropshipping'
        },
        {
          property: 'og:description',
          content: 'Professional China sourcing agent for 1688 and Alibaba'
        },
        {
          property: 'og:image',
          content: 'https://codropshipping.com/CoDropshipping.png'
        },
        {
          property: 'og:url',
          content: 'https://codropshipping.com'
        },
        {
          property: 'og:type',
          content: 'website'
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap' },
        { rel: 'canonical', href: 'https://codropshipping.com/' }
      ]
    }
  },
  css: [
    'element-plus/dist/index.css'
  ],
  
  plugins: [
    '~/plugins/element-plus.client.ts'
  ],
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css'
  },
  compatibilityDate: "2025-11-20",
  vite: {
    server: {
      proxy: {
        // Keep the legacy storefront and member center on one local origin.
        // codropshipping-serve is mounted at /admin/ in production as well.
        '/admin': {
          target: process.env.NUXT_DEV_ADMIN_TARGET || 'http://127.0.0.1:8083',
          changeOrigin: true,
          ws: true
        },
        // The Vue 2 member center calls the backend through a same-origin /api URL.
        '/api': {
          target: process.env.NUXT_DEV_API_TARGET || 'https://codropshipping.com',
          changeOrigin: true,
          secure: true
        },
        // The mall service only allows the production origin. Proxy it locally so
        // search submission works without weakening CORS in the browser.
        '/mall-api': {
          target: process.env.NUXT_DEV_MALL_TARGET || 'https://v2.cargosoon.online',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/mall-api/, '')
        }
      },
      hmr: {
        port: 24680
      }
    }
  }
})
