const AUTH_ORIGIN='https://agent-first-git-demo-multi-industry-v2-ericabrand419-2140.vercel.app';
function cookie(token){
  return 'af_private_access='+encodeURIComponent(token)+'; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age='+(60*60*12);
}
module.exports=async function handler(req,res){
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({ok:false,error:'Method not allowed'});}
  const body=req.body||{};
  const action=String(body.action||'login');
  if(!['login','register'].includes(action)) return res.status(400).json({ok:false,error:'Unsupported action'});
  const upstream=await fetch(AUTH_ORIGIN+'/api/auth',{
    method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
    body:JSON.stringify({
      action,
      email:body.email,
      password:body.password,
      inviteToken:body.inviteToken
    })
  });
  const data=await upstream.json().catch(()=>({}));
  if(!upstream.ok||!data.token) return res.status(upstream.status||401).json({ok:false,error:data.error||'Could not verify access.'});
  res.setHeader('Set-Cookie',cookie(data.token));
  res.setHeader('Cache-Control','no-store');
  return res.status(200).json({ok:true,roles:data.roles||[],permissions:data.permissions||[]});
};