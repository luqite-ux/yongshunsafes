import Link from '@/components/site/site-link'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { ProductStage } from '@/components/site/product-stage'
import { AlignmentScene } from '@/components/three/alignment-scene'
import { categoryCover, type Category, type Product } from '@/lib/products'
import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import type {ModuleContent} from '@/lib/site-content/values'

export function SeriesSection({categories,products,content}:{categories:Category[];products:Product[];content?:ModuleContent}) {
  return (
    <section id="series" aria-labelledby="series-title" className="relative isolate overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-y-0 right-0 -z-10 hidden w-1/2 opacity-60 md:block" aria-hidden>
        <AlignmentScene variant="bolts" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading content={content} eyebrow="Series" id="series-title" title="Which series suits my purchase?">
            Five series, each with its own finish and format. Pick an entrance to see every model in that series.
          </SectionHeading>
        </Reveal>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {categories.map((c, i) => {
            const cover = categoryCover(c.slug, products)
            return (
              <li key={c.slug} className={cn('lg:col-span-2', i >= 3 && 'lg:col-span-3')}>
                <Reveal delay={i * 70} className="h-full">
                  <Link
                    href={`/products?category=${c.slug}`}
                    className="group border-border hover:border-gold flex h-full flex-col overflow-hidden rounded-3xl border bg-white transition-colors"
                  >
                    {cover && (
                      <div className="bg-stage border-b">
                        <ProductStage
                          image={cover}
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className={cn('aspect-[5/4]', i >= 3 && 'lg:aspect-[16/10]')}
                          padding="transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 items-start justify-between gap-4 p-6">
                      <div>
                        <h3 className="font-display text-2xl font-semibold tracking-tight">{c.name}</h3>
                        <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{t(c.descriptor)}</p>
                      </div>
                      <span className="bg-secondary group-hover:bg-gold flex size-11 shrink-0 items-center justify-center rounded-full transition-colors">
                        <ArrowUpRight aria-hidden className="size-5" />
                        <span className="sr-only">View {c.name} series</span>
                      </span>
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
