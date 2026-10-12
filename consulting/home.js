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
  "idea": {
    "title": "Put the right approved answer where the worker needs it.",
    "copy": "Observe where agents search, identify authoritative sources, and organize guidance by the active client and the question being handled.",
    "flow": [
      "observe live work",
      "source inventory",
      "context mapping",
      "knowledge design",
      "test retrieval"
    ],
    "bring": "One recurring question and the materials workers use today.",
    "carry": "A workflow map and a focused knowledge-system design."
  },
  "messy": {
    "title": "Clarify the decision—not just the wording.",
    "copy": "When the same situation produces different answers, map the relevant policy, exceptions, rule owner, and escalation boundary.",
    "flow": [
      "collect examples",
      "map policy",
      "resolve ambiguity",
      "design decision path",
      "test scenarios"
    ],
    "bring": "Examples of inconsistent decisions.",
    "carry": "An approved decision map with clear outcomes and exception handling."
  },
  "growth": {
    "title": "Give routine decisions better support.",
    "copy": "Measure what supervisors are asked and why. Separate genuine judgment calls from avoidable searching, missing policy, and unclear authority.",
    "flow": [
      "measure interruptions",
      "classify reasons",
      "clarify ownership",
      "prototype guidance",
      "compare baseline"
    ],
    "bring": "A representative shift or decision-heavy workflow.",
    "carry": "An escalation diagnostic and measurable improvement plan."
  },
  "ai": {
    "title": "Design the work before adding AI.",
    "copy": "Define the human task, approved rules, and safety boundaries first. Then decide whether AI should help retrieve, interpret, or coordinate information.",
    "flow": [
      "observe work",
      "decision inventory",
      "human/system split",
      "guardrails",
      "prototype",
      "pilot"
    ],
    "bring": "A real workflow and its operational constraints.",
    "carry": "A human-centered responsibility map and a testable next step."
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
  "vision": {
    "title": "Context determines which rule applies.",
    "copy": "One worker handles appointment requests for multiple client accounts. The words from the caller are identical, but the appropriate action may depend on the active client.",
    "items": [
      "Identify the active client and location",
      "Identify the requested service",
      "Confirm the approved rule source",
      "Never apply the previous client's rule"
    ]
  },
  "brand": {
    "title": "Different clients may authorize different outcomes.",
    "copy": "In this fictional example, Client A allows same-day appointments under specified conditions, while Client B requires eligibility verification first. Neither is a real client's policy.",
    "items": [
      "Client A: proceed when conditions are satisfied",
      "Client B: verify eligibility before scheduling",
      "Source and rule owner stay visible",
      "Missing rules are marked not specified"
    ]
  },
  "product": {
    "title": "Show the next action, not a paragraph to decode.",
    "copy": "The worker receives a clear action path: allow, verify, disclose, document, or escalate. Existing scheduling software still manages the calendar.",
    "items": [
      "Action appropriate to this client",
      "Required wording, when configured",
      "Documentation and escalation requirements",
      "Worker keeps control of the call"
    ]
  },
  "learn": {
    "title": "An unanswered question is a governance signal.",
    "copy": "A well-designed system says when a rule is absent instead of guessing. A measured pilot would test search time, consistency, escalation rates, and user confidence.",
    "items": [
      "Record rules that are missing",
      "Route rule changes to authorized owners",
      "Measure current and proposed workflows",
      "Scale only when evidence warrants it"
    ]
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