import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from '@/components/site/site-link'
import { Check } from 'lucide-react'
import { ProductGallery } from '@/components/products/product-gallery'
import { ProductModelProvider } from '@/components/products/product-model-provider'
import { ModelChooser } from '@/components/products/model-chooser'
import { SpecTable } from '@/components/products/spec-table'
import { ProductInquiry } from '@/components/products/product-inquiry'
import { ProductCard } from '@/components/products/product-card'
import { getCategory, getProduct, productName } from '@/lib/products'
import { getCatalogue } from '@/lib/catalogue-db'
import { t } from '@/lib/i18n'
import { company } from '@/lib/site'
import {getSiteSettings,siteOrigin} from '@/lib/settings-db'
import {StructuredData} from '@/components/site/structured-data'
import {Reveal} from '@/components/site/reveal'
import {getSiteView,siteModule} from '@/lib/site-content/view'
import {getRequestLocale,localePath} from '@/lib/route-locale'

export const revalidate = 60
export const dynamicParams = true
export async function generateStaticParams() {
  const {products} = await getCatalogue('en')
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const locale=await getRequestLocale(),{products}=await getCatalogue(locale)
  const product = getProduct(slug,products)
  if (!product) return {}
  const settings=await getSiteSettings(locale),title=t(product.seoTitle||product.name),description=t(product.seoDescription||product.summary),path='/products/'+product.slug,url=siteOrigin()+localePath(path,locale,settings.defaultLanguage)
  const languages=Object.fromEntries(settings.languages.map(language=>[language,siteOrigin()+localePath(path,language,settings.defaultLanguage)]))
  return { title,description,alternates:{canonical:url,languages:{...languages,'x-default':siteOrigin()+localePath(path,settings.defaultLanguage,settings.defaultLanguage)}},openGraph:{title,description,type:'website',url,locale,images:product.images[0]?[{url:product.images[0].src}]:[]},twitter:{card:'summary_large_image',title,description,images:product.images[0]?[product.images[0].src]:[]} }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const locale=await getRequestLocale(),{products,categories} = await getCatalogue(locale)
  const product = getProduct(slug,products)
  if (!product) notFound()
  const category = getCategory(product.category,categories)
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3)
  const settings=await getSiteSettings(locale),origin=siteOrigin(),url=origin+localePath('/products/'+product.slug,locale,settings.defaultLanguage)
  const snapshot=await getSiteView(),minimumOrder=Number(siteModule(snapshot,'/','commercial')?.values.moq??company.moq)
  const features=t(product.features)||[],advantages=product.advantages?(t(product.advantages)||[]):[]

  return (
    <ProductModelProvider models={product.models}>
      <StructuredData data={{'@context':'https://schema.org','@type':'Product','@id':url+'#product',url,name:productName(product),description:t(product.summary),image:product.images.map(i=>i.src),manufacturer:{'@id':origin+'/#organization'},...(product.brand?{brand:{'@type':'Brand',name:product.brand}}:{}),additionalProperty:product.models.map(m=>({'@type':'PropertyValue',name:m.name,value:[m.dimensions?`${m.dimensions.heightMm} × ${m.dimensions.widthMm} × ${m.dimensions.depthMm} mm`:'',m.weightKg!==null?`${m.weightKg} kg`:'',m.accessories||''].filter(Boolean).join('; ')||'Configuration on request'}))}}/>
      <StructuredData data={{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:origin+localePath('/',locale,settings.defaultLanguage)},{'@type':'ListItem',position:2,name:'Products',item:origin+localePath('/products',locale,settings.defaultLanguage)},{'@type':'ListItem',position:3,name:productName(product),item:url}]}}/>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-muted-foreground text-sm">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/products" className="inline-flex min-h-8 items-center hover:underline">Products</Link></li>
            <li aria-hidden>/</li>
            <li>
              <Link href={`/products?category=${product.category}`} className="inline-flex min-h-8 items-center hover:underline">
                {category?.name}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-foreground font-medium">{productName(product)}</li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal><ProductGallery images={product.images} /></Reveal>
          <Reveal>
            <p className="eyebrow">{category?.name} series{product.brand ? ` · ${product.brand}` : ''}</p>
            <h1 className="display-title mt-3 text-4xl sm:text-5xl">{productName(product)}</h1>
            <p className="text-muted-foreground mt-5 text-lg leading-relaxed">{t(product.summary)}</p>
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="border-t pt-3"><dt className="text-muted-foreground">Finish</dt><dd className="font-semibold">{product.finish}</dd></div>
              <div className="border-t pt-3"><dt className="text-muted-foreground">Minimum order</dt><dd className="font-semibold">{minimumOrder} units</dd></div>
            </dl>
            <div className="mt-8"><ModelChooser /></div>
            <a
              href="#inquiry"
              className="bg-primary text-primary-foreground hover:bg-blue-deep mt-8 inline-flex min-h-12 items-center rounded-full px-8 text-sm font-semibold"
            >
              Inquire about this model
            </a>
          </Reveal>
        </div>

        <section aria-labelledby="specs-title" className="mt-24">
          <Reveal><h2 id="specs-title" className="display-title text-3xl sm:text-4xl">Specifications</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            Dimensions, weight and accessories are listed per model. Where a value is not shown, ask us and we will confirm it for the exact model.
          </p></Reveal>
          <Reveal className="mt-8"><SpecTable /></Reveal>
        </section>

        {product.overview&&t(product.overview).trim()!==t(product.summary).trim()&&<Reveal className="mt-24"><section aria-labelledby="overview-title">
          <h2 id="overview-title" className="display-title text-3xl sm:text-4xl">Product overview</h2>
          <p className="text-muted-foreground mt-5 max-w-3xl leading-relaxed">{t(product.overview)}</p>
        </section></Reveal>}

        <section className="mt-24 grid gap-8 md:grid-cols-2" aria-label="Features and applications">
          <Reveal className="border-border rounded-3xl border bg-white p-8">
            <h2 className="font-display text-2xl font-semibold">Features</h2>
            <ul className="mt-5 grid gap-3">
              {features.map((f) => (
                <li key={f} className="flex gap-3">
                  <Check aria-hidden className="text-gold-deep mt-1 size-5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="border-border rounded-3xl border bg-white p-8">
            <h2 className="font-display text-2xl font-semibold">Applications</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {product.applications.map((a) => (
                <li key={a} className="bg-sky text-blue-deep rounded-full px-4 py-2 text-sm font-semibold">{a}</li>
              ))}
            </ul>
          </Reveal>
        </section>

        {advantages.length>0&&<Reveal className="mt-24"><section aria-labelledby="advantages-title">
          <h2 id="advantages-title" className="display-title text-3xl sm:text-4xl">Further details</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">{advantages.map(item=><li key={item} className="border-border rounded-2xl border bg-white px-5 py-4">{item}</li>)}</ul>
        </section></Reveal>}

        <section id="inquiry" aria-labelledby="inquiry-title" className="border-border mt-24 scroll-mt-28 rounded-[2rem] border bg-white p-6 sm:p-10">
          <Reveal><h2 id="inquiry-title" className="display-title text-3xl sm:text-4xl">Inquire about {productName(product)}</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            Your product and chosen model are carried into the inquiry. Add quantity and any customization needs.
          </p></Reveal>
          <Reveal className="mt-8"><ProductInquiry productName={productName(product)} minimumOrder={minimumOrder} /></Reveal>
        </section>

        <section aria-labelledby="related-title" className="mt-24">
          <Reveal><h2 id="related-title" className="display-title text-3xl sm:text-4xl">Related series</h2></Reveal>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.slug} className="h-full"><Reveal className="h-full"><ProductCard product={p} /></Reveal></li>
            ))}
          </ul>
        </section>
      </div>
    </ProductModelProvider>
  )
}
