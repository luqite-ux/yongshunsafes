import Image from 'next/image'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * A photograph slot. When `src` is provided the real photograph renders, complete and uncropped;
 * otherwise a neutral labelled tile holds the layout until the photograph is added.
 */
export function ImageSlot({
  src,
  alt,
  label,
  icon: Icon,
  aspect = 'aspect-[4/3]',
  sizes = '(min-width: 1024px) 33vw, 100vw',
  fit = 'contain',
  className,
}: {
  src?: string
  alt: string
  label: string
  icon: LucideIcon
  aspect?: string
  sizes?: string
  fit?: 'contain' | 'cover'
  className?: string
}) {
  if (src) {
    return (
      <div className={cn('relative overflow-hidden rounded-2xl bg-white', aspect, className)}>
        <Image src={src} alt={alt} fill sizes={sizes} className={fit === 'cover' ? 'object-cover' : 'object-contain'} />
      </div>
    )
  }
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        'line-grid border-border text-muted-foreground flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-white/70 p-6 text-center',
        aspect,
        className,
      )}
    >
      <Icon aria-hidden className="text-gold-deep size-8" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}
