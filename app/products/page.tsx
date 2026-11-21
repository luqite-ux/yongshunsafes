import type { Metadata } from 'next'
import {staticPageMetadata} from '@/lib/page-metadata'
import Link from '@/components/site/site-link'
import { PageHero } from '@/components/site/page-hero'
import { ProductCard } from '@/components/products/product-card'
import { ProductFilters } from '@/components/products/product-filters'
import { Reveal } from '@/components/site/reveal'
import { filterProducts, getCategory } from '@/lib/products'
import { getCatalogue } from '@/lib/catalogue-db'
import {getSiteView,siteModule} from '@/lib/site-content/view'

export const revalidate = 60
import { t } from '@/lib/i18n'

const initialMetadata: Metadata = {
  title: 'Products',
  alternates:{canonical:'/products'},
  description:
    'Browse YONGSHUN and Manadun safes by series, access option and size: Achiever, Lingzhi, Upgraded, Zhishang and Yongning.',
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

export async function generateMetadata(){return staticPageMetadata('/products',initialMetadata)}
export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams
  const {products,categories} = await getCatalogue()
  const snapshot=await getSiteView()
  const current = { category: first(sp.category), lock: first(sp.lock), size: first(sp.size) }
  const category = current.category ? getCategory(current.category,categories) : undefined
  const results = filterProducts(current,products)

  return (
    <div data-hq-content-version={!current.category&&snapshot?.pages.some(p=>p.path==='/products')?snapshot.version:undefined}>
      <PageHero
        content={!current.category?siteModule(snapshot,'/products','intro'):undefined}
        eyebrow="Products"
        title={category ? `${category.name} series` : 'Safes by series, access and size'}
        variant="bolts"
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Products' }]}
      >
        {category ? t(category.summary) : 'Five series of electronic, fingerprint and face-recognition safes. Filter by series, access option or size.'}
      </PageHero>

      <section aria-label="Product catalogue" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal><ProductFilters current={current} categories={categories} /></Reveal>
          <p className="text-muted-foreground mt-8 text-sm" role="status">
            {results.length} {results.length === 1 ? 'product' : 'products'} shown
          </p>

          {results.length > 0 ? (
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p) => (
                <li key={p.slug} className="h-full">
                  <Reveal className="h-full"><ProductCard product={p} /></Reveal>
                </li>
              ))}
            </ul>
          ) : (
            <Reveal className="border-border mt-6 rounded-3xl border border-dashed bg-white p-10 text-center">
              <h2 className="font-display text-2xl font-semibold">No products match these filters</h2>
              <p className="text-muted-foreground mt-2">Try removing a filter, or browse a series directly.</p>
              <ul className="mt-6 flex flex-wrap justify-center gap-2">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/products?category=${c.slug}`}
                      className="hover:border-gold inline-flex min-h-11 items-center rounded-full border bg-white px-5 text-sm font-semibold"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </section>
    </div>
  )
}
