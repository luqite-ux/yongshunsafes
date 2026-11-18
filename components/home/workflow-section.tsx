import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { orderSteps } from '@/lib/manufacturing'
import {editableSteps} from '@/lib/structured-content'
import type {ModuleContent} from '@/lib/site-content/values'

export function WorkflowSection({content}:{content?:ModuleContent}) {
  const steps=editableSteps(content,orderSteps)
  return (
    <section id="workflow" aria-labelledby="workflow-title" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading content={content} eyebrow="Order process" id="workflow-title" title="How does an order proceed?">
            Five connected steps take an order from first requirement to packed cabinets.
          </SectionHeading>
        </Reveal>

        <Reveal className="mt-16">
          <ol className="relative grid gap-10 lg:grid-cols-5 lg:gap-6">
            <span
              aria-hidden
              className="bg-border absolute bottom-6 left-6 top-6 w-px lg:bottom-auto lg:left-6 lg:right-6 lg:top-6 lg:h-px lg:w-auto"
            />
            {steps.map((s, i) => (
              <li key={s.id} className="relative flex gap-5 lg:flex-col lg:gap-6">
                <span className="bg-background relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-gold text-gold-deep">
                  <s.icon aria-hidden className="size-6" />
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold">
                    <span className="sr-only">Step {i + 1}: </span>
                    {s.label}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
