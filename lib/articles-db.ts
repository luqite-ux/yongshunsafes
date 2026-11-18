import 'server-only'
import {cache} from 'react'
import {localized,tenantRows} from '@/lib/catalogue-db'
import {getRequestLocale} from '@/lib/route-locale'
export const getPublishedArticles=cache(async(requestedLocale?:string)=>{
  const locale=requestedLocale||await getRequestLocale()
  const rows=await tenantRows('articles',{is_published:'eq.true',order:'sort_order.asc,published_at.desc.nullslast,id.asc'})
  return rows.map(row=>({id:row.id,slug:row.slug,title:localized(row.title_i18n,row.title_en||row.title||'',locale),excerpt:localized(row.excerpt_i18n,row.excerpt_en||row.excerpt||'',locale),content:localized(row.content_i18n,row.content_en||row.content||'',locale),publishedAt:row.published_at,updatedAt:row.updated_at,cover:row.featured_image||null}))
})
export async function getArticleBySlug(slug:string,locale?:string){return (await getPublishedArticles(locale)).find(article=>article.slug===slug)}
