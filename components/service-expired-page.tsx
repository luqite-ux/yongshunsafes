export function ServiceExpiredPage({ locale = 'en' }: { locale?: string }) {
  const zh = locale.toLowerCase().startsWith('zh')
  return <div className="min-h-[70vh] bg-background px-6 text-foreground flex items-center justify-center">
    <section className="border-border w-full max-w-xl rounded-2xl border bg-white p-8 text-center">
      <p className="text-gold-deep text-sm uppercase tracking-[0.25em]">Service Notice</p>
      <h1 className="mt-4 text-3xl font-semibold">{zh ? '您的网站服务已到期' : 'Website Service Has Expired'}</h1>
      <p className="text-muted-foreground mt-4">{zh ? '如需恢复访问，请联系客服人员办理续费。' : 'Please contact your service representative to renew and restore access.'}</p>
      <a className="border-input hover:bg-secondary mt-8 inline-flex rounded-lg border px-5 py-2.5 text-sm" href="/admin/login">{zh ? '管理员登录' : 'Administrator Login'}</a>
    </section>
  </div>
}
