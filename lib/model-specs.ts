import type {ProductModel} from './products'
const fields=['Height (mm)','Width (mm)','Depth (mm)','Weight (kg)','Access','Configuration'] as const
export function readEditableModels(specs:Record<string,unknown>,source:ProductModel[],canonical=false):ProductModel[]{
 const names=[...source.map(m=>m.name),...Object.keys(specs).flatMap(key=>{const split=key.lastIndexOf(' | ');return split>=0&&fields.includes(key.slice(split+3) as typeof fields[number])?[key.slice(0,split)]:[]})]
 return [...new Set(names)].map((name,index)=>{
  const previous=source.find(m=>m.name===name),read=(field:string)=>specs[name+' | '+field]
  const number=(field:string)=>{const raw=read(field);if(raw===null||raw===undefined||raw==='')return null;const n=Number(raw);return Number.isFinite(n)&&n>0?n:null}
  if(!canonical&&!fields.some(field=>read(field)!==undefined)&&previous)return previous
  const h=number('Height (mm)'),w=number('Width (mm)'),d=number('Depth (mm)'),access=String(read('Access')||'').split(',').map(x=>x.trim()).filter((x):x is ProductModel['lockTypes'][number]=>['mechanical','electronic','fingerprint','face'].includes(x))
  return {id:previous?.id||'model-'+index,name,dimensions:h&&w&&d?{heightMm:h,widthMm:w,depthMm:d}:null,weightKg:number('Weight (kg)'),lockTypes:access,accessories:typeof read('Configuration')==='string'?String(read('Configuration')):null}
 })
}
