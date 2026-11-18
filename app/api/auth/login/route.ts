import {NextResponse,type NextRequest} from 'next/server'
import {createClient} from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import {randomUUID} from 'node:crypto'
export const runtime='nodejs'
export async function POST(request:NextRequest){
 const fail=(reason:string)=>NextResponse.redirect(new URL('/admin/login?error='+reason,request.url),303)
 try{
 const origin=request.headers.get('origin');if(origin&&new URL(origin).origin!==new URL(request.url).origin)return fail('invalid')
 const fields=await request.formData(),email=String(fields.get('email')||'').trim().toLowerCase(),password=String(fields.get('password')||'')
 if(!email||!password||password.length>500)return fail('invalid')
 const tenantId=process.env.NEXT_PUBLIC_TENANT_ID;if(!tenantId)return fail('unavailable')
 const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{persistSession:false}})
 const {data:user,error}=await db.from('admin_users').select('id,tenant_id,password_hash,is_active').eq('email',email).eq('tenant_id',tenantId).maybeSingle()
 if(error)return fail('unavailable');if(!user?.is_active||!await bcrypt.compare(password,user.password_hash))return fail('invalid')
 const token=randomUUID(),expires=new Date(Date.now()+7*86400000)
 const saved=await db.from('admin_user_sessions').insert({admin_user_id:user.id,token,expires_at:expires.toISOString(),user_agent:request.headers.get('user-agent')?.slice(0,500)||null})
 if(saved.error)return fail('unavailable')
 const response=NextResponse.redirect(new URL('/admin',request.url),303),options={httpOnly:true,secure:new URL(request.url).protocol==='https:',sameSite:'lax' as const,path:'/',expires}
 response.cookies.set('hq_admin_session',token,options);response.cookies.set('hq_tenant_id',tenantId,options);response.headers.set('Cache-Control','no-store');return response
 }catch{return fail('unavailable')}
}
