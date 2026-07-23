import { UAParser } from 'ua-parser-js'

export default defineNuxtPlugin(() => {
  ;(globalThis as typeof globalThis & { UAParser: typeof UAParser }).UAParser = UAParser
})
