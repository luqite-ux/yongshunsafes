import {createSupabaseCaptchaContextFromEnv,issueCaptchaChallenge} from '@/lib/inquiry-captcha'
export const dynamic='force-dynamic'
export const runtime='nodejs'
export async function GET(request:Request){
 const scope=new URL(request.url).searchParams.get('scope')?.trim()||''
 const headers={'Cache-Control':'no-store,max-age=0'}
 if(!/^[A-Za-z0-9_-]{16,160}$/.test(scope))return Response.json({message:'Invalid code request.'},{status:400,headers})
 try{const context=createSupabaseCaptchaContextFromEnv();const {svg,token,expiresAt}=await issueCaptchaChallenge({...context,secret:process.env.CAPTCHA_SECRET||'',scope});return Response.json({svg,token,expiresAt},{headers})}
 catch{return Response.json({message:'Verification service is temporarily unavailable.'},{status:503,headers})}
}
