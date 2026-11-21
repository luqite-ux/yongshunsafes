'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Binary, ClipboardCheck, Fingerprint, KeyRound, Users, type LucideIcon } from 'lucide-react'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { LinkButton } from '@/components/site/link-button'
import { cn } from '@/lib/utils'
import {contentRows,type ModuleContent} from '@/lib/site-content/values'

interface Option {
  id: 'electronic' | 'fingerprint'
  label: string
  icon: LucideIcon
  lead: string
  points: string[]
  pointIcons: LucideIcon[]
  image?: string
  alt: string
  aspect: number
  maxWidth: string
  marker: { x: number; y: number; label: string }
}

const fallbackOptions: Option[] = [
  {
    id: 'electronic',
    label: 'Electronic',
    icon: Binary,
    lead: 'Keypad entry for quick, key-free access.',
    points: ['Keypad entry on the door panel', 'Several users can share one code', 'Often paired with a fingerprint reader'],
    pointIcons: [Binary, Users, Fingerprint],
    image: '/images/products/digital-panel-grey.jpg',
    alt: 'Grey safe with a digital keypad and fingerprint panel on the door',
    aspect: 1,
    maxWidth: 'max-w-[440px]',
    marker: { x: 49, y: 37, label: 'Keypad panel' },
  },
  {
    id: 'fingerprint',
    label: 'Fingerprint',
    icon: Fingerprint,
    lead: 'Touch-to-open access for the people you register.',
    points: ['Fingerprint reader on the door', 'Quick access without carrying a key', 'Bronze fingerprint versions available'],
    pointIcons: [Fingerprint, KeyRound, ClipboardCheck],
    image: '/images/products/tall-grey.png',
    alt: 'Tall grey safe with a round fingerprint reader on the door',
    aspect: 0.654,
    maxWidth: 'max-w-[300px]',
    marker: { x: 59, y: 27, label: 'Fingerprint reader' },
  },
]

export function LocksSection({content}:{content?:ModuleContent}) {
  const rows=contentRows(content,'options')?.filter(row=>row.id==='electronic'||row.id==='fingerprint'),options:Option[]=rows?.length?rows.map(row=>{const base=fallbackOptions.find(o=>o.id===row.id)||fallbackOptions[0];return {...base,id:row.id as Option['id'],label:String(row.title||''),lead:String(row.body||''),points:Array.isArray(row.points)?row.points.map((p:any)=>String(p.text||'')):[],image:row.image?.url||base.image,alt:row.image?.alt||base.alt}}):fallbackOptions
  const [active, setActive] = useState<Option['id']>('electronic')
  const current = options.find((o) => o.id === active)!

  return (
    <section id="locks" aria-labelledby="locks-title" className="bg-sky py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading content={content} eyebrow="Access" id="locks-title" title="Which access option do I need?">
            Explore access types, then confirm the configuration for your chosen model.
          </SectionHeading>
        </Reveal>

        <Reveal className="mt-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div className="min-w-0">
              <div role="tablist" aria-label="Access options" className="bg-white/70 inline-flex w-full rounded-full p-1 sm:w-auto">
                {options.map((o) => (
                  <button
                    key={o.id}
                    role="tab"
                    id={`tab-${o.id}`}
                    aria-selected={active === o.id}
                    aria-controls={`panel-${o.id}`}
                    type="button"
                    onClick={() => setActive(o.id)}
                    className={cn(
                      'flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1 rounded-full px-2 text-xs font-semibold transition-colors sm:flex-none sm:gap-2 sm:px-6 sm:text-sm',
                      active === o.id ? 'bg-primary text-primary-foreground' : 'hover:bg-white',
                    )}
                  >
                    <o.icon aria-hidden className="size-4 shrink-0" />
                    {o.label}
                  </button>
                ))}
              </div>

              <div
                role="tabpanel"
                id={`panel-${current.id}`}
                aria-labelledby={`tab-${current.id}`}
                className="mt-8"
              >
                <h3 className="font-display text-3xl font-semibold tracking-tight">{current.label} access</h3>
                <p className="text-muted-foreground mt-3 text-lg leading-relaxed">{current.lead}</p>
                <ul className="mt-6 space-y-3">
                  {current.points.map((p,index) => {
                    const PointIcon=current.pointIcons[index]||current.icon
                    return (
                    <li key={p} className="flex items-start gap-3">
                      <PointIcon aria-hidden className="text-gold-deep mt-0.5 size-5 shrink-0" />
                      <span>{p}</span>
                    </li>
                    )
                  })}
                </ul>
                <div className="mt-8">
                  <LinkButton href={`/products?lock=${current.id}`} variant="primary">
                    {`See ${current.label.toLowerCase()} models`}
                  </LinkButton>
                </div>
              </div>
            </div>

            <figure className="border-border flex flex-col items-center justify-center rounded-[2rem] border bg-white p-6 sm:p-10">
              <div
                className={cn('relative w-full', current.maxWidth)}
                style={{ aspectRatio: String(current.aspect) }}
              >
                {current.image ? <Image
                  key={current.image}
                  src={current.image}
                  alt={current.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-contain"
                /> : null}
                {current.image && <span
                  aria-hidden
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${current.marker.x}%`, top: `${current.marker.y}%` }}
                >
                  <span className="bg-gold/30 absolute inset-0 -m-2 rounded-full" />
                  <span className="bg-primary text-primary-foreground relative flex size-9 items-center justify-center rounded-full ring-4 ring-white">
                    <current.icon className="size-4" />
                  </span>
                  <span className="bg-primary text-primary-foreground absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold">
                    {current.marker.label}
                  </span>
                </span>}
              </div>
            </figure>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
