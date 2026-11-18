import type { Metadata } from 'next'
import {staticPageMetadata} from '@/lib/page-metadata'
import Link from '@/components/site/site-link'
import { Newspaper } from 'lucide-react'
import { PageHero } from '@/components/site/page-hero'
import { LinkButton } from '@/components/site/link-button'
import { getPublishedArticles } from '@/lib/articles-db'
import { t } from '@/lib/i18n'
import {getSiteView,siteModule} from '@/lib/site-content/view'
import {contentText} from '@/lib/site-content/values'
import {siteTypographyStyle} from '@/lib/site-content/typography'
import {Reveal} from '@/components/site/reveal'

const initialMetadata: Metadata = {
  title: 'News',
  alternates:{canonical:'/news'},
  description: 'Company news from YONGSHUN safe manufacturer.',
}

export const revalidate = 60
export async function generateMetadata(){return staticPageMetadata('/news',initialMetadata)}
export default async function NewsPage() {
  const articles = await getPublishedArticles()
  const snapshot=await getSiteView(),empty=siteModule(snapshot,'/news','empty')
  return (
    <div data-hq-content-version={snapshot?.pages.some(p=>p.path==='/news')?snapshot.version:undefined}>
      <PageHero content={siteModule(snapshot,'/news','intro')} eyebrow="News" title="Company news" crumbs={[{ label: 'Home', href: '/' }, { label: 'News' }]} />
      <section aria-label="News articles" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {articles.length === 0 ? (
            <Reveal className="border-border mx-auto max-w-2xl rounded-3xl border border-dashed bg-white p-10 text-center">
              <Newspaper aria-hidden className="text-gold-deep mx-auto size-10" />
              <h2 className="font-display hq-typography mt-4 text-2xl font-semibold" style={siteTypographyStyle(empty?.styles,'title',{'site-sans':'var(--font-body)','site-display':'var(--font-display)'})}>{contentText(empty,'title','No news published yet')}</h2>
              <p className="text-muted-foreground hq-typography mt-2" style={siteTypographyStyle(empty?.styles,'body',{'site-sans':'var(--font-body)','site-display':'var(--font-display)'})}>{contentText(empty,'body','Articles will appear here once they are published. For product or order questions, contact us directly.')}</p>
              <div className="mt-6"><LinkButton href="/contact">Contact us</LinkButton></div>
            </Reveal>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <li key={a.slug} className="h-full"><Reveal className="h-full">
                  <Link href={`/news/${a.slug}`} className="border-border hover:border-gold flex h-full flex-col overflow-hidden rounded-3xl border bg-white">
                    {a.cover&&<img src={a.cover} alt={t(a.title)} className="aspect-[16/10] w-full object-cover"/>}
                    <div className="flex flex-1 flex-col p-6">
                    <time dateTime={a.publishedAt} className="eyebrow">
                      {new Date(a.publishedAt).toLocaleDateString('en-GB', { dateStyle: 'long' })}
                    </time>
                    <h2 className="font-display mt-3 line-clamp-3 text-xl font-semibold">{t(a.title)}</h2>
                    <p className="text-muted-foreground mt-2 line-clamp-3 text-sm leading-relaxed">{t(a.excerpt)}</p>
                    <span className="text-gold-deep mt-auto pt-6 text-sm font-semibold">Read more →</span>
                    </div>
                  </Link>
                </Reveal></li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
