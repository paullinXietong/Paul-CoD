import { onBeforeUnmount, type Ref } from 'vue'
import { getKeywordRecommendation, parsePromotionText } from '~/services/api'

type SearchDestination = {
  url: string
  target: '_self' | '_blank'
}

export async function resolveSearchDestination(
  rawKeyword: string,
  fallback: (keyword: string) => string
): Promise<SearchDestination | null> {
  const keyword = String(rawKeyword || '').trim()
  if (!keyword) return null

  const offerId = keyword.match(/^https:\/\/detail\.1688\.com\/.*?offer\/(\d+)\.html/i)?.[1]
    || keyword.match(/offer\/(\d+)\.html/i)?.[1]
  if (offerId) {
    return { url: `/productDetail?id=${offerId}&source=1`, target: '_blank' }
  }

  try {
    const response = await parsePromotionText({ keyword })
    const productId = response.data?.data?.product_id
    if (productId) {
      return { url: `/productDetail?id=${productId}&source=1`, target: '_blank' }
    }
  } catch (error) {
    // Promotion parsing is an optional shortcut. A failure must never block a
    // normal keyword search, especially in local development.
    console.warn('Promotion parsing unavailable; continuing with keyword search.', error)
  }

  return { url: fallback(keyword), target: '_self' }
}

export function useKeywordSuggestions(
  text: Ref<string>,
  keywordList: Ref<any[]>,
  keywordShow: Ref<boolean>,
  delay = 300
) {
  let timer: ReturnType<typeof setTimeout> | undefined
  let requestSequence = 0

  const loadSuggestions = () => {
    const keyword = String(text.value || '').trim()
    requestSequence += 1
    const sequence = requestSequence
    if (timer) clearTimeout(timer)

    if (!keyword) {
      keywordList.value = []
      keywordShow.value = false
      return
    }

    timer = setTimeout(async () => {
      try {
        const response = await getKeywordRecommendation({ keyword })
        if (sequence !== requestSequence) return
        keywordList.value = Array.isArray(response.data?.data) ? response.data.data : []
        keywordShow.value = keywordList.value.length > 0
      } catch (error) {
        if (sequence !== requestSequence) return
        keywordList.value = []
        keywordShow.value = false
        console.warn('Keyword suggestions unavailable.', error)
      }
    }, delay)
  }

  onBeforeUnmount(() => {
    requestSequence += 1
    if (timer) clearTimeout(timer)
  })

  return loadSuggestions
}
