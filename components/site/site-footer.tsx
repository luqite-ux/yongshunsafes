import Image from 'next/image'
import Link from '@/components/site/site-link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { company, fullAddress, navItems } from '@/lib/site'
import { getCatalogue } from '@/lib/catalogue-db'
import { getSiteSettings } from '@/lib/settings-db'
import {getSiteView,siteModule} from '@/lib/site-content/view'
import {contentRows} from '@/lib/site-content/values'
import { BackToTop } from '@/components/site/back-to-top'
import { CopyrightYear } from '@/components/site/copyright-year'

export async function SiteFooter() {
  const {categories} = await getCatalogue()
  const settings = await getSiteSettings()
  const snapshot=await getSiteView(),items=contentRows(siteModule(snapshot,'/','navigation'))?.map(row=>({href:String(row.href),label:String(row.label)}))||navItems
  return (
    <footer className="bg-sky border-t">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:px-8">
        <div>
          <Link href="/" aria-label="YONGSHUN, Home" className="inline-block">
            <Image
              src={settings.logo}
              alt="YONGSHUN safe manufacturer logo"
              width={1876}
              height={1279}
              className="h-28 w-auto mix-blend-multiply"
            />
          </Link>
          <p className="text-muted-foreground mt-4 max-w-xs text-sm leading-relaxed">
            Manufacturer of mechanical, electronic and fingerprint safes and storage boxes under the{' '}
            {company.brands.join(' and ')} brands.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="eyebrow">Explore</h2>
          <ul className="mt-4 space-y-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-gold-deep inline-flex min-h-11 items-center text-sm font-medium">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Product series">
          <h2 className="eyebrow">Series</h2>
          <ul className="mt-4 space-y-1">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/products?category=${c.slug}`}
                  className="hover:text-gold-deep inline-flex min-h-11 items-center text-sm font-medium"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow">Contact</h2>
          <ul className="mt-4 space-y-4 text-sm">
            <li className="flex gap-3">
              <Mail aria-hidden className="text-gold-deep mt-0.5 size-4 shrink-0" />
              <a href={'mailto:'+settings.email} className="hover:text-gold-deep break-all font-medium">
                {settings.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone aria-hidden className="text-gold-deep mt-0.5 size-4 shrink-0" />
              <a href={'tel:'+settings.phone.replace(/[^+\d]/g,'')} className="hover:text-gold-deep font-medium">
                {settings.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin aria-hidden className="text-gold-deep mt-0.5 size-4 shrink-0" />
              <address className="text-muted-foreground not-italic leading-relaxed">{settings.address}</address>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-black/5">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-6 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <p className="text-muted-foreground text-sm">
            <CopyrightYear /> {settings.legalName.replace(/[.。;；:：!！?？\s]+$/u, '')}. All rights reserved.
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  )
}
