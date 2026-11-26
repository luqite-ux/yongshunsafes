import type { Metadata, Viewport } from 'next'
import { Inter, Manrope } from 'next/font/google'
import './globals.css'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { company } from '@/lib/site'
import {getSiteSettings,siteOrigin} from '@/lib/settings-db'
import {StructuredData} from '@/components/site/structured-data'
import {getSiteView,siteModule} from '@/lib/site-content/view'
import {contentRows} from '@/lib/site-content/values'
import {navItems} from '@/lib/site'
import {cookies} from 'next/headers'
import {PREVIEW_COOKIE} from '@/lib/site-content/site-content'
import {getRequestLocale,localePath} from '@/lib/route-locale'
import {LocaleProvider} from '@/components/site/locale-provider'
import {notFound} from 'next/navigation'

const display = Manrope({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700', '800'],
})
const body = Inter({ subsets: ['latin'], variable: '--font-body' })

export async function generateMetadata():Promise<Metadata> {
const locale=await getRequestLocale(),settings=await getSiteSettings(locale)
return {
  metadataBase: new URL(siteOrigin()),
  title: {
    default: settings.seoTitle,
    template: '%s | YONGSHUN Safes',
  },
  description:settings.seoDescription||settings.description,
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  applicationName: 'YONGSHUN Safes',
  alternates: { canonical: localePath('/',locale,settings.defaultLanguage) },
  icons: { icon: [{ url: settings.favicon, type: 'image/svg+xml' }] },
  openGraph: {
    type: 'website',
    siteName: 'YONGSHUN Safes',
    title: settings.seoTitle,
    description:settings.seoDescription||settings.description,
    url: siteOrigin()+localePath('/',locale,settings.defaultLanguage),
    images:[{url:settings.logo.startsWith('https:')?settings.logo:new URL(settings.logo,siteOrigin()).href}],
    locale,
  },
}
}

export const viewport: Viewport = {
  themeColor: '#faf7f0',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale=await getRequestLocale(),settings=await getSiteSettings(locale),origin=siteOrigin()
  if(!settings.languages.includes(locale))notFound()
  const preview=(await cookies()).has(PREVIEW_COOKIE)
  let snapshot
  try{snapshot=await getSiteView(locale)}catch{return <html lang={locale}><body><main className="mx-auto max-w-xl px-6 py-20"><h1 className="text-3xl font-semibold">Preview unavailable</h1><p className="mt-4">This preview has expired. Return to the admin to prepare a new preview.</p><form action="/api/site-content/exit-preview" method="post"><button className="mt-6 rounded-full border px-6 py-3">Exit preview</button></form></main></body></html>}
  const navigation=contentRows(siteModule(snapshot,'/','navigation'))?.map(row=>({href:String(row.href),label:String(row.label)}))||navItems
  return (
    <html lang={locale} className={`${display.variable} ${body.variable}`}>
      <body data-site-settings-source={settings.source}>
        <LocaleProvider locale={locale} defaultLocale={settings.defaultLanguage}>
        <StructuredData data={{'@context':'https://schema.org','@graph':[{'@type':'Organization','@id':origin+'/#organization',name:settings.legalName,url:origin,logo:new URL(settings.logo,origin).href,email:settings.email,telephone:settings.phone,address:{'@type':'PostalAddress',streetAddress:settings.address,addressCountry:'CN'}},{'@type':'WebSite','@id':origin+'/#website',url:origin,name:settings.title,publisher:{'@id':origin+'/#organization'},inLanguage:settings.defaultLanguage}]}}/>
        <a
          href="#main"
          className="bg-primary text-primary-foreground sr-only z-[60] rounded-full px-5 py-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        {preview&&<aside className="bg-secondary border-input border-b px-4 py-3 text-center text-sm">Website preview <form className="inline" action="/api/site-content/exit-preview" method="post"><button className="ml-4 underline">Exit preview</button></form></aside>}
        <SiteHeader logoSrc={settings.logo} items={navigation} />
        <main id="main">{children}</main>
        <SiteFooter />
        </LocaleProvider>
      <script async src={`https://admin.globle-trade.com/api/public/analytics.js?tenantId=${encodeURIComponent(process.env.NEXT_PUBLIC_TENANT_ID || "df54bef0-b29d-46ab-92dd-f7858cc364af")}`} />
      </body>
    </html>
  )
}
