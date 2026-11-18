'use client'
import Link from 'next/link'
import type {ComponentProps} from 'react'
import {siteHref,useSiteLocale} from './locale-provider'

export default function SiteLink(props:ComponentProps<typeof Link>){
 const {locale,defaultLocale}=useSiteLocale()
 return <Link {...props} href={typeof props.href==='string'?siteHref(props.href,locale,defaultLocale):props.href}/>
}
