(function(){
  const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealEls=document.querySelectorAll('.reveal');
  if(reduced||!('IntersectionObserver' in window)){
    revealEls.forEach(el=>el.classList.add('visible'));
  }else{
    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },{threshold:.12,rootMargin:'0px 0px -35px 0px'});
    revealEls.forEach(el=>io.observe(el));
  }

  const progress=document.querySelector('.scroll-progress');
  const updateProgress=()=>{
    if(!progress)return;
    const max=document.documentElement.scrollHeight-window.innerHeight;
    progress.style.width=(max>0?Math.min(100,(window.scrollY/max)*100):0)+'%';
  };
  updateProgress();
  window.addEventListener('scroll',updateProgress,{passive:true});
  window.addEventListener('resize',updateProgress);

  const orbitPills=[...document.querySelectorAll('.orbit-pill')];
  let orbitIndex=0;
  function setOrbit(i){
    orbitPills.forEach((p,n)=>p.classList.toggle('active',n===i));
  }
  if(orbitPills.length){
    setOrbit(0);
    if(!reduced){
      setInterval(()=>{
        orbitIndex=(orbitIndex+1)%orbitPills.length;
        setOrbit(orbitIndex);
      },1450);
    }
  }

  const mapperData={
    idea:{
      title:'Turn the idea into something people can understand, use and buy.',
      copy:'You do not need to arrive knowing the category, feature list, tech stack, brand system or launch plan. We clarify the opportunity, make the strategic choices, create the identity, build the experience and set up the learning loop.',
      flow:['research','audience','positioning','naming','brand','product architecture','website + app','prototype','launch plan'],
      bring:'The vision, the problem and your non-negotiables.',
      carry:'The research, decisions, design, build plan and sequence.'
    },
    messy:{
      title:'Find what is actually broken before adding more features.',
      copy:'When a product, workflow or business feels messy, the first job is diagnosis. We map friction, confusing decisions, duplicated work, knowledge gaps, conversion leaks and mismatches between what you promise and what people experience.',
      flow:['workflow teardown','user journey','friction map','data review','message audit','UX redesign','priority plan','testing'],
      bring:'What feels wrong and what you wish worked better.',
      carry:'The diagnosis, prioritization, redesign and proof.'
    },
    growth:{
      title:'Make product learning and marketing learning one system.',
      copy:'Growth is not just traffic. We connect positioning, campaigns, landing pages, onboarding, activation and retention so marketing tells us something useful about the product and product behavior tells us what marketing should say next.',
      flow:['analytics','campaigns','landing pages','A/B tests','activation','retention','reporting','optimization'],
      bring:'The business goal and the constraints.',
      carry:'The experiments, interpretation, recommendations and next move.'
    },
    ai:{
      title:'Use AI where it removes burden, not where it creates another tool to manage.',
      copy:'We start with the human and the work. Then we decide what the system should remember, retrieve, interpret, coordinate or automate while keeping judgment, accountability and relationships with the person.',
      flow:['work mapping','knowledge architecture','responsibility split','AI scope','guardrails','prototype','pilot','measurement'],
      bring:'The work people are trying to get done.',
      carry:'The system design, AI role, prototype and evidence.'
    }
  };

  const mapButtons=[...document.querySelectorAll('.map-option')];
  const mapTitle=document.getElementById('mapper-title');
  const mapCopy=document.getElementById('mapper-copy');
  const mapFlow=document.getElementById('mapper-flow');
  const mapBring=document.getElementById('mapper-bring');
  const mapCarry=document.getElementById('mapper-carry');
  function renderMapper(key){
    const d=mapperData[key];
    if(!d)return;
    mapButtons.forEach(b=>b.classList.toggle('active',b.dataset.map===key));
    if(mapTitle)mapTitle.textContent=d.title;
    if(mapCopy)mapCopy.textContent=d.copy;
    if(mapFlow)mapFlow.innerHTML=d.flow.map(x=>'<span>'+x+'</span>').join('');
    if(mapBring)mapBring.textContent=d.bring;
    if(mapCarry)mapCarry.textContent=d.carry;
  }
  mapButtons.forEach(b=>b.addEventListener('click',()=>renderMapper(b.dataset.map)));
  renderMapper('idea');

  const caseData={
    vision:{
      title:'Start with the outcome, not the feature list.',
      copy:'The founder brought a broad ambition: help people discover and act on opportunities such as jobs, scholarships, grants and fellowships without forcing them to search across disconnected places and figure out what matters alone.',
      items:['problem framing','audience + use cases','competitive scan','category definition','business-model questions','priority decisions']
    },
    brand:{
      title:'Make the idea legible before asking people to trust it.',
      copy:'The work expands beyond interface design into naming, positioning, messaging, identity, visual direction and the story the product tells before a user ever creates an account.',
      items:['naming','positioning','value proposition','brand voice','logo direction','visual identity']
    },
    product:{
      title:'Design the whole experience around what the user is trying to accomplish.',
      copy:'Instead of asking the founder to specify screens and features, the Agent First process translates the goal into information architecture, workflows, product logic, website and app experiences and a build sequence.',
      items:['information architecture','UX/UI','user flows','website','app experience','data + backend direction']
    },
    learn:{
      title:'Launch creates evidence, not an endpoint.',
      copy:'After the product exists, testing, analytics, reports and user behavior feed the next set of decisions. Marketing experiments and product experiments become one learning system instead of separate departments.',
      items:['usability tests','analytics','A/B tests','conversion','reports','recommendations','marketing tests','iteration']
    }
  };
  const caseButtons=[...document.querySelectorAll('.case-tab')];
  const caseTitle=document.getElementById('case-title');
  const caseCopy=document.getElementById('case-copy');
  const caseList=document.getElementById('case-list');
  function renderCase(key){
    const d=caseData[key];
    if(!d)return;
    caseButtons.forEach(b=>b.classList.toggle('active',b.dataset.case===key));
    if(caseTitle)caseTitle.textContent=d.title;
    if(caseCopy)caseCopy.textContent=d.copy;
    if(caseList)caseList.innerHTML=d.items.map(x=>'<div>'+x+'</div>').join('');
  }
  caseButtons.forEach(b=>b.addEventListener('click',()=>renderCase(b.dataset.case)));
  renderCase('vision');

  const form=document.getElementById('consulting-form');
  const status=document.getElementById('consulting-status');
  if(form){
    form.addEventListener('submit',async function(e){
      e.preventDefault();
      const btn=form.querySelector('button[type="submit"]');
      const original=btn.textContent;
      btn.disabled=true;
      btn.textContent='Sending…';
      status.textContent='Submitting your inquiry…';
      status.style.color='#aab3cf';
      try{
        const response=await fetch('https://api.web3forms.com/submit',{
          method:'POST',
          headers:{Accept:'application/json'},
          body:new FormData(form)
        });
        const data=await response.json();
        if(!data||!data.success)throw new Error('submit');
        form.reset();
        btn.textContent='Outcome received ✓';
        status.style.color='#8fe7c1';
        status.textContent='Thanks — your consulting inquiry is in.';
      }catch(err){
        btn.disabled=false;
        btn.textContent=original;
        status.style.color='#ff9fa8';
        status.innerHTML='Something went wrong. Email <a href="mailto:info@myagentfirst.com" style="text-decoration:underline">info@myagentfirst.com</a> instead.';
      }
    });
  }
})();