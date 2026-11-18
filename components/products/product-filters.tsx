import Link from '@/components/site/site-link'
import { lockLabels, sizeLabels, type ProductFilter, type Category } from '@/lib/products'
import { cn } from '@/lib/utils'

function href(current: ProductFilter, key: keyof ProductFilter, value?: string) {
  const params = new URLSearchParams()
  const next = { ...current, [key]: value }
  for (const [k, v] of Object.entries(next)) if (v) params.set(k, v)
  const qs = params.toString()
  return qs ? `/products?${qs}` : '/products'
}

function Group({
  title,
  param,
  current,
  options,
}: {
  title: string
  param: keyof ProductFilter
  current: ProductFilter
  options: { value: string; label: string }[]
}) {
  const selected = current[param]
  return (
    <div>
      <h2 className="text-sm font-semibold">{title}</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {[{ value: '', label: 'All' }, ...options].map((o) => {
          const on = (selected ?? '') === o.value
          return (
            <li key={o.value || 'all'}>
              <Link
                href={href(current, param, o.value || undefined)}
                aria-current={on ? 'true' : undefined}
                className={cn(
                  'inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-semibold transition-colors',
                  on ? 'bg-primary text-primary-foreground border-primary' : 'bg-white hover:border-gold',
                )}
              >
                {o.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function ProductFilters({ current,categories }: { current: ProductFilter; categories:Category[] }) {
  return (
    <div className="grid gap-8 md:grid-cols-3" role="group" aria-label="Filter products">
      <Group title="Series" param="category" current={current} options={categories.map((c) => ({ value: c.slug, label: c.name }))} />
      <Group title="Access" param="lock" current={current} options={Object.entries(lockLabels).map(([value, label]) => ({ value, label }))} />
      <Group title="Size" param="size" current={current} options={Object.entries(sizeLabels).map(([value, label]) => ({ value, label }))} />
    </div>
  )
}
