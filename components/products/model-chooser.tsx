'use client'

import { t } from '@/lib/i18n'
import { lockLabels } from '@/lib/products'
import { cn } from '@/lib/utils'
import { useProductModel } from '@/components/products/product-model-provider'

export function ModelChooser() {
  const { models, model, setModelId } = useProductModel()
  return (
    <div>
      <p id="model-chooser-label" className="text-sm font-semibold">
        Choose a model
      </p>
      <div role="radiogroup" aria-labelledby="model-chooser-label" className="mt-3 flex flex-wrap gap-2">
        {models.map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={m.id === model.id}
            onClick={() => setModelId(m.id)}
            className={cn(
              'min-h-11 rounded-full border px-5 text-sm font-semibold transition-colors',
              m.id === model.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-white hover:border-gold',
            )}
          >
            {m.name}
          </button>
        ))}
      </div>
      <p className="text-muted-foreground mt-4 text-sm leading-relaxed" aria-live="polite">
        {model.lockTypes.length
          ? `Access: ${model.lockTypes.map((l) => lockLabels[l]).join(', ')}.`
          : 'Access options for this model are available on request.'}
        {model.note ? ` ${t(model.note)}` : ''}
      </p>
    </div>
  )
}
