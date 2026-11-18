import { LinkButton } from '@/components/site/link-button'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="display-title mt-4 text-5xl">Page not found</h1>
      <p className="text-muted-foreground mt-4">The page you are looking for does not exist.</p>
      <div className="mt-8"><LinkButton href="/">Back to Home</LinkButton></div>
    </div>
  )
}
