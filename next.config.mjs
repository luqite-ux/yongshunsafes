const adminUrl=process.env.NEXT_PUBLIC_ADMIN_URL?.trim().replace(/[\r\n]/g,'').replace(/\/$/,'')
const nextConfig={
 images:{remotePatterns:[{protocol:'https',hostname:'*.r2.dev'}]},
 async rewrites(){return adminUrl?{afterFiles:[{source:'/admin',destination:`${adminUrl}/admin`},{source:'/admin/:path*',destination:`${adminUrl}/admin/:path*`},{source:'/api/admin/:path*',destination:`${adminUrl}/api/admin/:path*`}]}:[]},
}
export default nextConfig
