import 'server-only'
import {getSiteContent} from './site-content'
import type {SiteSnapshot} from './transport'
import {cookies} from 'next/headers'
import {PREVIEW_COOKIE} from './site-content'
import {getRequestLocale} from '@/lib/route-locale'
export async function getSiteView(requestedLocale?:string):Promise<SiteSnapshot|null>{
 const locale=requestedLocale||await getRequestLocale()
 const preview=(await cookies()).has(PREVIEW_COOKIE)
 if(!process.env.NEXT_PUBLIC_TENANT_ID||!process.env.SITE_CONTENT_DOMAIN){if(preview)throw Error('Preview unavailable');return null}
 try{return await getSiteContent(locale)}catch(error){if(preview)throw error;return null}
}
export function siteModule(snapshot:SiteSnapshot|null,path:string,key:string){const module=snapshot?.pages.find(page=>page.path===path)?.modules.find(module=>module.key===key);return module?{...module,locale:snapshot!.locale}:undefined}
