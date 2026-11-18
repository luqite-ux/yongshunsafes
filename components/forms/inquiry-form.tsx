'use client'

import { useId, useState, type FormEvent } from 'react'
import { Loader2, CircleAlert, CircleCheck } from 'lucide-react'
import { CaptchaField } from '@/components/forms/secure-captcha-field'
import { productName, type Product } from '@/lib/products'
import { company } from '@/lib/site'
import { cn } from '@/lib/utils'

type Scope = 'contact' | 'product'
type Status = 'idle' | 'pending' | 'error' | 'success'

export interface InquiryPayload {
  scope: Scope
  name: string
  email: string
  company: string
  phone: string
  product: string
  model: string
  quantity: string
  message: string
  captchaScope: string
  captchaToken: string
  captchaAnswer: string
}

const fieldClass =
  'border-input focus-visible:border-ring min-h-12 w-full rounded-xl border bg-white px-4 text-base disabled:bg-secondary disabled:opacity-80'

function Field({
  label,
  error,
  required,
  children,
  htmlFor,
}: {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
  htmlFor: string
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold">
        {label}
        {required && <span aria-hidden className="text-gold-deep"> *</span>}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="text-destructive mt-2 text-sm font-medium">
          {error}
        </p>
      )}
    </div>
  )
}

export function InquiryForm({
  scope,
  productName: fixedProduct,
  modelName: fixedModel,
  className,
  products = [],
  minimumOrder = company.moq,
}: {
  scope: Scope
  productName?: string
  modelName?: string
  className?: string
  products?: Product[]
  minimumOrder?:number
}) {
  const uid = useId()
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverMessage, setServerMessage] = useState('')
  const [captchaRefresh,setCaptchaRefresh] = useState(0)
  const id = (n: string) => `${scope}-${uid}-${n}`

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    const next: Record<string, string> = {}
    if (!data.name?.trim()) next.name = 'Enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(data.email ?? '')) next.email = 'Enter a valid email address.'
    if (!data.message?.trim()) next.message = 'Tell us what you need.'
    if (data.quantity && !/^\d+$/.test(data.quantity.trim())) next.quantity = 'Use whole numbers only.'
    if (!/^[A-Za-z0-9]{4}$/.test(data.captchaAnswer ?? '')) next.captcha = 'Enter the 4 characters shown.'
    setErrors(next)
    if (Object.keys(next).length) {
      setStatus('idle')
      setServerMessage('')
      return
    }

    const payload: InquiryPayload = {
      scope,
      name: data.name.trim(),
      email: data.email.trim(),
      company: (data.company ?? '').trim(),
      phone: (data.phone ?? '').trim(),
      product: fixedProduct ?? (data.product ?? ''),
      model: fixedModel ?? (data.model ?? ''),
      quantity: (data.quantity ?? '').trim(),
      message: data.message.trim(),
      captchaScope: data.captchaScope,
      captchaToken: data.captchaToken,
      captchaAnswer: data.captchaAnswer,
    }

    setStatus('pending')
    setServerMessage('')
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { message?: string } | null
        throw new Error(body?.message ?? 'Your inquiry could not be sent.')
      }
      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setServerMessage(err instanceof Error ? err.message : 'Your inquiry could not be sent.')
    } finally {
      setCaptchaRefresh(n=>n+1)
    }
  }

  const pending = status === 'pending'

  return (
    <form onSubmit={onSubmit} noValidate className={cn('grid gap-5', className)} aria-busy={pending}>
      <fieldset disabled={pending} className="grid gap-5 sm:grid-cols-2">
        <legend className="sr-only">{scope === 'product' ? 'Product inquiry' : 'Contact inquiry'}</legend>
        <Field label="Name" required htmlFor={id('name')} error={errors.name}>
          <input id={id('name')} name="name" autoComplete="name" required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${id('name')}-error` : undefined} className={fieldClass} />
        </Field>
        <Field label="Email" required htmlFor={id('email')} error={errors.email}>
          <input id={id('email')} name="email" type="email" autoComplete="email" required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? `${id('email')}-error` : undefined} className={fieldClass} />
        </Field>
        <Field label="Company" htmlFor={id('company')}>
          <input id={id('company')} name="company" autoComplete="organization" className={fieldClass} />
        </Field>
        <Field label="Phone" htmlFor={id('phone')}>
          <input id={id('phone')} name="phone" type="tel" autoComplete="tel" className={fieldClass} />
        </Field>

        {scope === 'product' ? (
          <>
            <Field label="Product" htmlFor={id('product')}>
              <input id={id('product')} name="product" value={fixedProduct ?? ''} readOnly className={cn(fieldClass, 'bg-secondary')} />
            </Field>
            <Field label="Model" htmlFor={id('model')}>
              <input id={id('model')} name="model" value={fixedModel ?? ''} readOnly className={cn(fieldClass, 'bg-secondary')} />
            </Field>
          </>
        ) : (
          <>
            <Field label="Product of interest" htmlFor={id('product')}>
              <select id={id('product')} name="product" defaultValue="" className={fieldClass}>
                <option value="">Not sure yet</option>
                {products.map((p) => (
                  <option key={p.slug} value={productName(p)}>
                    {productName(p)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Model" htmlFor={id('model')}>
              <input id={id('model')} name="model" placeholder="e.g. A2" className={fieldClass} />
            </Field>
          </>
        )}

        <div className="sm:col-span-2">
          <Field label={`Quantity (minimum order ${minimumOrder} units)`} htmlFor={id('quantity')} error={errors.quantity}>
            <input id={id('quantity')} name="quantity" inputMode="numeric" aria-invalid={Boolean(errors.quantity)} aria-describedby={errors.quantity ? `${id('quantity')}-error` : undefined} className={fieldClass} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Message" required htmlFor={id('message')} error={errors.message}>
            <textarea
              id={id('message')}
              name="message"
              rows={5}
              required
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? `${id('message')}-error` : undefined}
              placeholder="Size, material, colour, process and any other requirements"
              className={cn(fieldClass, 'py-3')}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <CaptchaField scope={scope} idPrefix={id('c')} error={errors.captcha} refreshKey={captchaRefresh} />
        </div>
      </fieldset>

      <div aria-live="polite">
        {status === 'error' && (
          <p role="alert" className="text-destructive bg-destructive/5 flex items-start gap-2 rounded-xl p-4 text-sm font-medium">
            <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
            <span>
              {serverMessage} You can also email{' '}
              <a href={company.emailHref} className="underline">
                {company.email}
              </a>
              .
            </span>
          </p>
        )}
        {status === 'success' && (
          <p className="flex items-start gap-2 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-900">
            <CircleCheck aria-hidden className="mt-0.5 size-4 shrink-0" />
            Thank you. Your inquiry has been received.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-primary text-primary-foreground hover:bg-blue-deep inline-flex min-h-12 items-center justify-center gap-2 justify-self-start rounded-full px-8 text-sm font-semibold disabled:opacity-70"
      >
        {pending && <Loader2 aria-hidden className="size-4 animate-spin" />}
        {pending ? 'Sending…' : 'Send inquiry'}
      </button>
    </form>
  )
}
