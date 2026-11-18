import { ChevronDown } from 'lucide-react'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { LinkButton } from '@/components/site/link-button'
import faqGroups from '@/lib/faq-reviewed.json'
import {StructuredData} from '@/components/site/structured-data'
import {siteOrigin} from '@/lib/settings-db'
import {contentRows,type ModuleContent} from '@/lib/site-content/values'

export function FaqSection({content}:{content?:ModuleContent}) {
  const groups=contentRows(content,'groups')?.map(g=>({id:String(g.id),title:String(g.title||''),items:Array.isArray(g.items)?g.items.map((item:any)=>({q:String(item.question||''),a:String(item.answer||'')})):[]}))||faqGroups
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-secondary/60 py-24 sm:py-32">
      <StructuredData data={{'@context':'https://schema.org','@type':'FAQPage','@id':siteOrigin()+'/#faq',mainEntity:groups.flatMap(g=>g.items.map(item=>({'@type':'Question',name:item.q,acceptedAnswer:{'@type':'Answer',text:item.a}})))}}/>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading content={content} eyebrow="Before you order" id="faq-title" title="What should I confirm before ordering?">
            Quantity, samples, lead time, inspection and packaging, answered in one place.
          </SectionHeading>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {groups.map((group, gi) => (
            <Reveal key={group.id} delay={(gi % 2) * 80} className={gi === groups.length - 1 && groups.length % 2 ? 'lg:col-span-2' : ''}>
              <section aria-labelledby={`faq-${group.id}`} className="border-border h-full rounded-3xl border bg-white">
                <h3 id={`faq-${group.id}`} className="eyebrow border-b px-5 py-4 sm:px-6">
                  {group.title}
                </h3>
                <div className="divide-y">
                  {group.items.map((item, i) => (
                    <details key={item.q} open={gi === 0 && i === 0} className="group">
                      <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-semibold sm:px-6">
                        {item.q}
                        <ChevronDown aria-hidden className="size-5 shrink-0 transition-transform group-open:rotate-180" />
                      </summary>
                      <p className="text-muted-foreground px-5 pb-5 leading-relaxed sm:px-6">{item.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <LinkButton href="/contact" variant="primary">
            Ask something else
          </LinkButton>
        </Reveal>
      </div>
    </section>
  )
}
