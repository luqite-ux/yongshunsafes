import { ChevronDown, Layers, Maximize, Palette, Settings2, Boxes } from 'lucide-react'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { LinkButton } from '@/components/site/link-button'
import { customOptions } from '@/lib/manufacturing'
import {contentRows,type ModuleContent} from '@/lib/site-content/values'

const icons = { size: Maximize, material: Layers, colour: Palette, process: Settings2, moq: Boxes } as const

export function CustomizationSection({content,minimumOrder=20}:{content?:ModuleContent;minimumOrder?:number}) {
  const options=contentRows(content)?.map(row=>({id:String(row.id),title:String(row.title||''),text:String(row.body||'')}))||customOptions
  return (
    <section id="customization" aria-labelledby="customization-title" className="bg-secondary/60 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading content={content} eyebrow="Customization" id="customization-title" title="What can be customized?">
            Four things can be tailored to your project, from a minimum of 20 units.
          </SectionHeading>
          <div className="mt-8">
            <LinkButton href="/contact" variant="primary">
              Send your requirement
            </LinkButton>
          </div>
          <p className="text-muted-foreground mt-4 text-sm">Minimum order: {minimumOrder} units.</p>
        </Reveal>

        <Reveal delay={100}>
          <div className="border-border divide-y rounded-3xl border bg-white">
            {options.map((o, i) => {
              const Icon = icons[o.id as keyof typeof icons]||Settings2
              return (
                <details key={o.id} open={i === 0} className="group">
                  <summary className="flex min-h-16 cursor-pointer items-center gap-4 px-5 py-4 sm:px-6">
                    <span className="bg-sky text-blue-deep flex size-11 shrink-0 items-center justify-center rounded-xl">
                      <Icon aria-hidden className="size-5" />
                    </span>
                    <span className="font-display flex-1 text-xl font-semibold">{o.title}</span>
                    <ChevronDown aria-hidden className="size-5 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-muted-foreground px-5 pb-6 pl-[4.75rem] leading-relaxed sm:px-6 sm:pb-6 sm:pl-[5.25rem]">
                    {o.text}
                  </p>
                </details>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
