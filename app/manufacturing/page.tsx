import type { Metadata } from 'next'
import {staticPageMetadata} from '@/lib/page-metadata'
import { Camera } from 'lucide-react'
import { PageHero } from '@/components/site/page-hero'
import { ImageSlot } from '@/components/site/image-slot'
import { LinkButton } from '@/components/site/link-button'
import { Reveal } from '@/components/site/reveal'
import { workshopSteps, orderSteps } from '@/lib/manufacturing'
import { company } from '@/lib/site'
import { workshopGallery } from '@/lib/workshop-gallery'
import {getSiteView,siteModule} from '@/lib/site-content/view'
import {contentRows} from '@/lib/site-content/values'
import {editableSteps} from '@/lib/structured-content'

const initialMetadata: Metadata = {
  title: 'Manufacturing',
  alternates:{canonical:'/manufacturing'},
  description:
    'Cutting, precision, welding, grinding, coating and assembly workshops and three customization production lines in Wuyi, Zhejiang.',
}

export async function generateMetadata(){return staticPageMetadata('/manufacturing',initialMetadata)}
export default async function ManufacturingPage() {
  const snapshot=await getSiteView(),block=(key:string)=>siteModule(snapshot,'/manufacturing',key),steps=editableSteps(block('process'),workshopSteps),orders=editableSteps(siteModule(snapshot,'/','workflow'),orderSteps),capacity=block('capacity')?.values
  const photos=contentRows(block('gallery'))?.map(row=>({image:String(row.image?.url||''),alt:String(row.image?.alt||row.caption||''),title:String(row.title||'')}))||workshopGallery
  return (
    <div data-hq-content-version={snapshot?.pages.some(p=>p.path==='/manufacturing')?snapshot.version:undefined}>
      <PageHero content={block('intro')} eyebrow="Manufacturing" title="From steel sheet to finished safe" crumbs={[{ label: 'Home', href: '/' }, { label: 'Manufacturing' }]}>
        Six workshops and three customization production lines on a site of about {company.areaSqm.toLocaleString('en-US')} square metres.
      </PageHero>

      <section aria-labelledby="sequence-title" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal><h2 id="sequence-title" className="display-title text-3xl sm:text-5xl">The production sequence</h2></Reveal>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.id}>
                <Reveal className="h-full border-t pt-6">
                  <div>
                    <span className="bg-sky text-blue-deep flex size-14 items-center justify-center rounded-2xl">
                      <s.icon aria-hidden className="size-7" />
                    </span>
                    <h3 className="font-display mt-5 text-2xl font-semibold sm:text-3xl">
                      <span className="sr-only">Step {i + 1}: </span>{s.label}
                    </h3>
                    <p className="text-muted-foreground mt-3 max-w-md leading-relaxed">{s.text}</p>
                  </div>
                  {s.image && <ImageSlot
                    src={s.image}
                    alt={`${s.label} workshop`}
                    label={`${s.label} workshop photograph`}
                    icon={Camera}
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />}
                </Reveal>
              </li>
            ))}
          </ol>
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {photos.map((photo, index) => <Reveal key={photo.image} className={index === 0 || index === photos.length - 1 ? 'md:col-span-2' : ''}>
              <figure>
                <ImageSlot src={photo.image} alt={photo.alt} label={photo.title} icon={Camera} aspect="aspect-[20/9]" sizes={index === 0 || index === photos.length - 1 ? '100vw' : '(min-width:768px) 50vw,100vw'} />
                <figcaption className="mt-3 text-sm font-medium">{photo.title}</figcaption>
              </figure>
            </Reveal>)}
          </div>
        </div>
      </section>

      <section aria-labelledby="capacity-title" className="bg-secondary/60 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal><h2 id="capacity-title" className="display-title text-3xl sm:text-5xl">Capacity and customization</h2></Reveal>
          <dl className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              [`${Number(capacity?.area??company.areaSqm).toLocaleString('en-US')} m²`, 'Site area'],
              [`${capacity?.lines??company.productionLines}`, 'Customization production lines'],
              [`About ${Number(capacity?.monthly??company.monthlyCapacity).toLocaleString('en-US')} units`, 'Monthly capacity'],
            ].map(([v, l]) => (
              <Reveal key={l} className="border-border rounded-3xl border bg-white p-6">
                <dd className="font-display text-3xl font-semibold">{v}</dd>
                <dt className="text-muted-foreground mt-1 text-sm">{l}</dt>
              </Reveal>
            ))}
          </dl>
          <Reveal className="mt-4"><p className="text-muted-foreground max-w-2xl text-sm">
            Normal production time is about {String(capacity?.lead_days??company.leadTimeDays)} days, with the schedule confirmed for your order.
          </p></Reveal>
        </div>
      </section>

      <section aria-labelledby="inspection-title" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal><h2 id="inspection-title" className="display-title text-3xl sm:text-5xl">Inspection and order progress</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl">Inspection and report support is available, and progress is communicated through production.</p></Reveal>
          <ol className="mt-10 grid gap-4 md:grid-cols-5">
            {orders.map((s, i) => (
              <li key={s.id}><Reveal className="border-border h-full rounded-2xl border bg-white p-5">
                <s.icon aria-hidden className="text-gold-deep size-6" />
                <h3 className="font-display mt-3 text-lg font-semibold"><span className="sr-only">Step {i + 1}: </span>{s.label}</h3>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{s.text}</p>
              </Reveal></li>
            ))}
          </ol>
          <Reveal className="mt-10"><LinkButton href="/contact">Discuss your order</LinkButton></Reveal>
        </div>
      </section>
    </div>
  )
}
