export const company = {
  legalName: 'Zhejiang Wuyi Yongshun Safe Cabinet Co., Ltd.',
  brandName: 'YONGSHUN',
  brands: ['Yongshun', 'Manadun'],
  domain: 'yongshunsafes.com',
  url: 'https://yongshunsafes.com',
  phone: '+86 13575690938',
  phoneHref: 'tel:+8613575690938',
  email: 'info@yongshunsafes.com',
  emailHref: 'mailto:info@yongshunsafes.com',
  registeredOn: '2012-08-23',
  registeredLabel: '23 August 2012',
  address: {
    street: 'Jinsan Road 16, Jinyanshan Industrial Area',
    town: 'Quanxi Town, Wuyi County',
    region: 'Zhejiang, China',
  },
  areaSqm: 10000,
  productionLines: 3,
  monthlyCapacity: 3000,
  moq: 20,
  leadTimeDays: 30,
} as const

export const fullAddress = `${company.address.street}, ${company.address.town}, ${company.address.region}`

export const navItems = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/manufacturing', label: 'Manufacturing' },
  { href: '/cases', label: 'Cases' },
  { href: '/about', label: 'About' },
  { href: '/news', label: 'News' },
  { href: '/contact', label: 'Contact' },
] as const

export const businessScope = [
  'Mechanical safes',
  'Electronic safes',
  'Fingerprint safes',
  'Storage boxes',
  'Design and R&D',
  'Custom production',
] as const
