'use client'
import {createContext,useContext,type ReactNode} from 'react'

const LocaleContext=createContext({locale:'en',defaultLocale:'en'})
export function LocaleProvider({locale,defaultLocale,children}:{locale:string;defaultLocale:string;children:ReactNode}){
  return <LocaleContext.Provider value={{locale,defaultLocale}}>{children}</LocaleContext.Provider>
}
export function useSiteLocale(){return useContext(LocaleContext)}
export function siteHref(href:string,locale:string,defaultLocale:string){
  if(locale===defaultLocale||!href.startsWith('/')||href.startsWith('//')||href.startsWith('/api/')||href.startsWith('/admin'))return href
  return `/${locale}${href==='/'?'':href}`
}
