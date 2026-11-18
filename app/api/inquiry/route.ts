import {createClient} from '@supabase/supabase-js'
import {createSupabaseCaptchaContextFromEnv} from '@/lib/inquiry-captcha'
import {inquiryHandler} from '@/lib/inquiry-handler'
export const runtime='nodejs'
export async function POST(request:Request){
 try{
 const context=createSupabaseCaptchaContextFromEnv()
 const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{persistSession:false}})
 return inquiryHandler({...context,secret:process.env.CAPTCHA_SECRET||'',save:async row=>{const {data,error}=await db.from('inquiries').insert(row).select('id').single();if(error||!data?.id)throw Error('Inquiry save failed');return data.id},notify:async id=>{const base=process.env.NEXT_PUBLIC_ADMIN_URL,secret=process.env.INQUIRY_NOTIFY_SECRET;if(!base||!secret)return;await fetch(`${base.replace(/\/$/,'')}/api/inquiries/notify`,{method:'POST',headers:{'content-type':'application/json','x-inquiry-notify-secret':secret},body:JSON.stringify({tenantId:context.tenantId,inquiryId:id}),signal:AbortSignal.timeout(8000),cache:'no-store'})}})(request)
 }catch{return Response.json({message:'The inquiry service is temporarily unavailable.',refreshCaptcha:true},{status:503})}
}
