const crypto=require('crypto');

const AUTH_ORIGIN='https://agent-first-git-demo-multi-industry-v2-ericabrand419-2140.vercel.app';
const DEMO_PORTAL=AUTH_ORIGIN+'/portal.html';
const APPROVAL_HASH='cbfbba0735652a15f8fad17151bc34bd1fc66d06e74448527a0c4de19aed6d8a';

function normalizeEmail(value){ return String(value||'').trim().toLowerCase(); }
function validEmail(value){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
function cors(res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  res.setHeader('Cache-Control','no-store');
}
function approvalValid(value){
  const actual=crypto.createHash('sha256').update(String(value||'')).digest('hex');
  const a=Buffer.from(actual);
  const b=Buffer.from(APPROVAL_HASH);
  return a.length===b.length && crypto.timingSafeEqual(a,b);
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
  const action=String(body.action||'').trim();
  const email=normalizeEmail(body.email);
  if(!validEmail(email)) return res.status(400).json({ok:false,error:'Enter a valid work email.'});

  if(action==='verify'){
    const result=await auth('verify-invite',{email,token:body.token});
    return res.status(result.ok?200:401).json({ok:!!(result.ok&&result.data&&result.data.ok)});
  }

  if(action!=='issue') return res.status(400).json({ok:false,error:'Unsupported action'});
  if(!approvalValid(body.approvalCode)){
    console.warn(JSON.stringify({event:'demo_approval_denied',emailDomain:(email.split('@')[1]||''),at:new Date().toISOString()}));
    return res.status(403).json({ok:false,error:'Approval code is incorrect.'});
  }

  const result=await auth('invite',{email});
  if(!result.ok || !result.data || !result.data.token){
    return res.status(502).json({ok:false,error:'Could not create demo access. Please try again.'});
  }

  const token=result.data.token;
  const q='?invite_email='+encodeURIComponent(email)+'&invite_token='+encodeURIComponent(token);
  const portalUrl=DEMO_PORTAL+q;
  console.log(JSON.stringify({event:'demo_access_approved',emailDomain:(email.split('@')[1]||''),at:new Date().toISOString()}));
  return res.status(200).json({ok:true,portalUrl,expiresInDays:Number(result.data.expiresInDays||7)});
};