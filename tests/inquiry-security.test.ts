import test from 'node:test'
import assert from 'node:assert/strict'
import {randomBytes} from 'node:crypto'
import {issueCaptchaChallenge,type CaptchaChallengeIssueRecord} from '../lib/inquiry-captcha'
import {inquiryHandler} from '../lib/inquiry-handler'
Reflect.set(process.env,'NODE_ENV','test')
function fixture(){
 const rows=new Map<string,CaptchaChallengeIssueRecord>(),saved:unknown[]=[],notified:string[]=[]
 const store={issue(r:CaptchaChallengeIssueRecord){rows.set(r.tenantId+r.siteScopeHash+r.formScopeHash,r)},consume(r:any){const key=r.tenantId+r.siteScopeHash+r.formScopeHash,current=rows.get(key);if(!current||current.challengeHash!==r.challengeHash)return false;rows.delete(key);return current.tokenHash===r.tokenHash&&current.expiresAt>Date.now()}}
 const context={store,secret:randomBytes(32).toString('hex'),tenantId:'df54bef0-b29d-46ab-92dd-f7858cc364af',siteScope:'isolated-security-fixture'}
 const handler=inquiryHandler({...context,save:async row=>{saved.push(row);return 'fixture-inquiry'},notify:async id=>{notified.push(id)}})
 const scope='captcha_'+randomBytes(16).toString('hex')
 const issue=(extra={})=>issueCaptchaChallenge({...context,scope,...extra})
 const submit=(c:any,extra={})=>handler(new Request('https://example.test/api/inquiry',{method:'POST',headers:{origin:'https://example.test'},body:JSON.stringify({name:'Fixture buyer',email:'fixture@example.test',message:'A fixture request',captchaScope:scope,captchaToken:c?.token||'',captchaAnswer:c?.testAnswer||'',...extra})}))
 return {rows,saved,notified,context,handler,scope,issue,submit}
}
test('wrong answer consumes challenge and cannot later write or notify',async()=>{const f=fixture(),c=await f.issue();assert.equal((await f.submit(c,{captchaAnswer:'0000'})).status,400);assert.equal((await f.submit(c)).status,400);assert.equal(f.saved.length,0);assert.equal(f.notified.length,0)})
test('valid concurrent requests permit one write and one notification',async()=>{const f=fixture(),c=await f.issue();const r=await Promise.all([f.submit(c),f.submit(c)]);assert.deepEqual(r.map(x=>x.status).sort(),[200,400]);assert.equal(f.saved.length,1);assert.equal(f.notified.length,1);assert.equal((await f.submit(c)).status,400)})
test('refresh invalidates old token while another form remains usable',async()=>{const f=fixture(),a=await f.issue(),otherScope='captcha_'+randomBytes(16).toString('hex'),other=await f.issue({scope:otherScope}),b=await f.issue();assert.equal((await f.submit(a)).status,400);assert.equal((await f.submit(other,{captchaScope:otherScope})).status,200);assert.equal((await f.submit(b)).status,200)})
test('expired, tampered and missing challenges fail without writes',async()=>{const f=fixture(),expired=await f.issue({now:Date.now()-360000});assert.equal((await f.submit(expired)).status,400);const c=await f.issue();assert.equal((await f.submit(c,{captchaToken:c.token+'tampered'})).status,400);assert.equal((await f.submit(null)).status,400);assert.equal(f.saved.length,0);assert.equal(f.notified.length,0)})
test('validation failure after CAPTCHA consumes token, preserving zero writes',async()=>{const f=fixture(),c=await f.issue();assert.equal((await f.submit(c,{email:'bad'})).status,400);assert.equal((await f.submit(c)).status,400);assert.equal(f.saved.length,0)})
test('production challenge SVG/token exposes no plain answer or text glyph',async()=>{const f=fixture();Reflect.set(process.env,'NODE_ENV','production');try{const c=await f.issue();assert.equal(c.testAnswer,undefined);assert.doesNotMatch(c.svg,/<text\b/);assert.equal(c.svg.match(/aria-label="([^"]*)"/)?.[1],'Verification code image')}finally{Reflect.set(process.env,'NODE_ENV','test')}})
