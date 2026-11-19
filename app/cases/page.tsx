import type { Metadata } from 'next'
import {staticPageMetadata} from '@/lib/page-metadata'
import { Building2, Home, Store } from 'lucide-react'
import { PageHero } from '@/components/site/page-hero'
import { ImageSlot } from '@/components/site/image-slot'
import { LinkButton } from '@/components/site/link-button'
import { Reveal } from '@/components/site/reveal'
import { applications } from '@/lib/applications'
import {getSiteView,siteModule} from '@/lib/site-content/view'
import {contentRows} from '@/lib/site-content/values'

const initialMetadata: Metadata = {
  title: 'Cases',
  alternates:{canonical:'/cases'},
  description: 'Application scenes for YONGSHUN safes in offices, homes and business premises.',
}

const icons = { office: Building2, home: Home, commercial: Store } as const

export async function generateMetadata(){return staticPageMetadata('/cases',initialMetadata)}
export default async function CasesPage() {
  const snapshot=await getSiteView(),block=(key:string)=>siteModule(snapshot,'/cases',key),items=contentRows(block('applications'))?.map(row=>({id:String(row.id),title:String(row.title||''),caption:String(row.caption||''),detail:String(row.detail||''),image:String(row.image?.url||''),alt:String(row.image?.alt||row.title||''),aspect:applications.find(a=>a.id===row.id)?.aspect||'aspect-[4/3]'}))||applications.map(a=>({...a,alt:`${a.title} application scene`}))
  return (
    <div data-hq-content-version={snapshot?.pages.some(p=>p.path==='/cases')?snapshot.version:undefined}>
      <PageHero content={block('intro')} eyebrow="Cases" title="Safes in everyday spaces" variant="bolts" crumbs={[{ label: 'Home', href: '/' }, { label: 'Cases' }]}>
        Application scenes that show where each kind of safe fits.
      </PageHero>
      <section aria-label="Application scenes" className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-16 px-4 sm:px-6 lg:px-8">
          {items.map((a, i) => (
            <Reveal key={a.id} className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
              <div className={i % 2 ? 'md:order-2' : ''}>
                <h2 className="display-title text-3xl sm:text-4xl">{a.title}</h2>
                <p className="text-muted-foreground mt-4 leading-relaxed">{a.caption}</p>
                <p className="text-muted-foreground mt-3 leading-relaxed">{a.detail}</p>
              </div>
              <ImageSlot
                src={a.image}
                aspect={a.aspect}
                alt={a.alt}
                label="Scene photograph to be added"
                icon={icons[a.id as keyof typeof icons]||Building2}
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </Reveal>
          ))}
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/products">Browse products</LinkButton>
            <LinkButton href="/contact">Discuss your requirements</LinkButton>
          </div>
        </div>
      </section>
    </div>
  )
}
