import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import {contentText,type ModuleContent} from '@/lib/site-content/values'
import {siteTypographyStyle} from '@/lib/site-content/typography'

export function SectionHeading({
  eyebrow,
  title,
  children,
  id,
  className,
  align = 'left',
  content,
}: {
  eyebrow: string
  title: string
  children?: ReactNode
  id?: string
  className?: string
  align?: 'left' | 'center'
  content?:ModuleContent
}) {
  eyebrow=contentText(content,'eyebrow',eyebrow);title=contentText(content,'title',title)
  const body=typeof content?.values.body==='string'?content.values.body:children,fonts={'site-sans':'var(--font-body)','site-display':'var(--font-display)'}
  return (
    <div className={cn(align === 'center' && 'mx-auto text-center', 'max-w-3xl', className)}>
      <p className="eyebrow hq-typography" style={siteTypographyStyle(content?.styles,'eyebrow',fonts)}>{eyebrow}</p>
      <h2 id={id} className="display-title hq-typography mt-4 text-4xl sm:text-5xl lg:text-6xl" style={siteTypographyStyle(content?.styles,'title',fonts)}>
        {title}
      </h2>
      {body && (
        <p className="text-muted-foreground hq-typography mt-5 text-base leading-relaxed text-pretty sm:text-lg" style={siteTypographyStyle(content?.styles,'body',fonts)}>
          {body}
        </p>
      )}
    </div>
  )
}
