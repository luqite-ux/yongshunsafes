import type { Metadata } from 'next'
import {staticPageMetadata} from '@/lib/page-metadata'
import Image from 'next/image'
import { FileCheck2, Warehouse } from 'lucide-react'
import { PageHero } from '@/components/site/page-hero'
import { ImageSlot } from '@/components/site/image-slot'
import { LinkButton } from '@/components/site/link-button'
import { Reveal } from '@/components/site/reveal'
import { company, fullAddress, businessScope } from '@/lib/site'
import {getSiteView,siteModule} from '@/lib/site-content/view'
import {contentRows,contentText,contentImage} from '@/lib/site-content/values'
import {siteTypographyStyle} from '@/lib/site-content/typography'
import {getSiteSettings} from '@/lib/settings-db'

const initialMetadata: Metadata = {
  title: 'About',
  alternates:{canonical:'/about'},
  description: `About ${company.legalName.replace(/\.$/, '')}, a safe cabinet manufacturer in Wuyi County, Zhejiang.`,
}

export async function generateMetadata(){return staticPageMetadata('/about',initialMetadata)}
export default async function AboutPage() {
  const snapshot=await getSiteView(),block=(key:string)=>siteModule(snapshot,'/about',key),profile=block('profile'),settings=await getSiteSettings(),capacity=siteModule(snapshot,'/manufacturing','capacity')?.values
  const factory=contentImage(profile,'image',{src:'/images/company/factory-exterior.png',alt:'Company name sign in gold characters at the Wuyi factory entrance'}),licence=contentImage(profile,'license_image',{src:'/images/company/business-licence.png',alt:'Business licence supplied by Zhejiang Wuyi Yongshun Safe Cabinet Co., Ltd.'}),services=contentRows(siteModule(snapshot,'/contact','introduction'),'services')?.map(row=>String(row.label||''))||businessScope
  const photos=contentRows(block('gallery'))?.map(row=>({id:String(row.id),title:String(row.title||''),src:String(row.image?.url||''),alt:String(row.image?.alt||row.title||'')}))||[{id:'exhibition',title:'Exhibition',src:'/images/company/exhibition.png',alt:'Company exhibition booth with brand logo and product display boards'}]
  const fonts={'site-sans':'var(--font-body)','site-display':'var(--font-display)'}
  return (
    <div data-hq-content-version={snapshot?.pages.some(p=>p.path==='/about')?snapshot.version:undefined}>
      <PageHero content={block('intro')} eyebrow="About" title="A safe manufacturer in Wuyi, Zhejiang" crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}>
        {company.legalName.replace(/\.$/, '')} integrates design, R&amp;D, production and sales of mechanical, electronic and fingerprint safes and storage boxes.
      </PageHero>

      <section aria-labelledby="profile-title" className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <Reveal>
            <h2 id="profile-title" className="display-title hq-typography text-3xl sm:text-5xl" style={siteTypographyStyle(profile?.styles,'title',fonts)}>{contentText(profile,'title','Company profile')}</h2>
            <p className="text-muted-foreground hq-typography mt-5 leading-relaxed" style={siteTypographyStyle(profile?.styles,'body',fonts)}>
              {contentText(profile,'body',`The company sells under the Yongshun and Manadun brands from a site of about ${company.areaSqm.toLocaleString('en-US')} square metres in the Jinyanshan Industrial Area, with cutting, precision, welding, grinding, coating and assembly workshops and three customization production lines.`)}
            </p>
            {capacity&&<p className="text-muted-foreground mt-4 leading-relaxed">The site covers about {Number(capacity.area).toLocaleString('en-US')} m² and has {String(capacity.lines)} customization production lines.</p>}
            <p className="text-muted-foreground mt-4 leading-relaxed">{contentText(profile,'registration',`Business registration dates from ${company.registeredLabel}.`)}</p>
            <address className="mt-6 not-italic leading-relaxed">{settings.address}</address>
            <ul className="mt-6 flex flex-wrap gap-2">
              {services.map((s) => (
                <li key={s} className="bg-sky text-blue-deep rounded-full px-4 py-2 text-sm font-semibold">{s}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <figure className="border-border overflow-hidden rounded-3xl border bg-white">
              <div className="relative aspect-[4/3]">
                <Image src={factory.src} alt={factory.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain" />
              </div>
              <figcaption className="text-muted-foreground border-t px-5 py-3 text-sm">{factory.alt}</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="presence-title" className="bg-secondary/60 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal><h2 id="presence-title" className="display-title text-3xl sm:text-5xl">Warehouse and exhibition</h2></Reveal>
          <div className={`mt-10 grid items-stretch gap-6 ${photos.length>1?'md:grid-cols-2':''}`}>
            {photos.map(photo=><Reveal key={photo.id} className="h-full"><figure className="border-border flex h-full flex-col overflow-hidden rounded-3xl border bg-white">
              <ImageSlot src={photo.src} alt={photo.alt} label={photo.title} icon={Warehouse} aspect="aspect-[4/3]" fit="contain" className="rounded-none border-0 bg-[#f5f1e7]"/>
              <figcaption className="mt-auto border-t px-5 py-3 text-sm font-medium">{photo.title}</figcaption>
            </figure></Reveal>)}
          </div>
        </div>
      </section>

      <section aria-labelledby="registration-title" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="border-border mx-auto max-w-3xl rounded-3xl border bg-white p-6 sm:p-8">
            <FileCheck2 aria-hidden className="text-gold-deep size-8" />
            <h2 id="registration-title" className="font-display mt-4 text-2xl font-semibold">Company registration</h2>
            <p className="text-muted-foreground mt-3 leading-relaxed">{contentText(profile,'registration',`Registered in Wuyi, Zhejiang, on ${company.registeredLabel}.`)}</p>
            <figure className="border-border mt-6 max-w-3xl overflow-hidden rounded-2xl border bg-white">
              <a href={licence.src} target="_blank" rel="noopener noreferrer" aria-label="Open the original company business licence image">
                <Image src={licence.src} alt={licence.alt} width={1760} height={1248} className="h-auto w-full object-contain" sizes="(min-width: 768px) 768px, 100vw" />
              </a>
              <figcaption className="text-muted-foreground border-t px-5 py-3 text-sm">Business licence supplied by the company. Open the image to inspect the original document.</figcaption>
            </figure>
            <div className="mt-6"><LinkButton href="/contact" variant="outline">Ask about documents</LinkButton></div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
