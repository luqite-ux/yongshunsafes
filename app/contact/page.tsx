import type { Metadata } from 'next'
import {staticPageMetadata} from '@/lib/page-metadata'
import Image from 'next/image'
import { Mail, MapPin, Phone } from 'lucide-react'
import { PageHero } from '@/components/site/page-hero'
import { InquiryForm } from '@/components/forms/inquiry-form'
import { company, fullAddress, businessScope } from '@/lib/site'
import { getCatalogue } from '@/lib/catalogue-db'
import { getSiteSettings } from '@/lib/settings-db'
import {getSiteView,siteModule} from '@/lib/site-content/view'
import {contentRows,contentText,contentImage} from '@/lib/site-content/values'
import {Reveal} from '@/components/site/reveal'

export const revalidate = 60

const initialMetadata: Metadata = {
  title: 'Contact',
  alternates:{canonical:'/contact'},
  description: 'Send an inquiry to YONGSHUN safe manufacturer in Wuyi, Zhejiang, or contact us by phone and email.',
}

export async function generateMetadata(){return staticPageMetadata('/contact',initialMetadata)}
export default async function ContactPage() {
  const {products} = await getCatalogue()
  const settings=await getSiteSettings()
  const snapshot=await getSiteView(),intro=siteModule(snapshot,'/contact','introduction'),hero=siteModule(snapshot,'/contact','intro'),services=contentRows(intro,'services')?.map(row=>String(row.label||''))||businessScope,photo=contentImage(intro,'image',{src:'/images/company/factory-exterior.png',alt:'Company name sign at the Wuyi factory entrance'})
  const details = [
    { icon: Phone, label: 'Phone', value: settings.phone, href: 'tel:'+settings.phone.replace(/[^+\d]/g,'') },
    { icon: Mail, label: 'Email', value: settings.email, href: 'mailto:'+settings.email },
    { icon: MapPin, label: 'Address', value: settings.address },
  ]
  return (
    <div data-hq-content-version={snapshot?.pages.some(p=>p.path==='/contact')?snapshot.version:undefined}>
      <PageHero content={hero} eyebrow="Contact" title="Tell us what you need" crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}>
        Share the model, size, colour and quantity you have in mind. Minimum order is {company.moq} units.
      </PageHero>

      <section aria-label="Contact and inquiry" className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-stretch gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <Reveal className="border-border flex flex-col gap-8 rounded-[2rem] border bg-white p-6 sm:p-10">
            <div>
              <h2 className="font-display text-2xl font-semibold">{settings.legalName.replace(/\.$/, '')}</h2>
              <p className="text-muted-foreground mt-3 leading-relaxed">
                {contentText(intro,'profile','A manufacturer of electronic, fingerprint and face-recognition safes and storage boxes, selling under the Yongshun and Manadun brands.')}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {services.map((s) => (
                  <li key={s} className="bg-sky text-blue-deep rounded-full px-3 py-1.5 text-xs font-semibold">{s}</li>
                ))}
              </ul>
            </div>
            <ul className="grid gap-5">
              {details.map((d) => (
                <li key={d.label} className="flex gap-4">
                  <span className="bg-sky text-blue-deep flex size-11 shrink-0 items-center justify-center rounded-xl">
                    <d.icon aria-hidden className="size-5" />
                  </span>
                  <div>
                    <p className="text-muted-foreground text-sm">{d.label}</p>
                    {d.href ? (
                      <a href={d.href} className="inline-flex min-h-11 items-center font-semibold underline-offset-4 hover:underline">{d.value}</a>
                    ) : (
                      <address className="font-semibold not-italic leading-snug">{d.value}</address>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <figure className="border-border mt-auto overflow-hidden rounded-2xl border">
              <div className="relative aspect-[4/3]">
                <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-contain" />
              </div>
            </figure>
          </Reveal>

          <Reveal className="border-border rounded-[2rem] border bg-white p-6 sm:p-10">
            <h2 className="font-display text-2xl font-semibold">{contentText(intro,'form_title','Send an inquiry')}</h2>
            <p className="text-muted-foreground mt-2 text-sm">{contentText(intro,'form_help','Fields marked * are required.')}</p>
            <InquiryForm scope="contact" products={products} minimumOrder={Number(siteModule(snapshot,'/','commercial')?.values.moq??20)} className="mt-6" />
          </Reveal>
        </div>
      </section>
    </div>
  )
}
