import {verifyCaptchaSubmission,type CaptchaChallengeStore} from './inquiry-captcha'
type Dependencies={secret:string;tenantId:string;siteScope:string;store:CaptchaChallengeStore;save:(row:Record<string,string>)=>Promise<string>;notify:(id:string)=>Promise<void>}
export function inquiryHandler(deps:Dependencies){return async(request:Request)=>{
 const headers={'Cache-Control':'no-store,max-age=0'}
 const fail=(message:string,status=400)=>Response.json({message,refreshCaptcha:true},{status,headers})
 let data:Record<string,unknown>;try{const raw=await request.text();if(raw.length>32000)return fail('Your message is too long.',413);data=JSON.parse(raw);if(!data||typeof data!=='object'||Array.isArray(data))return fail('Invalid inquiry.')}catch{return fail('Invalid inquiry.')}
 const text=(key:string,max=4000)=>typeof data[key]==='string'?(data[key] as string).trim().slice(0,max):''
 try{
  const captcha=await verifyCaptchaSubmission({secret:deps.secret,tenantId:deps.tenantId,siteScope:deps.siteScope,store:deps.store,scope:text('captchaScope',160),token:text('captchaToken',4000),answer:text('captchaAnswer',32)})
  if(!captcha.ok)return fail('The verification code is incorrect or expired. Refresh it and try again.')
  const origin=request.headers.get('origin');if(origin&&new URL(origin).origin!==new URL(request.url).origin)return fail('Invalid request origin.',403)
  const name=text('name',150),email=text('email',254),message=text('message',10000),quantity=text('quantity',12)
  if(!name||!/^\S+@\S+\.\S+$/.test(email)||!message||(quantity&&!/^\d+$/.test(quantity)))return fail('Check your name, email, quantity and message.')
  const details=[text('product',250)&&'Product: '+text('product',250),text('model',150)&&'Model: '+text('model',150),quantity&&'Quantity: '+quantity].filter(Boolean).join('\n')
  const id=await deps.save({tenant_id:deps.tenantId,name,email,phone:text('phone',80),company:text('company',250),message:[details,message].filter(Boolean).join('\n\n'),status:'unread'})
  await deps.notify(id).catch(()=>undefined)
  return Response.json({ok:true,message:'Thank you. Your inquiry has been received.'},{headers})
 }catch{return fail('Your inquiry could not be saved. Please try again.',503)}
}}
