import {CircleDot} from 'lucide-react'
import {contentRows,type ModuleContent} from '@/lib/site-content/values'
import type {ProcessStep} from '@/lib/manufacturing'
export function editableSteps(content:ModuleContent,fallback:ProcessStep[]):ProcessStep[]{return contentRows(content)?.map(row=>({id:String(row.id),label:String(row.title||''),text:String(row.body||''),icon:fallback.find(s=>s.id===row.id)?.icon||CircleDot}))||fallback}
