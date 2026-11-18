import type {MetadataRoute} from 'next'
import {getCatalogue} from '@/lib/catalogue-db'
import {getPublishedArticles} from '@/lib/articles-db'
import {siteOrigin} from '@/lib/settings-db'
import {getSiteSettings} from '@/lib/settings-db'
import {localePath} from '@/lib/route-locale'
export const revalidate=60
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const settings=await getSiteSettings('en'),origin=siteOrigin()
 const locales=settings.languages.length?settings.languages:[settings.defaultLanguage]
 const pages=await Promise.all(locales.map(async locale=>{
  const [{products},articles]=await Promise.all([getCatalogue(locale),getPublishedArticles(locale)])
  return [...['/','/products','/manufacturing','/cases','/about','/news','/contact'].map(path=>({url:origin+localePath(path,locale,settings.defaultLanguage)})),...products.map(p=>({url:origin+localePath('/products/'+p.slug,locale,settings.defaultLanguage),...(p.updatedAt?{lastModified:p.updatedAt}:{})})),...articles.map(a=>({url:origin+localePath('/news/'+a.slug,locale,settings.defaultLanguage),...(a.updatedAt||a.publishedAt?{lastModified:a.updatedAt||a.publishedAt}:{})}))]
 }))
 return pages.flat()
}
