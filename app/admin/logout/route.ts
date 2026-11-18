import {NextResponse,type NextRequest} from 'next/server'
import {createClient} from '@supabase/supabase-js'
export async function GET(request:NextRequest){
 const token=request.cookies.get('hq_admin_session')?.value
 if(token&&process.env.SUPABASE_SERVICE_ROLE_KEY){const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});const tenantId=process.env.NEXT_PUBLIC_TENANT_ID;const userIds=await db.from('admin_users').select('id').eq('tenant_id',tenantId);if(userIds.data?.length)await db.from('admin_user_sessions').delete().eq('token',token).in('admin_user_id',userIds.data.map(u=>u.id))}
 const response=NextResponse.redirect(new URL('/admin/login',request.url),303);response.cookies.delete('hq_admin_session');response.cookies.delete('hq_tenant_id');return response
}
