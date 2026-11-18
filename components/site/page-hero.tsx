import Link from '@/components/site/site-link'
import type { ReactNode } from 'react'
import { AlignmentScene } from '@/components/three/alignment-scene'
import { Reveal } from '@/components/site/reveal'
import {StructuredData} from '@/components/site/structured-data'
import {siteOrigin} from '@/lib/settings-db'
import {getRequestLocale,localePath} from '@/lib/route-locale'
import {contentText,type ModuleContent} from '@/lib/site-content/values'
import {siteTypographyStyle} from '@/lib/site-content/typography'

export async function PageHero({
  eyebrow,
  title,
  children,
  crumbs,
  variant = 'arcs',
  content,
}: {
  eyebrow: string
  title: string
  children?: ReactNode
  crumbs?: { label: string; href?: string }[]
  variant?: 'bolts' | 'arcs'
  content?:ModuleContent
}) {
  title=contentText(content,'title',title)
  const locale=await getRequestLocale()
  const body=typeof content?.values.body==='string'?content.values.body:children,fonts={'site-sans':'var(--font-body)','site-display':'var(--font-display)'}
  return (
    <section className="relative isolate overflow-hidden border-b">
      {crumbs&&<StructuredData data={{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,name:c.label,item:siteOrigin()+localePath(c.href||(i===crumbs.length-1?'/'+eyebrow.toLowerCase():'/'),locale)}))}}/>}
      <div className="line-grid absolute inset-0 -z-10 opacity-60" aria-hidden />
      <div className="absolute inset-y-0 right-0 -z-10 w-full opacity-70 lg:w-3/5">
        <AlignmentScene variant={variant} />
      </div>
      <Reveal className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="text-muted-foreground mb-8 text-sm">
            <ol className="flex flex-wrap items-center gap-2">
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-2">
                  {c.href ? (
                    <Link href={c.href} className="hover:text-foreground inline-flex min-h-8 items-center underline-offset-4 hover:underline">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-foreground font-medium">
                      {c.label}
                    </span>
                  )}
                  {i < crumbs.length - 1 && <span aria-hidden>/</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display-title hq-typography mt-4 max-w-3xl text-5xl sm:text-6xl lg:text-7xl" style={siteTypographyStyle(content?.styles,'title',fonts)}>{title}</h1>
        {body && (
          <p className="text-muted-foreground hq-typography mt-6 max-w-2xl text-lg leading-relaxed text-pretty" style={siteTypographyStyle(content?.styles,'body',fonts)}>{body}</p>
        )}
      </Reveal>
    </section>
  )
}
