import 'server-only'
import type {Metadata} from 'next'
import {getSiteSettings,siteOrigin} from '@/lib/settings-db'
import {getSiteView} from '@/lib/site-content/view'
import {getRequestLocale,localePath} from '@/lib/route-locale'
export async function staticPageMetadata(path:string,fallback:Metadata,requestedLocale?:string):Promise<Metadata>{
 const locale=requestedLocale||await getRequestLocale()
 const settings=await getSiteSettings(locale)
 let seo:Record<string,unknown>|undefined
 try{const snapshot=await getSiteView(locale);seo=snapshot?.pages.find(p=>p.path===path)?.modules.find(m=>m.type==='seo')?.values}catch{return {title:'Preview unavailable',robots:{index:false,follow:false}}}
 const fallbackTitle=typeof fallback.title==='string'?fallback.title:settings.seoTitle
 const title=typeof seo?.title==='string'&&seo.title?seo.title:fallbackTitle,description=typeof seo?.description==='string'&&seo.description?seo.description:fallback.description||settings.seoDescription,url=siteOrigin()+localePath(path,locale,settings.defaultLanguage),image=new URL(settings.logo,siteOrigin()).href
 const languages=Object.fromEntries(settings.languages.map(language=>[language,siteOrigin()+localePath(path,language,settings.defaultLanguage)]))
 return {title:path==='/'?{absolute:title}:title,description,alternates:{canonical:url,languages:{...languages,'x-default':siteOrigin()+localePath(path,settings.defaultLanguage,settings.defaultLanguage)}},openGraph:{title,description,type:'website',url,images:[{url:image}],locale},twitter:{card:'summary_large_image',title,description,images:[image]}}
}
