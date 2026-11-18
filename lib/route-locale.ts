import 'server-only'
import {headers} from 'next/headers'

const localePattern=/^[a-z]{2}(?:-[a-z0-9]{2,8})?$/i
export async function getRequestLocale(){
  const raw=(await headers()).get('x-hq-route-locale')||'en'
  return localePattern.test(raw)?raw.toLowerCase():'en'
}
export function localePath(path:string,locale:string,defaultLocale='en'){
  if(!path.startsWith('/')||path.startsWith('//'))throw Error('Expected local page path')
  return locale===defaultLocale?path:`/${locale}${path==='/'?'':path}`
}
