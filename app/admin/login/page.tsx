import type {Metadata} from 'next'
export const metadata:Metadata={title:'Administrator Login',robots:{index:false,follow:false}}
export default async function Login({searchParams}:{searchParams:Promise<{error?:string}>}){
 const {error}=await searchParams
 return <section className="mx-auto max-w-md px-4 py-20"><h1 className="display-title text-3xl">Administrator Login</h1><form action="/api/auth/login" method="post" className="mt-8 grid gap-5">
 <label className="grid gap-2 font-medium">Email<input name="email" type="email" autoComplete="username" required className="border-input min-h-12 rounded-xl border bg-white px-4"/></label>
 <label className="grid gap-2 font-medium">Password<input name="password" type="password" autoComplete="current-password" required className="border-input min-h-12 rounded-xl border bg-white px-4"/></label>
 {error&&<p role="alert" className="text-destructive">{error==='unavailable'?'Login is temporarily unavailable. Please try again.':'The email or password is incorrect.'}</p>}
 <button className="bg-primary text-primary-foreground min-h-12 rounded-full px-6 font-semibold" type="submit">Sign in</button></form></section>
}
