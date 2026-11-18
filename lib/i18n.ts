export const locales = ['en'] as const
export type Locale = string
export const defaultLocale: Locale = 'en'

/** Every localizable value must carry the default locale; other locales are optional and fall back to it. */
export type Localized<T = string> = { en: T } & Partial<Record<string, T>>

export function t<T>(value: Localized<T>, locale: Locale = defaultLocale): T {
  const candidates=[value[locale],value[defaultLocale],...Object.values(value)]
  return (candidates.find(v => v !== null && v !== undefined && (typeof v!=='string'||v.trim()!=='') && (!Array.isArray(v)||v.length>0)) ?? candidates.find(v=>v!==null&&v!==undefined)) as T
}

export function en<T = string>(value: T): Localized<T> {
  return { en: value }
}
