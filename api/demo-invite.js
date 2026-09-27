const AUTH_ORIGIN='https://agent-first-git-demo-multi-industry-v2-ericabrand419-2140.vercel.app';
const DEMO_PORTAL=AUTH_ORIGIN+'/portal.html';

function normalizeEmail(value){ return String(value||'').trim().toLowerCase(); }
function validEmail(value){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
function cors(res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  res.setHeader('Cache-Control','no-store');
}
async function auth(action,payload){
  const r=await fetch(AUTH_ORIGIN+'/api/auth',{
    method:'POST',
    headers:{'Content-Type':'application/json','Accept':'application/json'},
    body:JSON.stringify(Object.assign({action},payload||{}))
  });
  const data=await r.json().catch(()=>({}));
  return {ok:r.ok,data,status:r.status};
}
module.exports=async function handler(req,res){
  cors(res);
  if(req.method==='OPTIONS') return res.status(204).end();
  if(req.method!=='POST') return res.status(405).json({ok:false,error:'Method not allowed'});
  const body=req.body||{};
  const action=String(body.action||'issue').trim();
  const email=normalizeEmail(body.email);
  if(!validEmail(email)) return res.status(400).json({ok:false,error:'Enter a valid work email.'});

  if(action==='verify'){
    const result=await auth('verify-invite',{email,token:body.token});
    return res.status(result.ok?200:401).json({ok:!!(result.ok&&result.data&&result.data.ok)});
  }
  if(action!=='issue') return res.status(400).json({ok:false,error:'Unsupported action'});

  const approvalCode=String(body.approvalCode||'');
  if(!approvalCode) return res.status(403).json({ok:false,error:'Owner approval is required before private access can be issued.'});
  const result=await auth('invite',{email,approvalCode});
  if(!result.ok||!result.data||!result.data.token){
    return res.status(502).json({ok:false,error:'Could not create private access. Please try again.'});
  }
  const token=result.data.token;
  const q='?invite_email='+encodeURIComponent(email)+'&invite_token='+encodeURIComponent(token);
  const portalUrl=DEMO_PORTAL+q;
  const dealRoomUrl='https://myagentfirst.com/deal-room-access.html'+q;
  console.log(JSON.stringify({event:'demo_access_invited',emailDomain:(email.split('@')[1]||''),at:new Date().toISOString()}));
  return res.status(200).json({ok:true,portalUrl,dealRoomUrl,expiresInDays:Number(result.data.expiresInDays||7)});
};