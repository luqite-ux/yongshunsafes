'use client'

import { ArrowUp } from 'lucide-react'

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="hover:bg-white inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/25 px-5 text-sm font-semibold"
    >
      <ArrowUp aria-hidden className="size-4" />
      Back to top
    </button>
  )
}
