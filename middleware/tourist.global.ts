export default defineNuxtRouteMiddleware(async () => {
  if (!process.client) return
  const { ensureTouristToken } = await import('~/services/api')
  try {
    await ensureTouristToken()
  } catch {}
})
