const AUTH_ORIGIN='https://agent-first-gamma.vercel.app';
function readCookie(req,name){const raw=req.headers.cookie||'';const p=raw.split(';').map(v=>v.trim()).find(v=>v.startsWith(name+'='));return p?decodeURIComponent(p.slice(name.length+1)):'';}
module.exports=async function handler(req,res){
  const token=readCookie(req,'af_private_access');
  try{
    if(token) await fetch(AUTH_ORIGIN+'/api/auth',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({action:'logout'})});
  }catch(e){}
  res.setHeader('Set-Cookie','af_private_access=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
  res.setHeader('Cache-Control','no-store');
  return res.status(200).json({ok:true});
};
