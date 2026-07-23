export type ProductFilterOption = {
  id: string
  groupId: string
  translateName: string
  query?: string
  categoryId?: string
}

export type ProductFilterGroup = {
  id: string
  translateName: string
  children: ProductFilterOption[]
}

export type ProductTaxonomyNode = {
  id?: string
  categoryId: string
  parentCateId?: string
  leaf?: string
  level?: string
  translatedName: string
  chineseName?: string
  children?: ProductTaxonomyNode[]
}

type IndexedTaxonomyNode = ProductTaxonomyNode & {
  parent?: IndexedTaxonomyNode
  children?: IndexedTaxonomyNode[]
}

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'best', 'cheap', 'custom', 'factory', 'for', 'from', 'hot',
  'manufacturer', 'new', 'of', 'product', 'sale', 'supplier', 'the', 'wholesale', 'with'
])

function singularize(token: string) {
  if (token.endsWith('ies') && token.length > 4) return `${token.slice(0, -3)}y`
  if (token.endsWith('sses')) return token
  if (token.endsWith('shoes')) return token.slice(0, -1)
  if (token.endsWith('s') && token.length > 3) return token.slice(0, -1)
  return token
}

function normalize(value = '') {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function tokens(value = '') {
  return normalize(value)
    .split(' ')
    .map(singularize)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token))
}

function uniqueByName(nodes: IndexedTaxonomyNode[]) {
  const names = new Set<string>()
  return nodes.filter((node) => {
    const name = normalize(node.translatedName)
    if (!name || names.has(name)) return false
    names.add(name)
    return true
  })
}

function indexTaxonomy(roots: ProductTaxonomyNode[]) {
  const all: IndexedTaxonomyNode[] = []
  const byId = new Map<string, IndexedTaxonomyNode>()

  function visit(node: ProductTaxonomyNode, parent?: IndexedTaxonomyNode) {
    const indexed: IndexedTaxonomyNode = { ...node, parent, children: [] }
    all.push(indexed)
    byId.set(String(indexed.categoryId), indexed)
    indexed.children = (node.children || []).map(child => visit(child, indexed))
    return indexed
  }

  const indexedRoots = roots.map(root => visit(root))
  return { roots: indexedRoots, all, byId }
}

function matchScore(node: IndexedTaxonomyNode, keyword: string) {
  const keywordName = normalize(keyword)
  const nodeName = normalize(node.translatedName)
  if (!keywordName || !nodeName) return 0
  if (keywordName === nodeName) return 1000
  if (nodeName.includes(keywordName)) return 850
  if (keywordName.includes(nodeName)) return 760

  const keywordTokens = new Set(tokens(keyword))
  const nodeTokens = new Set(tokens(node.translatedName))
  const overlap = [...keywordTokens].filter(token => nodeTokens.has(token)).length
  if (!overlap) return 0

  const coverage = overlap / Math.max(keywordTokens.size, 1)
  const precision = overlap / Math.max(nodeTokens.size, 1)
  return Math.round(coverage * 420 + precision * 260 + Number(node.level || 0) * 10)
}

function option(groupId: string, node: IndexedTaxonomyNode): ProductFilterOption {
  return {
    id: `taxonomy:${node.categoryId}`,
    groupId,
    translateName: node.translatedName,
    categoryId: String(node.categoryId)
  }
}

export function buildProductTaxonomyFilters(
  roots: ProductTaxonomyNode[],
  keyword: string,
  categoryId?: string
): ProductFilterGroup[] {
  if (!Array.isArray(roots) || !roots.length) return []

  const { all, byId } = indexTaxonomy(roots)
  const exactCategory = categoryId ? byId.get(String(categoryId)) : undefined
  const matched = exactCategory || all
    .map(node => ({ node, score: matchScore(node, keyword) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)[0]?.node

  if (!matched) return []

  const queryTokens = tokens(keyword || matched.translatedName)
  const matchedTokens = new Set(tokens(matched.translatedName))
  const categoryAlignedTokens = queryTokens.filter(token => matchedTokens.has(token))
  const signatureCandidates = categoryAlignedTokens.length ? categoryAlignedTokens : queryTokens
  const tokenFrequency = new Map<string, number>()
  signatureCandidates.forEach((token) => {
    tokenFrequency.set(token, all.filter(node => tokens(node.translatedName).includes(token)).length)
  })
  const signatureToken = [...signatureCandidates]
    .filter(token => (tokenFrequency.get(token) || 0) > 0)
    .sort((a, b) => (tokenFrequency.get(a) || 0) - (tokenFrequency.get(b) || 0))[0]

  const groups: ProductFilterGroup[] = []
  if (signatureToken) {
    const productTypes = uniqueByName(all
      .filter(node => node.leaf === '1' && tokens(node.translatedName).includes(signatureToken))
      .sort((a, b) => {
        if (a.categoryId === matched.categoryId) return -1
        if (b.categoryId === matched.categoryId) return 1
        return matchScore(b, keyword) - matchScore(a, keyword)
      }))
      .slice(0, 14)

    if (productTypes.length > 1) {
      const groupId = `taxonomy:type:${signatureToken}`
      groups.push({
        id: groupId,
        translateName: 'Product type',
        children: productTypes.map(node => option(groupId, node))
      })
    }
  }

  const contextNode = matched.children?.length ? matched : matched.parent
  if (contextNode?.children?.length) {
    const contextChildren = uniqueByName([...contextNode.children]
      .sort((a, b) => {
        if (a.categoryId === matched.categoryId) return -1
        if (b.categoryId === matched.categoryId) return 1
        return matchScore(b, keyword) - matchScore(a, keyword)
      }))
      .slice(0, 16)

    if (contextChildren.length > 1) {
      const groupId = `taxonomy:context:${contextNode.categoryId}`
      groups.push({
        id: groupId,
        translateName: contextNode.translatedName || 'Related categories',
        children: contextChildren.map(node => option(groupId, node))
      })
    }
  }

  return groups.slice(0, 2)
}

export function isLocalFilterId(id: string | number) {
  const value = String(id)
  return value.startsWith('taxonomy:') || value.startsWith('refinement:')
}

export function isTaxonomyFilter(item: ProductFilterOption) {
  return String(item.id).startsWith('taxonomy:') && Boolean(item.categoryId)
}
