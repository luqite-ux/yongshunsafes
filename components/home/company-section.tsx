import Image from 'next/image'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { LinkButton } from '@/components/site/link-button'
import { company } from '@/lib/site'
import {contentText,contentImage,type ModuleContent} from '@/lib/site-content/values'

export function CompanySection({content}:{content?:ModuleContent}) {
  const factory=contentImage(content,'factory_image',{src:'/images/company/factory-exterior.png',alt:'Company name sign in gold characters at the Wuyi factory entrance'}),exhibition=contentImage(content,'exhibition_image',{src:'/images/company/exhibition.png',alt:'Company exhibition booth with brand logo, blue panels and product display boards'})
  return (
    <section id="company" aria-labelledby="company-title" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <Reveal className="grid items-start gap-4 sm:grid-cols-2">
            <figure className="overflow-hidden rounded-3xl">
              <div className="relative aspect-[4/3]">
                <Image
                  src={factory.src}
                  alt={factory.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-contain"
                />
              </div>
            </figure>
            <figure className="overflow-hidden rounded-3xl">
              <div className="relative aspect-[4/3]">
                <Image
                  src={exhibition.src}
                  alt={exhibition.alt}
                  fill
                  sizes="(min-width: 1024px) 28vw, 100vw"
                  className="object-contain"
                />
              </div>
            </figure>
          </Reveal>

          <Reveal delay={100}>
            <SectionHeading content={content} eyebrow="Company" id="company-title" title="Who is the manufacturer?">
              {company.legalName.replace(/\.$/, '')} integrates design, R&amp;D, production and sales of mechanical,
              electronic and fingerprint safes and storage boxes under the Yongshun and Manadun brands.
            </SectionHeading>
            <p className="text-muted-foreground mt-5 leading-relaxed">
              {contentText(content,'registration',`Business registration dates from ${company.registeredLabel}. The company works from the Jinyanshan Industrial Area in Quanxi Town, Wuyi County, Zhejiang.`)}
            </p>
            <div className="mt-8">
              <LinkButton href="/about" variant="outline">
                About the company
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
