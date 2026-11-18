import Image from 'next/image'
import { t } from '@/lib/i18n'
import type { ProductImage } from '@/lib/products'
import { cn } from '@/lib/utils'
import { Ruler } from 'lucide-react'

/** White stage that matches the white product photographs; the subject is always contained, never cropped. */
export function ProductStage({
  image,
  sizes,
  className,
  priority,
  padding = 'p-6',
}: {
  image?: ProductImage
  sizes: string
  className?: string
  priority?: boolean
  padding?: string
}) {
  return (
    <div className={cn('bg-stage relative aspect-square w-full overflow-hidden', className)}>
      {image?.src ? <Image
        src={image.src}
        alt={t(image.alt)}
        fill
        sizes={sizes}
        priority={priority}
        className={cn('object-contain', padding)}
      /> : <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-secondary/50 p-6 text-center">
        <Ruler aria-hidden className="size-14 text-gold-deep" strokeWidth={1.25} />
        <span className="font-display text-lg font-semibold">Choose your model</span>
      </div>}
    </div>
  )
}
