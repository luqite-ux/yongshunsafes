'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [pending, setPending] = useState(false)
  const [entering, setEntering] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      setEntering(true)
      return
    }
    if (typeof IntersectionObserver === 'undefined') return

    setPending(true)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPending(false)
          setEntering(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn('reveal', pending && 'reveal-pending', entering && 'reveal-entering', className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
      onAnimationEnd={event => {
        if (event.target === event.currentTarget) setEntering(false)
      }}
    >
      {children}
    </div>
  )
}
