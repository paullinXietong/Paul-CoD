import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('../../pages/productDetail.vue', import.meta.url), 'utf8')

test('SKU names wrap without a fixed width and keep detail controls in their own column', () => {
  assert.doesNotMatch(source, /style="width:\s*351px\s*;?"/)
  assert.match(source, /class="px-2 my-3 sku-row"/)
  assert.match(source, /class="sku-detail"/)
  assert.match(source, /\.sku-row\s*\{[^}]*display:grid/s)
  assert.match(source, /\.skuTitle\s*\{[^}]*white-space:normal/s)
  assert.match(source, /overflow-wrap:anywhere/)
})

test('narrow mobile layouts stack SKU details below the wrapped name', () => {
  assert.match(source, /@media\s*\(max-width:\s*520px\)/)
  assert.match(source, /grid-template-columns:\s*minmax\(0,1fr\)/)
  assert.match(source, /\.sku-detail\s*\{[^}]*width:100%/s)
})

test('SKU quantity stepper and manual input handlers remain wired', () => {
  assert.match(source, /@click="reduceNum\(index\)"/)
  assert.match(source, /@click="addNum\(index\)"/)
  assert.match(source, /v-model="skuNumber\[actionColor\]\.sizeNumber\[index\]"/)
  assert.match(source, /@blur="blurNumber\(index\)"/)
})
