import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {fullAddress} from '../lib/site'
import {applyCustomerCatalogueRules, visibleLockTypes} from '../lib/customer-catalogue-rules'
import {fallbackCategories, type Product} from '../lib/products'

const sourceCatalogue = JSON.parse(
  readFileSync(fileURLToPath(new URL('../lib/reviewed-catalogue.json', import.meta.url)), 'utf8'),
) as Product[]
const catalogue = applyCustomerCatalogueRules(sourceCatalogue)

const bySlug = (slug: string) => catalogue.find((product) => product.slug === slug)

test('fallback catalogue removes the image-less A7L product', () => {
  assert.equal(bySlug('achiever-a7l'), undefined)
})

test('customer-visible access filters omit the unsupported mechanical category', () => {
  assert.deepEqual(visibleLockTypes, ['electronic', 'fingerprint', 'face'])
})

test('series summaries no longer advertise removed or reclassified products', () => {
  const text = fallbackCategories
    .flatMap((category) => [category.descriptor.en, category.summary.en])
    .join(' ')

  assert.doesNotMatch(text, /A7L/i)
  assert.doesNotMatch(text, /bronze fingerprint/i)
})

test('fallback catalogue never mixes customer-visible access categories', () => {
  for (const product of catalogue) {
    const actual = [...new Set(product.models.flatMap((model) => model.lockTypes))]
    assert.ok(actual.length <= 1, `${product.slug} appears in multiple access categories`)
    assert.notEqual(actual[0], 'mechanical', `${product.slug} appears in the removed mechanical category`)
  }
})

test('fallback catalogue applies the customer-approved primary access category', () => {
  const expected = {
    'achiever-a3-walnut': ['fingerprint'],
    'lingzhi-cream-catalogue': ['fingerprint'],
    'lingzhi-bronze-catalogue': ['fingerprint'],
    'upgraded-bronze-fingerprint': ['electronic'],
  } as const

  for (const [slug, lockTypes] of Object.entries(expected)) {
    const product = bySlug(slug)
    assert.ok(product, `${slug} must remain in the fallback catalogue`)
    const actual = [...new Set(product.models.flatMap((model) => model.lockTypes))]
    assert.deepEqual(actual, lockTypes, `${slug} has the wrong customer-visible category`)
  }
})

test('fallback catalogue calls the corrected upgraded product electronic', () => {
  assert.equal(bySlug('upgraded-bronze-fingerprint')?.name.en, 'Upgraded Bronze Electronic')
})

test('fallback contact address excludes the unverified street and number', () => {
  assert.equal(fullAddress, 'Jinyanshan Industrial Area, Quanxi Town, Wuyi County, Zhejiang, China')
})
