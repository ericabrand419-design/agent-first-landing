const AUTH_ORIGIN='https://agent-first-gamma.vercel.app';
function readCookies(req,name){
  const raw=req.headers.cookie||'';
  return raw.split(';').map(v=>v.trim()).filter(v=>v.startsWith(name+'=')).map(v=>decodeURIComponent(v.slice(name.length+1))).filter(Boolean);
}
module.exports=async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  const tokens=readCookies(req,'af_private_access');
  if(!tokens.length) return res.status(200).json({authEnabled:true,authenticated:false});
  for(const token of tokens){
    try{
      const upstream=await fetch(AUTH_ORIGIN+'/api/auth',{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json','Authorization':'Bearer '+token},
        body:JSON.stringify({action:'session'})
      });
      const data=await upstream.json().catch(()=>({}));
      if(upstream.ok&&data.authenticated) return res.status(200).json({
        authEnabled:true,authenticated:true,
        email:data.email,roles:data.roles||[],permissions:data.permissions||[]
      });
    }catch(e){}
  }
  return res.status(200).json({authEnabled:true,authenticated:false});
};