const TENANT_ID = 'df54bef0-b29d-46ab-92dd-f7858cc364af'
const APPLY = process.argv.includes('--apply')

const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!base || !serviceKey) throw new Error('Supabase service credentials are required')

const headers = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  'Content-Type': 'application/json',
}

async function rest(path, init = {}) {
  const {headers: extraHeaders, ...request} = init
  const response = await fetch(`${base}/rest/v1/${path}`, {...request, headers: {...headers, ...extraHeaders}})
  const text = await response.text()
  if (!response.ok) throw new Error(`${init.method || 'GET'} ${path} failed (${response.status}): ${text}`)
  return text ? JSON.parse(text) : null
}

const primaryAccessBySlug = {
  'achiever-a2-redwood': 'fingerprint',
  'achiever-a2-white-oak': 'fingerprint',
  'achiever-a3-walnut': 'fingerprint',
  'achiever-a6-grey-original': 'fingerprint',
  'upgraded-bronze-fingerprint': 'electronic',
  'upgraded-digital': 'electronic',
  'lingzhi-bronze-fingerprint': 'fingerprint',
  'lingzhi-cream-fingerprint': 'fingerprint',
  'lingzhi-bronze-digital': 'electronic',
  'lingzhi-cream-digital': 'electronic',
  'achiever-a6-champagne': 'fingerprint',
  'achiever-a6-grey-catalogue': 'fingerprint',
  'achiever-a7': 'face',
  'lingzhi-cream-catalogue': 'fingerprint',
  'lingzhi-bronze-catalogue': 'fingerprint',
  yongning: 'fingerprint',
}

const replaceMechanicalClaim = (value) => value
  .replace(/mechanical,\s*electronic and fingerprint/gi, (match) =>
    /^[A-Z]/.test(match) ? 'Electronic, Fingerprint and Face-Recognition' : 'electronic, fingerprint and face-recognition')

function normalizeContent(value) {
  if (typeof value === 'string') return replaceMechanicalClaim(value)
  if (Array.isArray(value)) {
    return value
      .filter((item) => item?.id !== 'mechanical' && item?.label?.en !== 'Mechanical safes')
      .map(normalizeContent)
  }
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, normalizeContent(child)]))
}

function replaceValue(value, search, replacement) {
  if (typeof value === 'string') return value.replaceAll(search, replacement)
  if (Array.isArray(value)) return value.map((item) => replaceValue(item, search, replacement))
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, replaceValue(child, search, replacement)]))
}

function normalizeProduct(product) {
  if (product.slug === 'achiever-a7l') return {...product, is_active: false}
  const primaryAccess = primaryAccessBySlug[product.slug]
  if (!primaryAccess) return product
  const extraData = {...(product.extra_data || {})}
  if (Array.isArray(extraData.models)) {
    extraData.models = extraData.models.map((model) => ({...model, lockTypes: [primaryAccess]}))
  }
  const specs = {...(product.specs || {})}
  for (const key of Object.keys(specs)) if (key.endsWith(' | Access')) specs[key] = primaryAccess
  for (const model of extraData.models || []) specs[`${model.name} | Access`] = primaryAccess
  const patch = {extra_data: extraData, specs}
  if (product.slug === 'upgraded-bronze-fingerprint') {
    const replaceName = (value) => typeof value === 'string'
      ? value.replaceAll('Upgraded Bronze Fingerprint', 'Upgraded Bronze Electronic')
      : value
    patch.name = 'Upgraded Bronze Electronic'
    patch.name_en = 'Upgraded Bronze Electronic'
    patch.name_i18n = {...(product.name_i18n || {}), en: 'Upgraded Bronze Electronic'}
    patch.extra_data = replaceValue(extraData, 'Upgraded Bronze Fingerprint', 'Upgraded Bronze Electronic')
    patch.description = replaceName(product.description)
    patch.description_en = replaceName(product.description_en)
    patch.description_i18n = Object.fromEntries(Object.entries(product.description_i18n || {}).map(([key, value]) => [key, replaceName(value)]))
    patch.overview_i18n = Object.fromEntries(Object.entries(product.overview_i18n || {}).map(([key, value]) => [key, replaceName(value)]))
  }
  return {...product, ...patch}
}

const products = await rest(`products?tenant_id=eq.${TENANT_ID}&select=*`)
const changedProducts = products
  .map((product) => ({before: product, after: normalizeProduct(product)}))
  .filter(({before, after}) => JSON.stringify(before) !== JSON.stringify(after))

const categoryPatches = {
  achiever: {
    descriptor: 'Wood-finish A2 / A3 and painted A6 / A7',
    summary: 'Wood-finish and painted cabinets across the A2, A3, A6 and A7 ranges.',
  },
  upgraded: {
    descriptor: 'Digital keypad and bronze electronic',
    summary: 'Electronic keypad versions of the upgraded range, including the bronze finish.',
  },
}
const categories = await rest(`product_categories?tenant_id=eq.${TENANT_ID}&select=*`)
const changedCategories = categories.flatMap((category) => {
  const approved = categoryPatches[category.slug]
  if (!approved) return []
  const after = {
    description: approved.summary,
    description_en: approved.summary,
    description_i18n: {...(category.description_i18n || {}), en: approved.summary},
    extra_data: {
      ...(category.extra_data || {}),
      descriptor_i18n: {...(category.extra_data?.descriptor_i18n || {}), en: approved.descriptor},
    },
  }
  const before = Object.fromEntries(Object.keys(after).map((key) => [key, category[key]]))
  return JSON.stringify(before) === JSON.stringify(after) ? [] : [{category, after}]
})

const [tenant] = await rest(`tenants?id=eq.${TENANT_ID}&select=*`)
if (!tenant) throw new Error('Tenant not found')
const addressEn = 'Jinyanshan Industrial Area, Quanxi Town, Wuyi County, Zhejiang, China'
const addressZh = '浙江省武义县泉溪镇金岩山工业区'
const extraSettings = structuredClone(tenant.extra_settings || {})
if (extraSettings.translation_profile) {
  extraSettings.translation_profile.main_products = (extraSettings.translation_profile.main_products || []).filter((item) => item !== 'Mechanical safes')
  extraSettings.translation_profile.company_summary = replaceMechanicalClaim(extraSettings.translation_profile.company_summary || '')
}
const tenantPatch = {
  contact_address_i18n: {...(tenant.contact_address_i18n || {}), en: addressEn, zh: addressZh},
  contact_address_short: addressEn,
  extra_settings: extraSettings,
}

const [draft] = await rest(`site_content_drafts?tenant_id=eq.${TENANT_ID}&select=revision,definition_version,content`)
const normalizedContent = normalizeContent(draft.content)
const plan = {
  mode: APPLY ? 'apply' : 'dry-run',
  tenantId: TENANT_ID,
  products: changedProducts.map(({before, after}) => ({
    slug: before.slug,
    active: `${before.is_active} -> ${after.is_active}`,
    name: `${before.name_i18n?.en || before.name} -> ${after.name_i18n?.en || after.name}`,
    access: [...new Set(Object.entries(after.specs || {}).filter(([key]) => key.endsWith(' | Access')).map(([, value]) => value))],
  })),
  categories: changedCategories.map(({category, after}) => ({slug: category.slug, after})),
  address: {before: tenant.contact_address_i18n, after: tenantPatch.contact_address_i18n},
  siteContentChanged: JSON.stringify(draft.content) !== JSON.stringify(normalizedContent),
}

if (!APPLY) {
  console.log(JSON.stringify(plan, null, 2))
  process.exit(0)
}

for (const {before, after} of changedProducts) {
  const fields = before.slug === 'achiever-a7l'
    ? {is_active: false}
    : Object.fromEntries(['extra_data', 'specs', 'name', 'name_en', 'name_i18n', 'description', 'description_en', 'description_i18n', 'overview_i18n']
      .filter((key) => Object.hasOwn(after, key) && JSON.stringify(before[key]) !== JSON.stringify(after[key]))
      .map((key) => [key, after[key]]))
  await rest(`products?id=eq.${before.id}&tenant_id=eq.${TENANT_ID}`, {method: 'PATCH', headers: {Prefer: 'return=representation'}, body: JSON.stringify(fields)})
}

for (const {category, after} of changedCategories) {
  await rest(`product_categories?id=eq.${category.id}&tenant_id=eq.${TENANT_ID}`, {
    method: 'PATCH',
    headers: {Prefer: 'return=representation'},
    body: JSON.stringify(after),
  })
}

await rest(`tenants?id=eq.${TENANT_ID}`, {method: 'PATCH', headers: {Prefer: 'return=representation'}, body: JSON.stringify(tenantPatch)})

const [operator] = await rest(`admin_users?tenant_id=eq.${TENANT_ID}&is_active=eq.true&select=id&limit=1`)
if (!operator) throw new Error('Active tenant operator not found')
const saved = await rest('rpc/save_site_content_draft', {method: 'POST', body: JSON.stringify({
  p_tenant_id: TENANT_ID,
  p_expected_revision: draft.revision,
  p_definition_version: draft.definition_version,
  p_content: normalizedContent,
  p_user_id: operator.id,
})})
const revision = typeof saved === 'string' ? saved : saved?.revision
const versionId = await rest('rpc/publish_site_content_draft', {method: 'POST', body: JSON.stringify({
  p_tenant_id: TENANT_ID,
  p_expected_revision: revision,
  p_user_id: operator.id,
})})

const readbackProducts = await rest(`products?tenant_id=eq.${TENANT_ID}&select=slug,name_i18n,is_active,specs&order=sort_order.asc`)
const [readbackTenant] = await rest(`tenants?id=eq.${TENANT_ID}&select=contact_address_i18n,contact_address_short,extra_settings`)
const [state] = await rest(`site_content_state?tenant_id=eq.${TENANT_ID}&select=published_version_id`)
console.log(JSON.stringify({
  ...plan,
  publishedVersionId: versionId,
  publishedReadback: state.published_version_id,
  addressReadback: readbackTenant.contact_address_i18n,
  productReadback: readbackProducts.filter((product) => changedProducts.some(({before}) => before.slug === product.slug)).map((product) => ({
    slug: product.slug,
    name: product.name_i18n?.en,
    active: product.is_active,
    access: [...new Set(Object.entries(product.specs || {}).filter(([key]) => key.endsWith(' | Access')).map(([, value]) => value))],
  })),
}, null, 2))
