'use client'

import { useState } from 'react'
import Image from 'next/image'
import { t } from '@/lib/i18n'
import type { ProductImage } from '@/lib/products'
import { cn } from '@/lib/utils'
import { Ruler } from 'lucide-react'

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [index, setIndex] = useState(0)
  const current = images[index]
  if (!current) return <div className="flex min-h-72 flex-col items-center justify-center gap-5 rounded-[2rem] bg-secondary p-8 text-center">
    <Ruler aria-hidden className="size-16 text-gold-deep" strokeWidth={1.25} />
    <p className="font-display text-2xl font-semibold">Start with your model and dimensions</p>
    <p className="text-muted-foreground max-w-xs">Discuss the cabinet size and access configuration for your order.</p>
  </div>

  return (
    <div>
      <div className="border-border bg-stage relative aspect-square overflow-hidden rounded-[2rem] border">
        <Image
          key={current.src}
          src={current.src}
          alt={t(current.alt)}
          fill
          priority
          fetchPriority="high"
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain p-6 sm:p-10"
        />
      </div>
      {images.length > 1 && (
        <ul className="mt-4 flex flex-wrap gap-3" aria-label="Gallery thumbnails">
          {images.map((img, i) => (
            <li key={img.src}>
              <button
                type="button"
                aria-label={`Show image ${i + 1} of ${images.length}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={cn(
                  'bg-stage relative block size-20 overflow-hidden rounded-xl border-2',
                  i === index ? 'border-gold' : 'border-border',
                )}
              >
                <Image src={img.src} alt="" fill sizes="80px" className="object-contain p-1.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
