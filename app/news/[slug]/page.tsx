import type { Metadata } from 'next'
import Link from '@/components/site/site-link'
import { notFound } from 'next/navigation'
import { getArticleBySlug, getPublishedArticles } from '@/lib/articles-db'
import sanitizeHtml from 'sanitize-html'
import {getSiteSettings,siteOrigin} from '@/lib/settings-db'
import {getRequestLocale,localePath} from '@/lib/route-locale'
import {StructuredData} from '@/components/site/structured-data'
import { t } from '@/lib/i18n'

export const revalidate = 60
export const dynamicParams = true
export async function generateStaticParams() {
  return (await getPublishedArticles('en')).map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const locale=await getRequestLocale(),article = await getArticleBySlug(slug,locale)
  if(!article)return {}
  const settings=await getSiteSettings(locale),title=t(article.title),description=t(article.excerpt),path='/news/'+article.slug,url=siteOrigin()+localePath(path,locale,settings.defaultLanguage)
  const languages=Object.fromEntries(settings.languages.map(language=>[language,siteOrigin()+localePath(path,language,settings.defaultLanguage)]))
  return {title,description,alternates:{canonical:url,languages:{...languages,'x-default':siteOrigin()+localePath(path,settings.defaultLanguage,settings.defaultLanguage)}},openGraph:{title,description,type:'article',url,locale,...(article.cover?{images:[{url:article.cover}]}:{}),publishedTime:article.publishedAt,modifiedTime:article.updatedAt},twitter:{card:'summary_large_image',title,description,...(article.cover?{images:[article.cover]}:{})}}
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const locale=await getRequestLocale(),article = await getArticleBySlug(slug,locale)
  if (!article) notFound()
  const settings=await getSiteSettings(locale),url=siteOrigin()+localePath('/news/'+article.slug,locale,settings.defaultLanguage)

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <StructuredData data={{'@context':'https://schema.org','@type':'Article','@id':url+'#article',headline:t(article.title),description:t(article.excerpt),datePublished:article.publishedAt,dateModified:article.updatedAt,...(article.cover?{image:[article.cover]}:{}),publisher:{'@id':siteOrigin()+'/#organization'},mainEntityOfPage:url,inLanguage:locale}}/>
      <Link href="/news" className="text-gold-deep inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">
        Back to News
      </Link>
      <time dateTime={article.publishedAt} className="eyebrow mt-6 block">
        {new Date(article.publishedAt).toLocaleDateString('en-GB', { dateStyle: 'long' })}
      </time>
      <h1 className="display-title mt-3 text-4xl sm:text-5xl">{t(article.title)}</h1>
      {article.cover && <img src={article.cover} alt={t(article.title)} className="mt-8 w-full rounded-2xl object-contain" />}
      <div className="article-prose mt-8 text-lg leading-relaxed" dangerouslySetInnerHTML={{__html:sanitizeHtml(t(article.content),{allowedTags:sanitizeHtml.defaults.allowedTags.concat(['img','figure','figcaption']),transformTags:{h1:'h2'},allowedAttributes:{...sanitizeHtml.defaults.allowedAttributes,img:['src','alt','width','height'],a:['href','target','rel']},allowedSchemes:['https','mailto','tel']})}} />
    </article>
  )
}
