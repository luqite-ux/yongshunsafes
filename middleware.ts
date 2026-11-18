import {NextResponse,type NextRequest} from 'next/server'
import {isServiceGuardExcludedPath,isWebsiteServiceAvailable} from '@/lib/service-status'
import {protectPreviewResponse} from '@/lib/site-content/preview-protection'
export async function middleware(request:NextRequest){
 const path=request.nextUrl.pathname
 const protect=(response:NextResponse)=>{protectPreviewResponse(response.headers,request.cookies.has('__Host-hq-site-preview'));return response}
 if(path.startsWith('/admin')&&!path.startsWith('/admin/login')&&!path.startsWith('/admin/logout')&&!request.cookies.get('hq_admin_session')?.value)return protect(NextResponse.redirect(new URL('/admin/login',request.url)))
 if(!isServiceGuardExcludedPath(path)&&!await isWebsiteServiceAvailable(request))return protect(NextResponse.rewrite(new URL('/service-expired',request.url)))
 const localeMatch=path.match(/^\/([a-z]{2}(?:-[a-z0-9]{2,8})?)(\/.*)?$/i)
 if(localeMatch){
  const inner=localeMatch[2]||'/'
  if(/^\/(?:products(?:\/|$)|manufacturing\/?$|cases\/?$|about\/?$|news(?:\/|$)|contact\/?$|$)/.test(inner)){
   const locale=localeMatch[1].toLowerCase()
   const target=request.nextUrl.clone();target.pathname=inner
   if(locale==='en')return protect(NextResponse.redirect(target,308))
   const requestHeaders=new Headers(request.headers);requestHeaders.set('x-hq-route-locale',locale)
   return protect(NextResponse.rewrite(target,{request:{headers:requestHeaders}}))
  }
 }
 const requestHeaders=new Headers(request.headers);requestHeaders.set('x-hq-route-locale','en')
 return protect(NextResponse.next({request:{headers:requestHeaders}}))
}
export const config={matcher:['/((?!_next/static|_next/image).*)']}
