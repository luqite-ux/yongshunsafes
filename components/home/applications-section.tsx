import Link from '@/components/site/site-link'
import { ArrowUpRight, Building2, Home, Store } from 'lucide-react'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { ImageSlot } from '@/components/site/image-slot'
import { applications } from '@/lib/applications'
import {contentRows,type ModuleContent} from '@/lib/site-content/values'

const icons = { office: Building2, home: Home, commercial: Store } as const

export function ApplicationsSection({content,scenes}:{content?:ModuleContent;scenes?:ModuleContent}) {
  const items=contentRows(scenes)?.slice(0,3).map(row=>({id:String(row.id),title:String(row.title||''),caption:String(row.caption||''),image:String(row.image?.url||''),aspect:applications.find(a=>a.id===row.id)?.aspect||'aspect-[4/3]'}))||applications
  return (
    <section id="applications" aria-labelledby="applications-title" className="bg-sky py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading content={content} eyebrow="Applications" id="applications-title" title="Where can these safes be used?">
            From desks and studies to shop counters, a safe is chosen for the space it sits in.
          </SectionHeading>
        </Reveal>

        <ul className="-mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
          {items.map((a, i) => {
            const Icon = icons[a.id as keyof typeof icons]||Building2
            return (
              <li key={a.id} className="w-[82%] shrink-0 snap-start sm:w-auto">
                <Reveal delay={i * 80} className="h-full">
                  <Link
                    href="/cases"
                    className="group border-border hover:border-gold flex h-full flex-col overflow-hidden rounded-3xl border bg-white transition-colors"
                  >
                    <ImageSlot
                      src={a.image}
                      alt={`${a.title} application scene`}
                      label="Scene photograph to be added"
                      icon={Icon}
                      aspect={a.aspect}
                      className="rounded-none"
                    />
                    <div className="flex items-start justify-between gap-3 p-5">
                      <div>
                        <h3 className="font-display text-xl font-semibold">{a.title}</h3>
                        <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{a.caption}</p>
                      </div>
                      <ArrowUpRight aria-hidden className="mt-1 size-5 shrink-0" />
                    </div>
                  </Link>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
