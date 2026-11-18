import Link from '@/components/site/site-link'
import { ArrowRight } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'gold' | 'outline' | 'light'

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-blue-deep',
  gold: 'bg-gold text-primary hover:bg-[#c99636]',
  outline: 'border border-input bg-transparent text-foreground hover:bg-white',
  light: 'bg-white text-primary hover:bg-[#f4efe3]',
}

export function LinkButton({
  variant = 'primary',
  arrow = true,
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; arrow?: boolean }) {
  return (
    <Link
      {...props}
      className={cn(
        'group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors',
        variants[variant],
        className,
      )}
    >
      {children}
      {arrow && (
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform group-hover:translate-x-0.5"
        />
      )}
    </Link>
  )
}
