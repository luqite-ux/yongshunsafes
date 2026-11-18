'use client'

import { useState } from 'react'
import Link from '@/components/site/site-link'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { AlignmentScene } from '@/components/three/alignment-scene'
import { formatDimensions, lockLabels, productName, type Dimensions, type Product, type Category } from '@/lib/products'
import { cn } from '@/lib/utils'
import type {ModuleContent} from '@/lib/site-content/values'

export function DimensionGraphic({ dimensions, label }: { dimensions: Dimensions | null; label: string }) {
  const ratio = dimensions ? dimensions.widthMm / dimensions.heightMm : 0.68
  const h = Math.min(200, 220 / ratio)
  const w = h * ratio
  const x = 140 - w / 2
  const y = 50
  return (
    <svg viewBox="0 0 320 330" role="img" aria-label={`Dimension diagram for ${label}`} className="w-full">
      <rect x={x} y={y} width={w} height={h} rx="6" fill="#fff" stroke="#161b26" strokeWidth="2" />
      <rect x={x + 12} y={y + 12} width={w - 24} height={h - 24} rx="3" fill="none" stroke="#b8862b" strokeWidth="1.5" />
      <circle cx={140} cy={y + h * 0.42} r="14" fill="none" stroke="#4a6c9b" strokeWidth="1.5" />
      <path d={`M ${x} ${y + h + 30} H ${x + w}`} stroke="#4a6c9b" strokeWidth="1.5" />
      <path d={`M ${x} ${y + h + 22} V ${y + h + 38} M ${x + w} ${y + h + 22} V ${y + h + 38}`} stroke="#4a6c9b" strokeWidth="1.5" />
      <path d={`M ${x + w + 30} ${y} V ${y + h}`} stroke="#4a6c9b" strokeWidth="1.5" />
      <path d={`M ${x + w + 22} ${y} H ${x + w + 38} M ${x + w + 22} ${y + h} H ${x + w + 38}`} stroke="#4a6c9b" strokeWidth="1.5" />
      <path d={`M ${x + w + 4} ${y - 8} A 36 36 0 0 1 ${x + w + 34} ${y - 30}`} fill="none" stroke="#b8862b" strokeWidth="1.5" strokeDasharray="3 3" />
      <text x={140} y={y + h + 58} textAnchor="middle" fontSize="13" fontWeight="600" fill="#161b26">
        Width{dimensions ? ` ${dimensions.widthMm} mm` : ''}
      </text>
      <text
        x={x + w + 50}
        y={y + h / 2}
        fontSize="13"
        fontWeight="600"
        fill="#161b26"
        transform={`rotate(90 ${x + w + 50} ${y + h / 2})`}
        textAnchor="middle"
      >
        Height{dimensions ? ` ${dimensions.heightMm} mm` : ''}
      </text>
      <text x={140} y={y - 24} textAnchor="middle" fontSize="13" fontWeight="600" fill="#7a5210">
        Depth{dimensions ? ` ${dimensions.depthMm} mm` : ''}
      </text>
    </svg>
  )
}

export function SizesSection({products,categories,content}:{products:Product[];categories:Category[];content?:ModuleContent}) {
  const allModels = products.flatMap(product => product.models.map(model => ({product,model})))
  if (!allModels.length) return null
  return <SizeComparison key={products.map(p=>p.slug).join(':')} products={products} categories={categories} allModels={allModels} content={content} />
}

function SizeComparison({products,categories,allModels,content}:{products:Product[];categories:Category[];allModels:{product:Product;model:Product['models'][number]}[];content?:ModuleContent}) {
  const [productSlug, setProductSlug] = useState(allModels[0].product.slug)
  const [selected, setSelected] = useState(`${allModels[0].product.slug}:${allModels[0].model.id}`)
  const visibleModels = allModels.filter(model => model.product.slug === productSlug)
  const current = visibleModels.find((m) => `${m.product.slug}:${m.model.id}` === selected) ?? visibleModels[0]

  return (
    <section id="sizes" aria-labelledby="sizes-title" className="relative isolate overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 opacity-60" aria-hidden>
        <AlignmentScene variant="arcs" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading content={content} eyebrow="Sizes" id="sizes-title" title="Which cabinet size fits?">
            Compare models by series, access option and external dimensions. Select a row to see its dimension diagram.
          </SectionHeading>
          <label className="mt-8 block max-w-xl text-sm font-semibold">
            Select a series configuration
            <select value={productSlug} onChange={event => {
              const slug = event.target.value
              setProductSlug(slug)
              const first = allModels.find(model => model.product.slug === slug)!
              setSelected(`${first.product.slug}:${first.model.id}`)
            }} className="mt-2 min-h-12 w-full rounded-xl border bg-white px-4 py-3 text-base font-normal">
              {products.map(product => <option key={product.slug} value={product.slug}>{productName(product)} — {product.models[0]?.name}</option>)}
            </select>
          </label>
        </Reveal>

        <Reveal className="mt-12">
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div
              role="region"
              aria-label="Model comparison table, scrolls horizontally on small screens"
              tabIndex={0}
              className="border-border overflow-x-auto rounded-3xl border bg-white"
            >
              <table className="w-full min-w-[620px] text-left text-sm">
                <caption className="sr-only">Models with series, access options and external dimensions</caption>
                <thead>
                  <tr className="bg-secondary text-xs uppercase tracking-wider">
                    <th scope="col" className="px-5 py-4 font-semibold">Model</th>
                    <th scope="col" className="px-5 py-4 font-semibold">Series</th>
                    <th scope="col" className="px-5 py-4 font-semibold">Access</th>
                    <th scope="col" className="px-5 py-4 font-semibold">External H × W × D</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleModels.map(({ product, model }) => {
                    const id = `${product.slug}:${model.id}`
                    const on = id === selected
                    const cat = categories.find((c) => c.slug === product.category)
                    return (
                      <tr key={id} className={cn('border-t', on && 'bg-accent/50')}>
                        <th scope="row" className="p-0">
                          <button
                            type="button"
                            aria-pressed={on}
                            onClick={() => setSelected(id)}
                            className="flex min-h-12 w-full items-center px-5 text-left font-semibold"
                          >
                            {model.name}
                          </button>
                        </th>
                        <td className="px-5 py-3">{cat?.name}</td>
                        <td className="px-5 py-3">
                          {model.lockTypes.length ? model.lockTypes.map((l) => lockLabels[l]).join(', ') : 'On request'}
                        </td>
                        <td className="px-5 py-3">{formatDimensions(model.dimensions)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-border flex flex-col rounded-3xl border bg-white p-6">
              <p className="eyebrow">Selected model</p>
              <p className="font-display mt-2 text-2xl font-semibold">{current.model.name}</p>
              <p className="text-muted-foreground text-sm">{productName(current.product)}</p>
              <div className="mx-auto my-4 w-full max-w-[300px]">
                <DimensionGraphic dimensions={current.model.dimensions} label={current.model.name} />
              </div>
              <Link
                href={`/products/${current.product.slug}`}
                className="text-gold-deep inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4"
              >
                Open full specification
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
