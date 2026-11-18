import type {MetadataRoute} from 'next'
import {siteOrigin} from '@/lib/settings-db'
export default function robots():MetadataRoute.Robots{return {rules:[{userAgent:'*',allow:'/',disallow:['/admin','/api','/service-expired']}],sitemap:siteOrigin()+'/sitemap.xml'}}
