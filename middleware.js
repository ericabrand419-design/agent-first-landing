const AUTH_ORIGIN='https://agent-first-gamma.vercel.app';
function readCookie(request,name){
  const raw=request.headers.get('cookie')||'';
  const pair=raw.split(';').map(v=>v.trim()).find(v=>v.startsWith(name+'='));
  return pair?decodeURIComponent(pair.slice(name.length+1)):'';
}
async function valid(token){
  if(!token)return false;
  try{
    const r=await fetch(AUTH_ORIGIN+'/api/auth',{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json','Authorization':'Bearer '+token},
      body:JSON.stringify({action:'session'})
    });
    const data=await r.json().catch(()=>({}));
    return !!(r.ok&&data&&data.authenticated&&Array.isArray(data.permissions)&&data.permissions.includes('deal_room'));
  }catch(e){return false;}
}
export default async function middleware(request){
  const ok=await valid(readCookie(request,'af_private_access'));
  if(ok)return;
  const url=new URL('/deal-room-access.html',request.url);
  url.searchParams.set('returnTo',new URL(request.url).pathname);
  return Response.redirect(url,302);
}
export const config={matcher:['/deal-room/pilot','/deal-room/evidence','/deal-room/company-operations','/deal-room/roadmap','/deal-room/media','/deal-room-workspace.html','/pilot-system.html','/evidence-register.html','/company-operations.html','/roadmap-milestones.html','/media-library.html','/business-plan.html','/marketing-plan.html','/financial-model.html','/investment-ask.html','/investor-deck.html','/investor-brief.html','/financial-summary.html','/founder-story.html','/investor-faq.html','/due-diligence.html','/security-readiness.html','/security-data-governance.html','/customer-overview.html','/customer-product-video.html','/roi-calculator.html','/industry-use-cases.html','/customer-faq.html','/deal-room/execution-readiness','/execution-readiness.html','/deal-room/pilot-operations-manual','/deal-room/security-buyer-pack','/deal-room/founder-sales-system','/deal-room/recallya-crm','/deal-room/evidence-standard','/deal-room/founder-narrative','/deal-room/audit','/deal-room/readiness-control-center','/pilot-operations-manual.html','/security-buyer-pack.html','/founder-sales-system.html','/recallya-crm-spec.html','/evidence-standard.html','/founder-investor-narrative.html','/deal-room-audit.html','/readiness-control-center.html']};