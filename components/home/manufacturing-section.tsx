import Image from 'next/image'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { LinkButton } from '@/components/site/link-button'
import { workshopSteps } from '@/lib/manufacturing'
import { company } from '@/lib/site'
import {editableSteps} from '@/lib/structured-content'
import {contentRows,type ModuleContent} from '@/lib/site-content/values'

export function ManufacturingSection({content,process,capacity,gallery}:{content?:ModuleContent;process?:ModuleContent;capacity?:ModuleContent;gallery?:ModuleContent}) {
  const steps=editableSteps(process,workshopSteps),facts=capacity?.values,photos=contentRows(gallery),photo=photos?.find(row=>row.id==='workshop-2')||photos?.[0]
  return (
    <section id="manufacturing" aria-labelledby="manufacturing-title" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <SectionHeading content={content} eyebrow="Manufacturing" id="manufacturing-title" title="Can the supplier manufacture my order?">
              Design, R&amp;D, production and sales sit under one roof in Wuyi, from cutting through to assembly.
            </SectionHeading>
            <dl className="mt-10 grid grid-cols-3 gap-4">
              {[
                [Number(facts?.area??company.areaSqm).toLocaleString('en-US'), 'm² of workshop and site'],
                [String(facts?.lines??company.productionLines), 'customization lines'],
                [`~${Number(facts?.monthly??company.monthlyCapacity).toLocaleString('en-US')}`, 'units per month, indicative'],
              ].map(([value, label]) => (
                <div key={label} className="border-border border-t pt-4">
                  <dt className="text-muted-foreground order-2 mt-1 text-xs leading-snug">{label}</dt>
                  <dd className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-muted-foreground mt-4 text-xs leading-relaxed">
              Production schedules are confirmed for each order.
            </p>
            <div className="mt-8">
              <LinkButton href="/manufacturing" variant="outline">
                See the production sequence
              </LinkButton>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <ol className="relative grid gap-3 sm:grid-cols-2">
              {steps.map((s, i) => (
                <li key={s.id} className="border-border flex gap-4 rounded-2xl border bg-white p-5">
                  <span className="bg-sky text-blue-deep flex size-12 shrink-0 items-center justify-center rounded-xl">
                    <s.icon aria-hidden className="size-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold">
                      <span className="sr-only">Step {i + 1}: </span>
                      {s.label}
                    </h3>
                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <figure className="mt-6 overflow-hidden rounded-3xl">
              <div className="relative aspect-[20/9]">
                <Image
                  src={photo?.image?.url||'/images/company/assembly-staging.jpg'}
                  alt={photo?.image?.alt||'Safe cabinets and packing materials inside the Wuyi manufacturing workshop'}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-contain"
                />
              </div>
              <figcaption className="text-muted-foreground py-3 text-sm">
                {photo?.caption||'Cabinet staging and packing preparation inside the manufacturing building.'}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
