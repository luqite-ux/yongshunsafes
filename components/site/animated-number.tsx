'use client'

import {useEffect,useRef,useState} from 'react'

export function AnimatedNumber({value,prefix=''}:{value:number;prefix?:string}){
  const ref=useRef<HTMLSpanElement>(null)
  const [display,setDisplay]=useState(value)
  useEffect(()=>{
    const element=ref.current
    if(!element||typeof IntersectionObserver==='undefined'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return
    let frame=0
    let started=false
    const observer=new IntersectionObserver(([entry])=>{
      if(!entry.isIntersecting||started)return
      started=true
      observer.disconnect()
      const start=performance.now()
      const tick=(now:number)=>{
        const progress=Math.min((now-start)/1100,1)
        setDisplay(Math.round(value*(1-Math.pow(1-progress,3))))
        if(progress<1)frame=requestAnimationFrame(tick)
      }
      setDisplay(0)
      frame=requestAnimationFrame(tick)
    },{threshold:0.5})
    observer.observe(element)
    return()=>{observer.disconnect();cancelAnimationFrame(frame)}
  },[value])
  return <span ref={ref}><span className="sr-only">{prefix}{value.toLocaleString('en-US')}</span><span aria-hidden="true">{prefix}{display.toLocaleString('en-US')}</span></span>
}
