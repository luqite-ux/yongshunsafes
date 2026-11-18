import type {SiteModuleProps} from './render-page'
export type ModuleContent=SiteModuleProps|undefined
export function contentText(content:ModuleContent,key:string,fallback:string){const value=content?.values[key];return typeof value==='string'?value:fallback}
export function contentImage(content:ModuleContent,key:string,fallback:{src:string;alt:string}){const image=content?.values[key] as {url?:unknown;alt?:unknown}|undefined;return image&&typeof image.url==='string'?{src:image.url,alt:typeof image.alt==='string'?image.alt:fallback.alt}:fallback}
export function contentRows(content:ModuleContent,key='items'):Record<string,any>[]|undefined{const rows=content?.values[key];return Array.isArray(rows)?rows:undefined}
