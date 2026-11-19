'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { LinkButton } from '@/components/site/link-button'
import { cn } from '@/lib/utils'
import {contentRows,contentText,type ModuleContent} from '@/lib/site-content/values'
import {siteTypographyStyle} from '@/lib/site-content/typography'

const fallbackSlides = [
  {
    id: 'select',
    headline: 'Choose the safe that fits your space',
    body: 'Browse five series by finish, size and access option, then compare models before you inquire.',
    cta: 'Browse series',
    href: '/products',
    image: '/images/banners/banner-01.jpg',
    alt: 'Cream wood-finish safe with its door open showing a quilted interior and bolts, on a metal platform',
    align: 'right',
    mobilePosition: '27%',
  },
  {
    id: 'access',
    headline: 'Access options for everyday security',
    body: 'Mechanical, electronic and fingerprint access across the range, so each space gets the right way in.',
    cta: 'See access options',
    href: '/products',
    image: '/images/banners/banner-02.jpg',
    alt: 'Bronze fingerprint safe standing on a round platform surrounded by fingerprint graphics',
    align: 'left',
    mobilePosition: '100%',
  },
  {
    id: 'order',
    headline: 'Plan your next safe order',
    body: 'Talk through customization, samples and quantity with the factory team in Wuyi.',
    cta: 'Start the conversation',
    href: '/contact',
    image: '/images/banners/banner-03.jpg',
    alt: 'Group of grey electronic safes, some with doors open, in front of a shield graphic and a factory hall',
    align: 'left',
    mobilePosition: '85%',
  },
] as const

const INTERVAL = 7500

export function HeroCarousel({content}:{content?:ModuleContent}) {
  const rows=contentRows(content,'slides'),slides=rows?.length?rows.map((row,i)=>{const original=fallbackSlides[Number(String(row.id).replace('banner-',''))-1]||fallbackSlides[i%fallbackSlides.length];return {...original,id:String(row.id),headline:String(row.headline||''),body:String(row.body||''),cta:String(row.cta_label||''),href:String(row.cta_href||'/contact'),image:row.desktop_image?.url||original.image,mobileImage:row.mobile_image?.url||row.desktop_image?.url||original.image,alt:row.desktop_image?.alt||original.alt,mobileAlt:row.mobile_image?.alt||row.desktop_image?.alt||original.alt}}):fallbackSlides.map(s=>({...s,mobileImage:s.image,mobileAlt:s.alt}))
  const fonts={'site-sans':'var(--font-body)','site-display':'var(--font-display)'}
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [reduced, setReduced] = useState(true)
  const [inView, setInView] = useState(true)
  const [interacting, setInteracting] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const touchStart = useRef<number | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    if (mq.matches) setPlaying(false)
    const onChange = (e: MediaQueryListEvent) => {
      setReduced(e.matches)
      if (e.matches) setPlaying(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const go = useCallback((n: number) => setIndex((n + slides.length) % slides.length), [slides.length])

  useEffect(() => {
    if (!playing || reduced || !inView || interacting) return
    const id = window.setTimeout(() => go(index + 1), INTERVAL)
    return () => window.clearTimeout(id)
  }, [index, playing, reduced, inView, interacting, go])

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured safes"
      className="relative touch-pan-y bg-[#1e3a68] text-white lg:bg-transparent"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocus={() => setInteracting(true)}
      onBlur={() => setInteracting(false)}
      onPointerDown={(e) => {
        if (e.pointerType === 'touch') touchStart.current = e.clientX
      }}
      onPointerUp={(e) => {
        if (touchStart.current === null) return
        const dx = e.clientX - touchStart.current
        touchStart.current = null
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1))
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(index + 1)
        if (e.key === 'ArrowLeft') go(index - 1)
      }}
    >
      <div className="grid" aria-live={playing ? 'off' : 'polite'}>
        {slides.map((s, i) => {
          const active = i === index
          return (
            <article
              key={s.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
              aria-hidden={!active}
              inert={!active}
              className={cn(
                'col-start-1 row-start-1 transition-opacity duration-700',
                active ? 'opacity-100' : 'pointer-events-none opacity-0',
              )}
            >
              <div className="relative h-[300px] w-full sm:h-[380px] lg:h-auto lg:aspect-[2576/1073]">
                <Image src={s.mobileImage} alt={s.mobileAlt} fill priority={i===0} fetchPriority={i===0?'high':undefined} sizes="(max-width:1023.98px) 100vw, 1px" className="object-cover object-[var(--pos)] lg:hidden" style={{ ['--pos' as string]: `${s.mobilePosition} 50%` }} />
                <Image src={s.image} alt={s.alt} fill priority={i===0} fetchPriority={i===0?'high':undefined} sizes="(min-width:1024px) 100vw, 1px" className="hidden object-cover lg:block lg:object-center" />
              </div>

              <div
                className={cn(
                  'relative px-4 pb-24 pt-14 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-14 before:bg-gradient-to-b before:from-[#102e55] before:to-[#1e3a68] sm:px-6 lg:absolute lg:inset-y-0 lg:flex lg:w-[40%] lg:flex-col lg:justify-center lg:p-0 lg:pb-8 lg:before:hidden',
                  s.align === 'right' ? 'lg:right-[5%]' : 'lg:left-[5%]',
                )}
              >
                <div className={cn('relative z-10 text-white lg:[text-shadow:0_2px_24px_rgb(6_20_52/0.6)]', active && 'motion-safe:animate-[section-enter_0.7s_ease-out_both]')}>
                  <p className="eyebrow hq-typography" style={{...siteTypographyStyle(content?.styles,'eyebrow',fonts),color:'#f0cf8a'}}>{contentText(content,'eyebrow','YONGSHUN · Safe manufacturer')}</p>
                  <h2 className="display-title hq-typography mt-4 text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-6xl" style={siteTypographyStyle(content?.styles,`slides.${s.id}.headline`,fonts)}>
                    {s.headline}
                  </h2>
                  <p className="hq-typography mt-5 max-w-md text-base leading-relaxed text-white/90 lg:text-lg" style={siteTypographyStyle(content?.styles,`slides.${s.id}.body`,fonts)}>
                    {s.body}
                  </p>
                  <div className="mt-7">
                    <LinkButton href={s.href} variant="gold" tabIndex={active ? 0 : -1}>
                      {s.cta}
                    </LinkButton>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <div className="absolute bottom-5 left-4 right-4 flex items-center justify-between gap-3 sm:left-6 sm:right-6 lg:bottom-6 lg:left-auto lg:right-8 lg:justify-end">
        <div className="text-foreground flex items-center gap-1 rounded-full bg-white/95 p-1 shadow-sm ring-1 ring-black/10">
          <button
            type="button"
            className="hover:bg-secondary flex size-11 items-center justify-center rounded-full"
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
          >
            <ChevronLeft aria-hidden className="size-5" />
          </button>
          <div className="flex items-center" role="group" aria-label="Choose slide">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => go(i)}
                className="flex size-11 items-center justify-center rounded-full"
              >
                <span
                  className={cn(
                    'block h-2 rounded-full transition-all',
                    i === index ? 'bg-gold-deep w-6' : 'bg-primary/60 w-2',
                  )}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            className="hover:bg-secondary flex size-11 items-center justify-center rounded-full"
            aria-label="Next slide"
            onClick={() => go(index + 1)}
          >
            <ChevronRight aria-hidden className="size-5" />
          </button>
          <button
            type="button"
            className="hover:bg-secondary flex size-11 items-center justify-center rounded-full"
            aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? <Pause aria-hidden className="size-4" /> : <Play aria-hidden className="size-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
