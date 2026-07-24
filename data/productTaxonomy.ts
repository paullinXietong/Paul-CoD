export type ProductFilterOption = {
  id: string
  groupId: string
  translateName: string
  query?: string
  categoryId?: string
  count?: number
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
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

function taxonomyTokens(node: ProductTaxonomyNode) {
  return [...new Set([
    ...tokens(node.translatedName),
    ...tokens(node.chineseName || '')
  ])]
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
  const nodeNames = [node.translatedName, node.chineseName || ''].map(normalize).filter(Boolean)
  if (!keywordName || !nodeNames.length) return 0
  if (nodeNames.some(nodeName => keywordName === nodeName)) return 1000
  if (nodeNames.some(nodeName => nodeName.includes(keywordName))) return 850
  if (nodeNames.some(nodeName => keywordName.includes(nodeName))) return 760

  const keywordTokens = new Set(tokens(keyword))
  const nodeTokens = new Set(taxonomyTokens(node))
  const overlap = [...keywordTokens].filter(token => nodeTokens.has(token)).length
  if (!overlap) return 0

  const coverage = overlap / Math.max(keywordTokens.size, 1)
  const precision = overlap / Math.max(nodeTokens.size, 1)
  return Math.round(coverage * 420 + precision * 260 + Number(node.level || 0) * 10)
}

function option(groupId: string, node: IndexedTaxonomyNode, count?: number): ProductFilterOption {
  return {
    id: `taxonomy:${node.categoryId}`,
    groupId,
    translateName: node.translatedName,
    categoryId: String(node.categoryId),
    count
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
  const matchedTokens = new Set(taxonomyTokens(matched))
  const categoryAlignedTokens = queryTokens.filter(token => matchedTokens.has(token))
  const signatureCandidates = categoryAlignedTokens.length ? categoryAlignedTokens : queryTokens
  const tokenFrequency = new Map<string, number>()
  signatureCandidates.forEach((token) => {
    tokenFrequency.set(token, all.filter(node => taxonomyTokens(node).includes(token)).length)
  })
  const signatureToken = [...signatureCandidates]
    .filter(token => (tokenFrequency.get(token) || 0) > 0)
    .sort((a, b) => (tokenFrequency.get(a) || 0) - (tokenFrequency.get(b) || 0))[0]

  const groups: ProductFilterGroup[] = []
  if (signatureToken) {
    const productTypes = uniqueByName(all
      .filter(node => node.leaf === '1' && taxonomyTokens(node).includes(signatureToken))
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
    const siblings = [...contextNode.children]
    const relevantSiblings = categoryId
      ? siblings
      : siblings.filter(node => (
          matchScore(node, keyword) > 0
          || Boolean(signatureToken && taxonomyTokens(node).includes(signatureToken))
        ))
    const contextChildren = uniqueByName((relevantSiblings.length ? relevantSiblings : [matched])
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

type ProductCategorySource = {
  topCategoryId?: string | number
  secondCategoryId?: string | number
  thirdCategoryId?: string | number
}

export type ProductCategoryFacet = {
  categoryId: string | number
  level?: number
  count?: number
}

export function buildResultCategoryFilters(
  roots: ProductTaxonomyNode[],
  products: ProductCategorySource[],
  categoryFacets: ProductCategoryFacet[] = []
): ProductFilterGroup[] {
  if (
    !Array.isArray(roots)
    || !roots.length
    || (!products.length && !categoryFacets.length)
  ) return []
  const { byId } = indexTaxonomy(roots)
  const scores = new Map<string, number>()
  const counts = new Map<string, number>()
  if (categoryFacets.length) {
    categoryFacets.forEach((facet) => {
      const id = String(facet.categoryId || '')
      const level = Number(facet.level || byId.get(id)?.level || 1)
      const levelWeight = level >= 3 ? 5 : level === 2 ? 3 : 1
      if (id && byId.has(id)) {
        const count = Math.max(Number(facet.count || 1), 1)
        counts.set(id, (counts.get(id) || 0) + count)
        scores.set(id, (scores.get(id) || 0) + count * levelWeight)
      }
    })
  } else {
    products.forEach((product) => {
      const weightedIds = [
        [product.thirdCategoryId, 5],
        [product.secondCategoryId, 3],
        [product.topCategoryId, 1]
      ] as const
      weightedIds.forEach(([categoryId, weight]) => {
        const id = String(categoryId || '')
        if (id && byId.has(id)) {
          counts.set(id, (counts.get(id) || 0) + 1)
          scores.set(id, (scores.get(id) || 0) + weight)
        }
      })
    })
  }

  const rankedNodes = [...scores.entries()]
    .map(([id, score]) => ({ node: byId.get(id), score }))
    .filter((item): item is { node: IndexedTaxonomyNode; score: number } => Boolean(item.node))
    .sort((a, b) => b.score - a.score || Number(b.node.level || 0) - Number(a.node.level || 0))

  const productTypes = uniqueByName(
    rankedNodes
      .filter(item => item.node.leaf === '1' || Number(item.node.level || 0) >= 3)
      .map(item => item.node)
  ).slice(0, 14)

  const groups: ProductFilterGroup[] = []
  if (productTypes.length) {
    const groupId = 'taxonomy:results:types'
    groups.push({
      id: groupId,
      translateName: 'Matching product types',
      children: productTypes.map(node => option(groupId, node, counts.get(node.categoryId)))
    })
  }

  const productFamilies = uniqueByName(
    rankedNodes
      .filter(item => Number(item.node.level || 0) === 2)
      .map(item => item.node)
  ).slice(0, 10)
  if (productFamilies.length) {
      const groupId = 'taxonomy:results:families'
      groups.push({
        id: groupId,
        translateName: 'Product families',
        children: productFamilies.map(node => option(groupId, node, counts.get(node.categoryId)))
      })
  }
  return groups.slice(0, 2)
}

export function mergeCategoryFilterGroups(
  primary: ProductFilterGroup[],
  secondary: ProductFilterGroup[]
) {
  const usedIds = new Set<string>()
  const merged: ProductFilterGroup[] = []
  for (const group of [...primary, ...secondary]) {
    const children = group.children.filter((child) => {
      const id = String(child.categoryId || child.id)
      if (usedIds.has(id)) return false
      usedIds.add(id)
      return true
    })
    if (children.length) merged.push({ ...group, children })
    if (merged.length >= 2) break
  }
  return merged
}

export function isLocalFilterId(id: string | number) {
  const value = String(id)
  return value.startsWith('taxonomy:') || value.startsWith('refinement:')
}

export function isTaxonomyFilter(item: ProductFilterOption) {
  return String(item.id).startsWith('taxonomy:') && Boolean(item.categoryId)
}
