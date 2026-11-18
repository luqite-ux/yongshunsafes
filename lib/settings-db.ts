import 'server-only'
import {cache} from 'react'
import {tenantRows,localized} from '@/lib/catalogue-db'
import {company,fullAddress} from '@/lib/site'
import {getRequestLocale} from '@/lib/route-locale'
export const getSiteSettings=cache(async(requestedLocale?:string)=>{
 const locale=requestedLocale||await getRequestLocale()
 try{
  const [row]=await tenantRows('tenants',{select:'id,domain,default_language,supported_languages,logo_url,favicon_url,site_title_i18n,site_tagline_i18n,site_description_i18n,contact_email,contact_phone,contact_address_i18n,seo_title_i18n,seo_description_i18n,social_links,legal_name:extra_settings->legal_name_i18n'})
  if(!row)throw Error('Missing customer settings')
  return {source:'backend' as const,legalName:localized(row.legal_name,company.legalName,locale).en,title:localized(row.site_title_i18n,'YONGSHUN Safes',locale).en,tagline:localized(row.site_tagline_i18n,'',locale).en,description:localized(row.site_description_i18n,'',locale).en,seoTitle:localized(row.seo_title_i18n,'YONGSHUN Safes',locale).en,seoDescription:localized(row.seo_description_i18n,'',locale).en,logo:row.logo_url||'/images/brand/yongshun-logo.jpg',favicon:row.favicon_url||'/icon.svg',email:row.contact_email||company.email,phone:row.contact_phone||company.phone,address:localized(row.contact_address_i18n,fullAddress,locale).en,defaultLanguage:row.default_language||'en',languages:Array.isArray(row.supported_languages)?row.supported_languages:['en']}
 }catch{return {source:'fallback' as const,legalName:company.legalName,title:'YONGSHUN Safes',tagline:'',description:'Safe cabinet manufacturer in Wuyi, Zhejiang.',seoTitle:'YONGSHUN Safe Manufacturer',seoDescription:'Mechanical, electronic and fingerprint safe cabinets, made in Wuyi, Zhejiang.',logo:'/images/brand/yongshun-logo.jpg',favicon:'/icon.svg',email:company.email,phone:company.phone,address:fullAddress,defaultLanguage:'en',languages:['en']}}
})
export function siteOrigin(){return (process.env.NEXT_PUBLIC_SITE_URL||company.url).replace(/\/$/,'')}
