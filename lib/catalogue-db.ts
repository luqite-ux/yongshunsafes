import 'server-only'
import { cache } from 'react'
import { fallbackCategories, type Product, type Category, type ProductModel, type ProductImage } from '@/lib/products'
import type { Localized } from '@/lib/i18n'
import {readEditableModels} from '@/lib/model-specs'
import {getRequestLocale} from '@/lib/route-locale'

type Row = Record<string, any>
const rowCache=new Map<string,{expires:number;rows:Row[]}>()
const inFlight=new Map<string,Promise<Row[]>>()
const blockedUntil=new Map<string,number>()
export function localized<T>(value: unknown, fallback: T, locale = 'en', defaultLanguage = 'en'): Localized<T> {
  const map = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, T> : {}
  const chosen = [map[locale],map[defaultLanguage],...Object.values(map)].find(v => v !== null && v !== undefined && (typeof v!=='string'||v.trim()!=='') && (!Array.isArray(v)||v.length>0)) ?? fallback
  return { ...map, en: chosen }
}

// Shared Next fetch cache: one tenant inventory per 60s rather than one DB read per card/detail.
// React cache coalesces repeated consumers in the same render. Failed requests are bounded.
export async function tenantRows(table: 'products' | 'product_categories' | 'articles' | 'tenants', query: Record<string,string>) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim(), key = (table==='tenants'?process.env.SUPABASE_SERVICE_ROLE_KEY:process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)?.trim(), tenant = process.env.NEXT_PUBLIC_TENANT_ID?.trim()
  if (!base || !key || !tenant) throw new Error('Customer data configuration unavailable')
  const params = new URLSearchParams({select:'*', [table === 'tenants' ? 'id' : 'tenant_id']:`eq.${tenant}`, ...query})
  const cacheKey=tenant+':'+table+':'+params.toString(),existing=rowCache.get(cacheKey)
  if(existing&&existing.expires>Date.now())return existing.rows
  if((blockedUntil.get(cacheKey)||0)>Date.now())throw new Error('Customer data temporarily backing off')
  const pending=inFlight.get(cacheKey);if(pending)return pending
  const operation=(async()=>{try{
    const response = await fetch(`${base}/rest/v1/${table}?${params}`, {headers:{apikey:key,Authorization:`Bearer ${key}`}, next:{revalidate:60,tags:[`tenant:${tenant}:${table}`]},signal:AbortSignal.timeout(12000)})
    if (!response.ok) throw new Error(`Customer data unavailable (${response.status})`)
    const rows = await response.json()
    if (!Array.isArray(rows)) throw new Error('Invalid customer data response')
    rowCache.set(cacheKey,{expires:Date.now()+60000,rows});return rows as Row[]
  }catch(error){blockedUntil.set(cacheKey,Date.now()+120000);throw error}finally{inFlight.delete(cacheKey)}})()
  inFlight.set(cacheKey,operation);return operation
}

export const getCatalogue = cache(async (requestedLocale?:string): Promise<{products:Product[];categories:Category[];source:'backend'|'fallback'}> => {
  const locale=requestedLocale||await getRequestLocale()
  try {
    const [products, categories] = await Promise.all([tenantRows('products',{is_active:'eq.true',order:'sort_order.asc,id.asc'}),tenantRows('product_categories',{is_active:'eq.true',order:'sort_order.asc,id.asc'})])
    const mappedCategories: Category[] = categories.map(c=>({slug:c.slug,name:localized(c.name_i18n,c.name_en||c.name,locale).en,descriptor:localized(c.extra_data?.descriptor_i18n,c.description_en||c.description||'',locale),summary:localized(c.description_i18n,c.description_en||c.description||'',locale)}))
    const mappedProducts: Product[] = products.map(p=>{
      const extra=p.extra_data||{}, name=localized(p.name_i18n,p.name_en||p.name,locale), sourceModels:ProductModel[]=Array.isArray(extra.models)&&extra.models.length?extra.models:[{id:p.id,name:p.model||name.en,lockTypes:extra.lockTypes||[],dimensions:null,weightKg:null,accessories:null}],models=readEditableModels(p.specs||{},sourceModels,extra.spec_schema_version===1)
      const legacy=Array.isArray(extra.images)?extra.images.filter((i:any)=>i&&typeof i.src==='string'):[],gallery=Array.isArray(extra.gallery)?extra.gallery.filter((url:any)=>typeof url==='string'):legacy.map((i:any)=>i.src)
      const images:ProductImage[] = [...new Set<string>([p.image_url,...gallery].filter((url):url is string=>typeof url==='string'&&!!url))].map(src=>{const details=extra.image_metadata?.[src]||legacy.find((i:any)=>i.src===src);return {src,alt:localized(details?.alt,name.en,locale),aspect:details?.aspect||1}})
      return {id:p.id,slug:p.slug,category:p.category_slug||'',categoryName:mappedCategories.find(c=>c.slug===p.category_slug)?.name,brand:extra.brand,name,summary:localized(p.description_i18n,p.description_en||p.description||'',locale),overview:localized(p.overview_i18n,p.description_en||p.description||'',locale),finish:localized(extra.finish_i18n,extra.finish||'',locale).en,sizeClass:extra.sizeClass||'compact',images,models,features:localized(p.features_i18n,p.features||[],locale),advantages:localized(p.advantages_i18n,[],locale),applications:localized(p.applications_i18n,p.applications||[],locale).en,seoTitle:localized(extra.seo_title_i18n,name.en,locale),seoDescription:localized(extra.seo_description_i18n,p.description_en||p.description||'',locale),updatedAt:p.updated_at}
    })
    return {products:mappedProducts,categories:mappedCategories,source:'backend'}
  } catch {
    // Emergency display fallback is separately identified; an empty successful DB response never uses it.
    const fallback = (await import('@/lib/reviewed-catalogue.json')).default as Product[]
    return {products:fallback,categories:fallbackCategories,source:'fallback'}
  }
})
