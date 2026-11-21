import { en, t, type Localized } from '@/lib/i18n'

export type CategorySlug = string
export type LockType = 'mechanical' | 'electronic' | 'fingerprint' | 'face'
export type SizeClass = 'compact' | 'midsize' | 'tall'

export interface Dimensions {
  heightMm: number
  widthMm: number
  depthMm: number
}

export interface ProductImage {
  src: string
  alt: Localized
  /** width / height of the original, so the stage can contain the full subject */
  aspect: number
}

export interface ProductModel {
  id: string
  name: string
  lockTypes: LockType[]
  /** null renders as an "on request" data slot, never an invented value */
  dimensions: Dimensions | null
  weightKg: number | null
  accessories: string | null
  note?: Localized
}

export interface Product {
  slug: string
  category: CategorySlug
  categoryName?: string
  id?: string
  seoTitle?: Localized
  seoDescription?: Localized
  updatedAt?: string
  brand?: 'Yongshun' | 'Manadun'
  name: Localized
  summary: Localized
  overview?: Localized
  finish: string
  sizeClass: SizeClass
  images: ProductImage[]
  models: ProductModel[]
  features: Localized<string[]>
  advantages?: Localized<string[]>
  applications: string[]
}

export interface Category {
  slug: CategorySlug
  name: string
  descriptor: Localized
  summary: Localized
}

export const fallbackCategories: Category[] = [
  {
    slug: 'achiever',
    name: 'Achiever',
    descriptor: en('Wood-finish A2 / A3 and painted A6 / A7'),
    summary: en('Wood-finish and painted cabinets across the A2, A3, A6 and A7 ranges.'),
  },
  {
    slug: 'lingzhi',
    name: 'Lingzhi',
    descriptor: en('Cream and bronze variants'),
    summary: en('Soft cream and bronze colourways with a refined front panel.'),
  },
  {
    slug: 'upgraded',
    name: 'Upgraded',
    descriptor: en('Digital keypad and bronze electronic'),
    summary: en('Electronic keypad versions of the upgraded range, including the bronze finish.'),
  },
  {
    slug: 'zhishang',
    name: 'Zhishang',
    descriptor: en('Tall and double-door variants'),
    summary: en('Taller cabinets and double-door layouts for larger storage needs.'),
  },
  {
    slug: 'yongning',
    name: 'Yongning',
    descriptor: en('Light-grey cabinets and access options'),
    summary: en('Compare safe cabinet sizes and access configurations in the light-grey Yongning range.'),
  },
]

export const lockLabels: Record<LockType, string> = {
  mechanical: 'Mechanical',
  electronic: 'Electronic',
  fingerprint: 'Fingerprint',
  face: 'Face recognition',
}

export const sizeLabels: Record<SizeClass, string> = {
  compact: 'Compact',
  midsize: 'Mid-size',
  tall: 'Tall',
}

export function getCategory(slug: string, categories: Category[]) {
  return categories.find((category) => category.slug === slug)
}

export function getProduct(slug: string, products: Product[]) {
  return products.find((product) => product.slug === slug)
}

export function productLockTypes(product: Product): LockType[] {
  return Array.from(new Set(product.models.flatMap((model) => model.lockTypes)))
}

export function productSizeClasses(product: Product): SizeClass[] {
  const heights = product.models.flatMap(model => model.dimensions ? [model.dimensions.heightMm] : [])
  return Array.from(new Set(heights.map(height => height >= 1000 ? 'tall' : height > 500 ? 'midsize' : 'compact')))
}

export function productsByCategory(slug: CategorySlug, products: Product[]) {
  return products.filter((product) => product.category === slug)
}

export function categoryCover(slug: CategorySlug, products: Product[]): ProductImage | undefined {
  return productsByCategory(slug, products)[0]?.images[0]
}

export interface ProductFilter {
  category?: string
  lock?: string
  size?: string
}

export function filterProducts(filter: ProductFilter, products: Product[]) {
  return products.filter((product) => {
    if (filter.category && product.category !== filter.category) return false
    if (filter.size && !productSizeClasses(product).includes(filter.size as SizeClass)) return false
    if (filter.lock && !productLockTypes(product).includes(filter.lock as LockType)) return false
    return true
  })
}

export function formatDimensions(d: Dimensions | null) {
  return d ? `${d.heightMm} × ${d.widthMm} × ${d.depthMm} mm` : 'On request'
}

export function productName(product: Product) {
  return t(product.name)
}
