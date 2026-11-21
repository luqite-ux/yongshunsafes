import type { Metadata } from 'next'
import {staticPageMetadata} from '@/lib/page-metadata'
import { HeroCarousel } from '@/components/home/hero-carousel'
import { SeriesSection } from '@/components/home/series-section'
import { LocksSection } from '@/components/home/locks-section'
import { SizesSection } from '@/components/home/sizes-section'
import { ManufacturingSection } from '@/components/home/manufacturing-section'
import { CustomizationSection } from '@/components/home/customization-section'
import { WorkflowSection } from '@/components/home/workflow-section'
import { ApplicationsSection } from '@/components/home/applications-section'
import { CompanySection } from '@/components/home/company-section'
import { FaqSection } from '@/components/home/faq-section'
import { getCatalogue } from '@/lib/catalogue-db'
import {getSiteView,siteModule} from '@/lib/site-content/view'

export const revalidate = 60

const initialMetadata: Metadata = {
  title: { absolute: 'YONGSHUN Safe Manufacturer | Electronic, Fingerprint and Face-Recognition Safes' },
}

export async function generateMetadata(){return staticPageMetadata('/',initialMetadata)}
export default async function HomePage() {
  const {products,categories,source} = await getCatalogue()
  const snapshot=await getSiteView(),block=(key:string)=>siteModule(snapshot,'/',key),manufacturing=(key:string)=>siteModule(snapshot,'/manufacturing',key)
  return (
    <div data-hq-content-version={snapshot?.pages.some(p=>p.path==='/')?snapshot.version:undefined}>
      <section id="hero" aria-labelledby="hero-title" className="bg-background">
        <h1 id="hero-title" className="sr-only">
          What safes can I source? YONGSHUN safe cabinet manufacturer
        </h1>
        <HeroCarousel content={block('hero')} />
      </section>
      <div data-catalogue-source={source}><SeriesSection products={products} categories={categories} content={block('series')} /></div>
      <LocksSection content={block('locks')} />
      <SizesSection products={products} categories={categories} content={block('sizes')} />
      <ManufacturingSection content={block('manufacturing')} process={manufacturing('process')} capacity={manufacturing('capacity')} gallery={manufacturing('gallery')} />
      <CustomizationSection content={block('customization')} minimumOrder={Number(block('commercial')?.values.moq??20)} />
      <WorkflowSection content={block('workflow')} />
      <ApplicationsSection content={block('applications')} scenes={siteModule(snapshot,'/cases','applications')} />
      <CompanySection content={block('company')} />
      <FaqSection content={block('faq')} />
    </div>
  )
}
