'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from '@/components/site/site-link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { navItems } from '@/lib/site'
import { cn } from '@/lib/utils'
import {useSiteLocale} from '@/components/site/locale-provider'

export function SiteHeader({logoSrc='/images/brand/yongshun-logo.jpg',items=navItems}:{logoSrc?:string;items?:readonly {href:string;label:string}[]}) {
  const pathname = usePathname()
  const {locale,defaultLocale}=useSiteLocale()
  const localPath=locale===defaultLocale?pathname:pathname.replace(new RegExp(`^/${locale}(?=/|$)`),'')||'/'
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const header = useRef<HTMLElement>(null)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    const onOutside = (e: PointerEvent) => {
      if (!header.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onOutside)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onOutside)
    }
  }, [open])

  const isActive = (href: string) =>
    href === '/' ? localPath === '/' : localPath === href || localPath.startsWith(`${href}/`)

  return (
    <header ref={header} className="bg-background/85 border-border/70 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" onClick={() => setOpen(false)} aria-label="YONGSHUN Safe Manufacturer, Home" className="flex shrink-0 items-center">
          <Image
            src={logoSrc}
            alt="YONGSHUN safe manufacturer logo"
            width={1876}
            height={1279}
            priority
            className="h-16 w-auto mix-blend-multiply"
          />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'relative inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'text-foreground bg-white shadow-[inset_0_0_0_1px_var(--border)]'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={menuButton}
          type="button"
          className="border-input hover:bg-white flex size-11 items-center justify-center rounded-full border lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="bg-background border-t lg:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
              {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'font-display flex min-h-12 items-center justify-between rounded-xl px-3 text-lg font-semibold',
                    isActive(item.href) && 'text-gold-deep bg-white',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
