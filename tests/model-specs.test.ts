import test from 'node:test'
import assert from 'node:assert/strict'
import {readEditableModels} from '../lib/model-specs'
const source=[{id:'a',name:'FDX-A/D-30T',lockTypes:['fingerprint' as const],dimensions:{heightMm:300,widthMm:400,depthMm:300},weightKg:30,accessories:'One shelf'}]
test('backend flat specification edits control displayed numbers and modes',()=>{const [m]=readEditableModels({'FDX-A/D-30T | Height (mm)':'350','FDX-A/D-30T | Width (mm)':'420','FDX-A/D-30T | Depth (mm)':'330','FDX-A/D-30T | Weight (kg)':'36','FDX-A/D-30T | Access':'electronic'},source,true);assert.deepEqual(m.dimensions,{heightMm:350,widthMm:420,depthMm:330});assert.equal(m.weightKg,36);assert.deepEqual(m.lockTypes,['electronic']);assert.equal(m.accessories,null)})
test('removed canonical values are not silently restored from an old source',()=>{const [m]=readEditableModels({},source,true);assert.equal(m.dimensions,null);assert.equal(m.weightKg,null);assert.deepEqual(m.lockTypes,[])})
test('adding a model through the standard specification editor creates an option',()=>{const rows=readEditableModels({'Custom-100 | Height (mm)':'1000','Custom-100 | Width (mm)':'500','Custom-100 | Depth (mm)':'450'},[],true);assert.equal(rows[0].name,'Custom-100');assert.equal(rows[0].dimensions?.heightMm,1000)})
