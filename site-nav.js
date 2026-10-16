/* Agent First canonical public-site navigation.
   Update this file, not the menus embedded in individual marketing pages. */
(function(){
  'use strict';
  function ready(){
    var isDealRoom=location.pathname==='/deal-room-v1.html'||location.pathname==='/deal-room';
    var isProspectus=location.pathname==='/pilot-prospectus.html';
    var nav=document.querySelector('.af-nav')||
       ((isDealRoom||isProspectus)?document.querySelector('nav.nav'):null);
    if(!nav||document.getElementById('af-global-nav'))return;
    var path=location.pathname;
    var pages=[
      {name:'How It Works',href:'/how-it-works.html',active:path==='/how-it-works.html'},
      {name:'Industries',href:'/industries.html',active:path==='/industries.html'||/^\/for-/.test(path)},
      {name:'Free Tools',href:'/labs.html',active:path==='/labs.html'||/calculator|estimator|finder|roulette|quiz|battle|not-specified|call-from-hell|beat-agent|can-i-book-it|chaos-cost|checklist|client-resolution|profile-preview|pilot-business-case/i.test(path)},
      {name:'Agent Challenge',href:'/agent-challenge.html',active:path==='/agent-challenge.html'},
      {name:'Pilot Program',href:'/pilot-program.html',active:path==='/pilot-program.html'||isProspectus},
      {name:'Pricing',href:'/pricing.html',active:path==='/pricing.html'},
      {name:'Deal Room',href:'/deal-room',active:isDealRoom}
    ];
    if(!document.getElementById('af-shared-nav-style')){
      var style=document.createElement('style');
      style.id='af-shared-nav-style';
      style.textContent=`
      #af-global-nav{box-sizing:border-box;position:sticky!important;top:0;z-index:900!important;width:100%;min-height:70px;padding:12px clamp(16px,3.2vw,48px)!important;display:flex!important;align-items:center;justify-content:space-between;flex-wrap:nowrap!important;gap:20px;background:#fff!important;border-bottom:1px solid #e5e4f1;box-shadow:0 2px 10px rgba(18,19,36,.04);font-family:Inter,ui-sans-serif,system-ui,sans-serif}
      #af-global-nav *{box-sizing:border-box}
      #af-global-nav .af-site-brand{display:flex;align-items:center;flex-shrink:0;gap:10px;text-decoration:none;color:#15172a!important;font-size:13px;font-weight:900;letter-spacing:.16em;white-space:nowrap}
      #af-global-nav .af-site-brand svg{width:23px;height:29px}
      #af-global-nav .af-site-links{display:flex;align-items:center;justify-content:flex-end;gap:clamp(9px,1.12vw,18px);min-width:0}
      #af-global-nav .af-site-link{position:relative;font-size:12.5px;line-height:1.25;font-weight:700;text-decoration:none;color:#33384e!important;white-space:nowrap;border-radius:7px;padding:9px 1px}
      #af-global-nav .af-site-link:hover,#af-global-nav .af-site-link:focus-visible{color:#7138d8!important}
      #af-global-nav .af-site-link[aria-current="page"]{color:#7138d8!important}
      #af-global-nav .af-site-link[aria-current="page"]:after{content:"";position:absolute;bottom:2px;left:0;right:0;height:2px;border-radius:2px;background:#7138d8}
      #af-global-nav .af-site-cta{display:inline-flex;align-items:center;justify-content:center;padding:10px 13px;min-height:40px;border-radius:10px;text-decoration:none;font-size:12px;font-weight:850;white-space:nowrap;color:#fff!important;background:linear-gradient(110deg,#ff7352,#e94ea7 48%,#7c3aed)}
      #af-global-nav .af-site-cta:hover{filter:brightness(.94)}
      #af-global-nav .af-site-toggle{display:none;align-items:center;justify-content:center;gap:8px;border:1px solid #dcd6ed;border-radius:10px;padding:9px 11px;background:#fff;color:#241b41;font:700 13px Inter,system-ui,sans-serif;min-height:40px;cursor:pointer}
      #af-global-nav a:focus-visible,#af-global-nav button:focus-visible{outline:3px solid #945df3;outline-offset:3px}
      #af-deal-subnav{position:relative;z-index:40;display:flex;align-items:center;gap:20px;padding:12px clamp(16px,3.2vw,48px);background:#f8f6ff;border-bottom:1px solid #e5e4f1;font:700 12px Inter,system-ui,sans-serif;flex-wrap:wrap}
      #af-deal-subnav .af-sub-label{color:#77758b;text-transform:uppercase;font-size:10px;letter-spacing:.09em}
      #af-deal-subnav a{color:#5d32ad;text-decoration:none}
      #af-deal-subnav a:hover{text-decoration:underline}
      @media(max-width:1250px){
        #af-global-nav .af-site-toggle{display:inline-flex}
        #af-global-nav .af-site-links{position:absolute;top:100%;right:0;left:0;display:none;flex-direction:column;align-items:stretch;gap:0;padding:10px 18px 18px;background:#fff;border-bottom:1px solid #e5e4f1;box-shadow:0 16px 25px rgba(20,22,40,.12);max-height:calc(100vh - 70px);overflow-y:auto}
        #af-global-nav.af-open .af-site-links{display:flex}
        #af-global-nav .af-site-link{padding:13px 9px;font-size:14px}
        #af-global-nav .af-site-link[aria-current="page"]:after{left:8px;right:auto;width:56px}
        #af-global-nav .af-site-cta{margin-top:8px;font-size:14px}
      }
      @media(max-width:500px){#af-global-nav{min-height:64px!important;padding:9px 16px!important}#af-global-nav .af-site-brand{font-size:11px}#af-deal-subnav{gap:12px;padding:11px 16px}}
      @media(prefers-reduced-motion:reduce){#af-global-nav *{scroll-behavior:auto}}
      `;
      document.head.appendChild(style);
    }
    var logo='<svg viewBox="0 0 40 48" aria-hidden="true" focusable="false"><defs><linearGradient id="afUnifiedTop" x1="3" y1="18" x2="36" y2="3"><stop stop-color="#FF8A3D"/><stop offset=".5" stop-color="#FF5B67"/><stop offset="1" stop-color="#F43BA5"/></linearGradient><linearGradient id="afUnifiedBottom" x1="3" y1="45" x2="36" y2="27"><stop stop-color="#6731F2"/><stop offset=".6" stop-color="#7C4DFF"/><stop offset="1" stop-color="#A345F0"/></linearGradient></defs><path d="M5 18.5 20 4.5 35 18.5" fill="none" stroke="url(#afUnifiedTop)" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 43 20 29 35 43" fill="none" stroke="url(#afUnifiedBottom)" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    nav.removeAttribute('style');
    nav.className='af-global-nav';
    nav.id='af-global-nav';
    nav.setAttribute('role','navigation');
    nav.setAttribute('aria-label','Primary navigation');
    nav.innerHTML='<a class="af-site-brand" href="/index.html" aria-label="Agent First home">'+logo+'<span>AGENT FIRST</span></a>'+
      '<button type="button" class="af-site-toggle" id="af-nav-toggle" aria-expanded="false" aria-controls="af-nav-links">☰ <span>Menu</span></button>'+
      '<div class="af-site-links" id="af-nav-links">'+pages.map(function(p){
        return '<a class="af-site-link" href="'+p.href+'"'+(p.active?' aria-current="page"':'')+'>'+p.name+'</a>';
      }).join('')+'<a class="af-site-cta" href="/index.html#contact">Apply for a Pilot →</a></div>';
    var toggle=nav.querySelector('#af-nav-toggle');
    function close(){nav.classList.remove('af-open');toggle.setAttribute('aria-expanded','false')}
    toggle.addEventListener('click',function(){
      var opening=!nav.classList.contains('af-open');
      nav.classList.toggle('af-open',opening);
      toggle.setAttribute('aria-expanded',opening?'true':'false');
    });
    nav.addEventListener('keydown',function(e){if(e.key==='Escape'){close();toggle.focus()}});
    document.addEventListener('click',function(e){if(!nav.contains(e.target))close()});
    nav.querySelectorAll('.af-site-links a').forEach(function(link){link.addEventListener('click',close)});
    if(isDealRoom&&!document.getElementById('af-deal-subnav')){
      var sub=document.createElement('div');
      sub.id='af-deal-subnav';
      sub.setAttribute('aria-label','Deal Room sections');
      sub.innerHTML='<span class="af-sub-label">Deal Room sections</span><a href="#briefing">Start Here</a><a href="#company">Company</a><a href="#materials">Materials</a><a href="?access=required#access">Private access</a>';
      nav.insertAdjacentElement('afterend',sub);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});
  else ready();
})();
