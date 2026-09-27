const crypto = require('crypto');

const DEMO_SECRET = process.env.DEMO_INVITE_SECRET || 'pJZHOYgbseAS8ofPk2ijrCv2xHtwGbIsFbOV5QkjiJ6damMjNGmL-0xpudAfdMh3';
const DEMO_PORTAL = 'https://agent-first-git-demo-multi-industry-v2-ericabrand419-2140.vercel.app/portal.html';
const WEB3FORMS_KEY = '7207f464-b77a-4a0c-b6b7-3a747ab11496';

function normalizeEmail(value){
  return String(value || '').trim().toLowerCase();
}
function validEmail(value){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function signInvite(email){
  const payload = {
    type:'agent-first-demo-invite',
    email,
    exp:Date.now() + (7 * 24 * 60 * 60 * 1000)
  };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', DEMO_SECRET).update(body).digest('base64url');
  return body + '.' + sig;
}
function verifyInvite(token,email){
  try{
    const parts=String(token||'').split('.');
    if(parts.length!==2)return false;
    const expected=crypto.createHmac('sha256',DEMO_SECRET).update(parts[0]).digest();
    const supplied=Buffer.from(parts[1],'base64url');
    if(expected.length!==supplied.length||!crypto.timingSafeEqual(expected,supplied))return false;
    const payload=JSON.parse(Buffer.from(parts[0],'base64url').toString('utf8'));
    if(payload.type!=='agent-first-demo-invite')return false;
    if(Date.now()>Number(payload.exp||0))return false;
    return normalizeEmail(payload.email)===normalizeEmail(email);
  }catch(e){
    return false;
  }
}
function cors(res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  res.setHeader('Cache-Control','no-store');
}
module.exports = async function handler(req,res){
  cors(res);
  if(req.method==='OPTIONS')return res.status(204).end();
  if(req.method!=='POST')return res.status(405).json({ok:false,error:'Method not allowed'});

  const body=req.body||{};
  const action=String(body.action||'issue');
  const email=normalizeEmail(body.email);

  if(!validEmail(email)){
    return res.status(400).json({ok:false,error:'Enter a valid work email.'});
  }

  if(action==='verify'){
    const ok=verifyInvite(body.token,email);
    return res.status(ok?200:401).json({ok});
  }

  if(action!=='issue'){
    return res.status(400).json({ok:false,error:'Unsupported action'});
  }

  const token=signInvite(email);
  const portalUrl=DEMO_PORTAL+'?invite_email='+encodeURIComponent(email)+'&invite_token='+encodeURIComponent(token);
  console.log(JSON.stringify({event:'demo_access_requested',emailDomain:(email.split('@')[1]||''),at:new Date().toISOString()}));
  return res.status(200).json({ok:true,portalUrl});
};