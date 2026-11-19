import Link from '@/components/site/site-link'
import { ProductStage } from '@/components/site/product-stage'
import { t } from '@/lib/i18n'
import { lockLabels, productLockTypes, productSizeClasses, sizeLabels, type Product } from '@/lib/products'

export function ProductCard({ product }: { product: Product }) {
  const locks = productLockTypes(product)
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group border-border hover:border-gold flex h-full flex-col overflow-hidden rounded-3xl border bg-white transition-colors"
    >
      <div className="border-b">
        <ProductStage
          image={product.images[0]}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          padding="transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex min-h-[18rem] flex-1 flex-col gap-3 p-6">
        <p className="eyebrow">{product.categoryName || product.category}</p>
        <h3 className="font-display line-clamp-2 text-xl font-semibold leading-snug">{t(product.name)}</h3>
        <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">{t(product.summary)}</p>
        <ul className="mt-auto flex flex-wrap gap-2 pt-2">
          {locks.map((l) => (
            <li key={l} className="bg-sky text-blue-deep rounded-full px-3 py-1 text-xs font-semibold">
              {lockLabels[l]}
            </li>
          ))}
          {productSizeClasses(product).map(size => <li key={size} className="bg-secondary rounded-full px-3 py-1 text-xs font-semibold">{sizeLabels[size]}</li>)}
        </ul>
      </div>
    </Link>
  )
}
