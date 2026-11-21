import type {Product} from './products'

type LockType = 'electronic' | 'fingerprint' | 'face'

export const visibleLockTypes = ['electronic', 'fingerprint', 'face'] as const

const primaryAccessBySlug: Record<string, LockType> = {
  'achiever-a2-redwood': 'fingerprint',
  'achiever-a2-white-oak': 'fingerprint',
  'achiever-a3-walnut': 'fingerprint',
  'achiever-a6-grey-original': 'fingerprint',
  'upgraded-bronze-fingerprint': 'fingerprint',
  'upgraded-digital': 'electronic',
  zhishang: 'electronic',
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

export function applyCustomerCatalogueRules(products: Product[]): Product[] {
  return products
    .filter((product) => product.slug !== 'achiever-a7l')
    .map((product) => {
      const primaryAccess = primaryAccessBySlug[product.slug]
      const normalized = primaryAccess
        ? {...product, models: product.models.map((model) => ({...model, lockTypes: [primaryAccess]}))}
        : product
      return normalized
    })
}
