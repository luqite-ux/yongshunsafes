'use client'

import { formatDimensions, lockLabels } from '@/lib/products'
import { cn } from '@/lib/utils'
import { DimensionGraphic } from '@/components/home/sizes-section'
import { useProductModel } from '@/components/products/product-model-provider'

export function SpecTable() {
  const { models, model } = useProductModel()
  const rows: { label: string; value: (m: (typeof models)[number]) => string }[] = [
    { label: 'Access', value: (m) => (m.lockTypes.length ? m.lockTypes.map((l) => lockLabels[l]).join(', ') : 'On request') },
    { label: 'External size (H × W × D)', value: (m) => formatDimensions(m.dimensions) },
    { label: 'Weight', value: (m) => (m.weightKg ? `${m.weightKg} kg` : 'On request') },
    { label: 'Accessories', value: (m) => m.accessories ?? 'On request' },
  ]
  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      <div role="region" tabIndex={0} aria-label="Specification table, scrolls horizontally on small screens" className="border-border overflow-x-auto rounded-3xl border bg-white">
        <table className="w-full min-w-[420px] text-left text-sm">
          <caption className="sr-only">Specification by model</caption>
          <thead>
            <tr className="bg-secondary">
              <th scope="col" className="px-5 py-4 font-semibold">Specification</th>
              {models.map((m) => (
                <th key={m.id} scope="col" className={cn('px-5 py-4 font-semibold', m.id === model.id && 'text-gold-deep')}>
                  {m.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-t">
                <th scope="row" className="text-muted-foreground px-5 py-4 font-medium">{r.label}</th>
                {models.map((m) => (
                  <td key={m.id} className={cn('px-5 py-4', m.id === model.id && 'bg-accent/40 font-semibold')}>
                    {r.value(m)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-border rounded-3xl border bg-white p-6">
        <p className="eyebrow">Dimension diagram</p>
        <p className="font-display mt-2 text-xl font-semibold">{model.name}</p>
        <div className="mx-auto mt-3 max-w-[260px]">
          <DimensionGraphic dimensions={model.dimensions} label={model.name} />
        </div>
      </div>
    </div>
  )
}
