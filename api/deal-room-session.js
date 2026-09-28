const AUTH_ORIGIN='https://agent-first-gamma.vercel.app';
function readCookie(req,name){
  const raw=req.headers.cookie||'';
  const pair=raw.split(';').map(v=>v.trim()).find(v=>v.startsWith(name+'='));
  return pair?decodeURIComponent(pair.slice(name.length+1)):'';
}
module.exports=async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  const token=readCookie(req,'af_private_access');
  if(!token) return res.status(200).json({authEnabled:true,authenticated:false});
  try{
    const upstream=await fetch(AUTH_ORIGIN+'/api/auth',{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json','Authorization':'Bearer '+token},
      body:JSON.stringify({action:'session'})
    });
    const data=await upstream.json().catch(()=>({}));
    if(!upstream.ok||!data.authenticated) return res.status(200).json({authEnabled:true,authenticated:false});
    return res.status(200).json({
      authEnabled:true,authenticated:true,
      email:data.email,roles:data.roles||[],permissions:data.permissions||[]
    });
  }catch(e){
    return res.status(200).json({authEnabled:true,authenticated:false});
  }
};