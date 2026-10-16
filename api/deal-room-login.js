const AUTH_ORIGIN='https://agent-first-gamma.vercel.app';
function sharedHost(req){
  const host=String(req.headers['x-forwarded-host']||req.headers.host||'').toLowerCase().split(',')[0].trim().split(':')[0];
  return /(^|\.)myagentfirst\.com$/.test(host);
}
// One sign-in for myagentfirst.com, www.myagentfirst.com and demo.myagentfirst.com.
function cookies(req,token,owner){
  const age=owner?60*60*24*30:60*60*12;
  const base='af_private_access='+encodeURIComponent(token)+'; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age='+age;
  if(!sharedHost(req)) return [base];
  return ['af_private_access=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0', base+'; Domain=myagentfirst.com'];
}
module.exports=async function handler(req,res){
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({ok:false,error:'Method not allowed'});}
  const body=req.body||{};
  const action=String(body.action||'email-login');
  if(!['email-login','owner-login','activate-email','login','register'].includes(action)) return res.status(400).json({ok:false,error:'Unsupported action'});
  const upstream=await fetch(AUTH_ORIGIN+'/api/auth',{
    method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
    body:JSON.stringify({
      action,
      email:body.email,
      password:body.password,
      inviteToken:body.inviteToken,
      approvalCode:body.approvalCode
    })
  });
  const data=await upstream.json().catch(()=>({}));
  if(!upstream.ok||!data.token) return res.status(upstream.status||401).json({ok:false,error:data.error||'Could not verify access.'});
  res.setHeader('Set-Cookie',cookies(req,data.token,Array.isArray(data.roles)&&data.roles.indexOf('owner')>-1));
  res.setHeader('Cache-Control','no-store');
  return res.status(200).json({ok:true,roles:data.roles||[],permissions:data.permissions||[]});
};