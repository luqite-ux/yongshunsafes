'use client'
import {useCallback,useEffect,useState} from 'react'
import {RefreshCw} from 'lucide-react'
import {createInquiryCaptchaScope,createLatestCaptchaRequestController} from '@/lib/inquiry-captcha-scope'
type Challenge={svg:string;token:string;expiresAt:number}
export function CaptchaField({idPrefix,error,refreshKey=0}:{scope:string;idPrefix:string;error?:string;refreshKey?:number}){
 const [scope,setScope]=useState(''),[requests]=useState(createLatestCaptchaRequestController),[challenge,setChallenge]=useState<Challenge|null>(null),[loading,setLoading]=useState(true),[failed,setFailed]=useState(false)
 useEffect(()=>setScope(createInquiryCaptchaScope()),[])
 const refresh=useCallback(async()=>{if(!scope)return;const request=requests.begin();setLoading(true);setFailed(false);setChallenge(null);try{const response=await fetch(`/api/captcha?scope=${encodeURIComponent(scope)}`,{cache:'no-store',signal:request.signal});if(!response.ok)throw Error('Unavailable');const body=await response.json();if(!body.svg||!body.token)throw Error('Invalid challenge');if(requests.isCurrent(request))setChallenge(body)}catch{if(requests.isCurrent(request))setFailed(true)}finally{if(requests.isCurrent(request))setLoading(false)}},[scope,requests])
 useEffect(()=>{void refresh();return()=>requests.abortCurrent()},[refresh,refreshKey,requests])
 const inputId=idPrefix+'-captcha'
 return <div><label htmlFor={inputId} className="mb-2 block text-sm font-semibold">Verification code</label><div className="flex flex-wrap items-center gap-3">
 <div className="border-input flex h-14 w-40 items-center justify-center overflow-hidden rounded-xl border bg-white">{challenge?<img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(challenge.svg)}`} alt="Four-character verification code" width={160} height={56} className="h-14 w-40 object-contain"/>:<span className="text-muted-foreground px-2 text-center text-xs">{loading?'Loading code…':'Code image unavailable'}</span>}</div>
 <button type="button" onClick={()=>void refresh()} disabled={loading} className="border-input hover:bg-secondary inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold"><RefreshCw aria-hidden className="size-4"/>Refresh code</button>
 <input type="hidden" name="captchaScope" value={scope}/><input type="hidden" name="captchaToken" value={challenge?.token||''}/>
 <input key={challenge?.token||refreshKey} id={inputId} name="captchaAnswer" type="text" autoComplete="off" autoCapitalize="characters" spellCheck={false} maxLength={4} minLength={4} required disabled={!challenge} aria-invalid={!!error} aria-describedby={error?inputId+'-error':undefined} placeholder="4 chars" className="border-input focus-visible:border-ring min-h-12 w-36 rounded-xl border bg-white px-4 text-base tracking-[0.3em] uppercase"/>
 </div>{(error||failed)&&<p id={inputId+'-error'} className="text-destructive mt-2 text-sm font-medium">{error||'The code could not load. Refresh it to try again.'}</p>}</div>
}
