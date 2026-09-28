(() => {
const STORAGE="alchemistArchives.v1";
const quickStates=["Anxious","Letting go","Stuck","New beginning","Home reset","Grief","Creative","Boundaries","Abundance","Rest"];

const rituals=[
{id:"grounding",title:"Return to the Ground",category:"Grounding",symbol:"◌",summary:"A short sensory practice for moments when your mind is racing ahead of your body.",why:"You sound like you may need less interpretation and more steadiness first.",needs:["A glass of water","A chair or floor space","5 quiet minutes"],keywords:["anxious","anxiety","overwhelmed","scattered","panic","nervous","tomorrow","stress","stressed","ground"],steps:["Place both feet on the floor. Let your shoulders drop without forcing them.","Take three slow breaths. On each exhale, name one physical sensation you can actually feel.","Drink the water slowly. Notice temperature, weight, and movement instead of trying to solve anything.","Name one thing that is true right now—not tomorrow, not the story around it. Just now.","Choose one small action that would make the next hour gentler."],prompt:"What became simpler once I returned to what is actually happening now?"},
{id:"release",title:"The Release Bowl",category:"Release",symbol:"≈",summary:"Give a thought, attachment, or burden a physical ending instead of carrying it in loops.",why:"You seem to be carrying something that may need acknowledgment before it can loosen.",needs:["A bowl of water","A small piece of paper","A pen"],keywords:["release","letting go","let go","ex","breakup","done","resentment","grudge","leave","leaving"],steps:["Write one sentence naming what you are ready to stop rehearsing.","Fold the paper once. Hold it over the bowl and say: “I can honor what happened without carrying it forever.”","Place the paper beside the bowl. Touch the water and imagine the emotional charge becoming less concentrated.","Sit quietly for two minutes. Do not force forgiveness or closure. Notice only what you are willing to put down today.","Dispose of the paper in a way that feels complete to you."],prompt:"What am I actually ready to release—and what still needs more time?"},
{id:"beginning",title:"Threshold Ritual",category:"New Beginnings",symbol:"↗",summary:"Mark the moment between what was and what you are choosing next.",why:"A new beginning often needs a clear threshold more than a perfect plan.",needs:["A doorway","A small object to carry","Paper"],keywords:["new","begin","beginning","starting","start","change","move","job","launch","first","next"],steps:["Stand on one side of a doorway and name, privately, what belongs to the chapter behind you.","Choose a small object to carry through the doorway as a symbol of what you want to bring forward.","Before crossing, write one sentence beginning: “In this next chapter, I practice…”","Cross the threshold slowly with the object in your hand.","Place the object somewhere visible for the next seven days."],prompt:"What do I want to practice becoming, rather than merely achieve?"},
{id:"home",title:"House Reset",category:"Home Blessing",symbol:"⌂",summary:"A practical ritual for changing the emotional feel of a room by tending to the physical space first.",why:"When a space feels heavy, the most useful magic may begin with attention and care.",needs:["Open window if possible","A cloth","A bowl or cup of water"],keywords:["home","house","room","reset","space","clean","heavy","energy","mess","apartment"],steps:["Choose one room only. Open a window or door if that is practical.","Remove five things that do not belong in the room. Keep the task deliberately small.","Wipe one surface slowly while thinking about how you want this room to feel when you enter it.","Place fresh water in the room for a few minutes as a symbol of clarity and movement.","Stand at the entrance and name one behavior you want this space to support."],prompt:"What do I want this space to make easier for me?"},
{id:"boundaries",title:"Boundary in Plain Language",category:"Boundaries",symbol:"│",summary:"Turn a vague sense of discomfort into one clear sentence you can actually use.",why:"A boundary becomes more useful when it moves from feeling to language.",needs:["Paper","A pen","10 minutes"],keywords:["boundary","boundaries","people pleasing","no","resent","taken advantage","used","pressure","family","friend"],steps:["Write the situation without explaining or defending anyone: just the observable facts.","Finish this sentence: “What is not working for me is…”","Now write: “What I am available for is…”","Write one boundary sentence using ordinary language. Remove apologies that are only there to make the boundary disappear.","Read it aloud once. Adjust until it sounds like something you could actually say."],prompt:"What boundary becomes possible when I stop trying to make everyone agree with it?"},
{id:"abundance",title:"Receiving Inventory",category:"Abundance",symbol:"✦",summary:"Shift from vague wanting to noticing what you can receive, support, grow, and ask for.",why:"Abundance work is more useful when it includes receiving and action, not only wishing.",needs:["Paper","A pen","10 minutes"],keywords:["money","abundance","receive","receiving","income","career","opportunity","want","more","financial"],steps:["List five forms of support or resource already available to you, however small.","Circle one thing you routinely dismiss, refuse, or fail to notice because it does not look dramatic enough.","Write one specific thing you are willing to ask for this week.","Write one action you can take that makes receiving easier rather than waiting passively.","End by naming one resource you intend to use well."],prompt:"Where am I asking for more while overlooking what is already trying to support me?"},
{id:"selflove",title:"Mirror of Regard",category:"Self-Love",symbol:"◇",summary:"A grounded self-regard practice that does not require forcing yourself into positive affirmations.",why:"Sometimes care begins with speaking to yourself without contempt, not with trying to feel amazing.",needs:["A mirror","5 quiet minutes"],keywords:["love","self love","hate myself","ugly","worth","confidence","insecure","alone","lonely","unlovable"],steps:["Look at your face without evaluating it. Notice shapes, color, expression, and breath.","Say your own name once, as you would when trying to get the attention of someone you care about.","Name one thing you have carried recently that required effort.","Say: “I do not have to earn basic tenderness from myself.”","Choose one act of care you can complete today without turning it into self-improvement."],prompt:"What changes when I treat care as a baseline instead of a reward?"},
{id:"grief",title:"A Place for Grief",category:"Grief",symbol:"◐",summary:"Make room for grief without asking it to teach, resolve, or transform on command.",why:"Not every feeling needs to become a lesson. Some things need a place to be held.",needs:["A candle or soft light","An object connected to what you miss","Time without interruption"],keywords:["grief","loss","died","death","miss","mourning","sad","gone","bereavement"],steps:["Choose a small place to sit with the object or memory you brought.","If safe for you, light a candle or soften the room. Do not create a performance; create enough quiet to notice what is here.","Say or write what you miss in concrete terms.","Let one memory arrive without deciding whether it is good or bad.","Close by naming what you need after this practice: rest, food, company, movement, privacy, or something else."],prompt:"What did I need permission to miss today?"},
{id:"creative",title:"Open the Channel",category:"Creative Awakening",symbol:"✺",summary:"Use constraint and movement to get past the pressure to make something important.",why:"Creative stuckness often gets worse when every attempt has to justify itself.",needs:["Paper or notes app","A 10-minute timer"],keywords:["creative","create","writer","writing","artist","blocked","stuck","idea","ideas","inspiration","project"],steps:["Set a timer for ten minutes. Choose one medium only: words, sketching, movement, sound, or arranging.","Make one deliberately unimportant thing. It is not allowed to become a project.","When judgment appears, write or say: “Not relevant yet.” Return to making.","At the halfway point, introduce one constraint: only three colors, only questions, only circles, only one beat—anything simple.","Stop when the timer ends, even if you want to continue. Leave yourself somewhere to return."],prompt:"What became possible once the work did not have to prove anything?"},
{id:"rest",title:"Permission to Stop",category:"Rest",symbol:"—",summary:"A closing ritual for days when the useful next action is to stop extracting more from yourself.",why:"You may not need another task. You may need a clean ending to the day.",needs:["A dimmer light","A place to sit or lie down","Paper"],keywords:["tired","exhausted","rest","burnout","burned out","sleep","drained","done","can't","cannot"],steps:["Write down anything you are afraid you will forget if you stop now.","Choose one item that truly must happen later. Give it a specific tomorrow or future time.","Lower one source of stimulation: light, sound, screen brightness, or conversation.","Say: “Nothing else needs to be solved in this hour.”","Do one closing action—wash your face, make tea, stretch, or lie down—and let it be enough."],prompt:"What am I afraid will happen if I stop for the day?"},
{id:"intention",title:"One Clear Intention",category:"Intention",symbol:"•",summary:"Reduce a cloud of wanting into one direction you can recognize and act on.",why:"When everything matters, intention can become noise. One direction is easier to live.",needs:["Paper","A pen"],keywords:["intention","focus","goal","goals","direction","confused","want","wish","manifest","manifesting"],steps:["List everything you are currently trying to make happen. Do not organize it yet.","Underline the item that would change how you move through the others.","Rewrite it as a quality of action rather than an outcome: “I practice…”, “I protect…”, “I make room for…”","Write one behavior that would make the intention visible this week.","Put the sentence somewhere you will encounter it without needing an app notification."],prompt:"If I could practice only one direction this week, what would it be?"},
{id:"protection",title:"Protect the Threshold",category:"Protection",symbol:"⊙",summary:"Clarify what you let into your attention, time, home, or conversation.",why:"Protection can be practical: deciding what gets access to you and what does not.",needs:["A doorway or boundary point","Paper"],keywords:["protect","protection","unsafe","drama","negative","negativity","access","toxic","energy vampire"],steps:["Choose the threshold you are working with: your phone, home, time, inbox, body, or attention.","Write three things currently crossing that threshold too freely.","For each, name one practical gate: silence notifications, close a door, change a schedule, say no, block access, ask for help.","Stand at a physical doorway and say: “Access is not automatic.”","Take one gatekeeping action before the ritual ends."],prompt:"What has had access to me simply because I never decided otherwise?"},
{id:"clarity",title:"The Unknowing Page",category:"Clarity",symbol:"?",summary:"A reflection for when you do not know what you need and do not want to pretend you do.",why:"Not knowing can be useful information. The goal is to reduce noise, not manufacture certainty.",needs:["Paper","A pen","8 minutes"],keywords:["off","don't know","dont know","unsure","confused","lost","unclear","weird","something wrong"],steps:["Write: “What I know:” and list only facts.","Write: “What I am assuming:” and list the stories your mind is adding.","Write: “What I feel:” without explaining the feeling.","Circle the one line that needs attention today.","Choose a next step that does not require solving the entire situation."],prompt:"What became clearer when I separated facts, assumptions, and feelings?"},
{id:"courage",title:"Small Courage",category:"Courage",symbol:"△",summary:"Turn fear into one tolerable act instead of demanding fearlessness.",why:"You may not need confidence before acting. You may need a smaller definition of courage.",needs:["Paper","A pen"],keywords:["afraid","fear","scared","courage","brave","avoid","avoiding","procrastinating","procrastination"],steps:["Name the thing you are avoiding in one sentence.","Write the feared outcome without softening it.","Now write the smallest action that would count as moving toward the situation—not finishing it.","Set a ten-minute container and do only that action.","Afterward, record what actually happened rather than what fear predicted."],prompt:"What did courage look like when I made it smaller and more specific?"},
{id:"connection",title:"Return to Connection",category:"Connection",symbol:"∞",summary:"A gentle check-in for loneliness that focuses on one reachable thread of human contact.",why:"Connection can begin with one honest reach rather than waiting to feel socially ready.",needs:["Your phone or paper","One person you trust enough"],keywords:["lonely","alone","isolated","connection","friend","friends","nobody","unseen"],steps:["Name the kind of connection you actually want: company, listening, laughter, advice, touch, or simply being remembered.","Choose one person who is reasonably safe to contact. Do not choose the most emotionally complicated option.","Send a simple, truthful message. You do not need to perform cheerfulness.","While you wait, do one small act that keeps you connected to the physical world around you.","If no person feels available, write the message you wish you could send. Let that tell you what kind of support you need."],prompt:"What kind of connection was I actually longing for?"}
];

const state=load();
let currentRecommendation=null;
let activeRitual=null;
let guideIndex=0;
let favoritesOnly=false;

function load(){
  try{
    const s=JSON.parse(localStorage.getItem(STORAGE));
    return Object.assign({onboarded:false,favorites:[],history:[]},s||{});
  }catch(e){return {onboarded:false,favorites:[],history:[]};}
}
function save(){localStorage.setItem(STORAGE,JSON.stringify(state));}
function esc(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function toast(msg){const el=document.getElementById("toast");el.textContent=msg;el.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove("show"),1800);}
function formatDate(ts){return new Date(ts).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"});}
function todayISO(){return new Date().toISOString();}
function getRitual(id){return rituals.find(r=>r.id===id);}

function setView(name){
  document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id==="view-"+name));
  document.querySelectorAll("[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===name));
  if(name==="rituals")renderRituals();
  if(name==="archive")renderArchive();
  if(name==="today"){renderRecent();renderMemory();}
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>setView(b.dataset.view)));

function setupOnboarding(){
  const el=document.getElementById("onboarding");
  el.classList.toggle("hidden",state.onboarded);
  document.getElementById("beginOnboarding").addEventListener("click",()=>{
    state.onboarded=true;save();el.classList.add("hidden");document.getElementById("carryText").focus();toast("Your Archive is ready.");
  });
}

function setupQuickStates(){
  document.getElementById("quickStates").innerHTML=quickStates.map(s=>'<button class="chip" data-state="'+esc(s)+'">'+esc(s)+'</button>').join("");
  document.querySelectorAll("[data-state]").forEach(b=>b.addEventListener("click",()=>{
    document.getElementById("carryText").value=b.dataset.state;
    recommend(b.dataset.state);
  }));
}

function scoreRitual(r,text){
  const t=text.toLowerCase();
  let score=0;
  r.keywords.forEach(k=>{if(t.includes(k))score+=k.includes(" ")?5:3;});
  if(t.includes(r.category.toLowerCase()))score+=4;
  return score;
}
function recommend(text){
  const input=(text||document.getElementById("carryText").value||"").trim();
  let ranked=rituals.map(r=>({r,score:scoreRitual(r,input)})).sort((a,b)=>b.score-a.score);
  let chosen=ranked[0].score>0?ranked[0].r:rituals.find(r=>r.id==="clarity");
  currentRecommendation=chosen;
  renderRecommendation(chosen,input);
}
function renderRecommendation(r,input){
  const section=document.getElementById("recommendationSection");
  section.classList.remove("hidden");
  document.getElementById("recommendationCard").innerHTML=
    '<article class="card recommendation-card"><div><div class="eyebrow">'+esc(r.category)+'</div><h3>'+esc(r.title)+'</h3><p>'+esc(r.why)+'</p>'+
    '<div class="rec-meta"><span class="tag">'+esc(r.summary)+'</span><span class="tag">'+r.steps.length+' guided steps</span></div></div>'+
    '<div class="rec-actions"><button class="primary" data-begin="'+r.id+'">Begin ritual</button><button class="secondary" data-details="'+r.id+'">Preview</button></div></article>';
  section.querySelector("[data-begin]").addEventListener("click",()=>beginRitual(r.id,input));
  section.querySelector("[data-details]").addEventListener("click",()=>openRitual(r.id));
  section.scrollIntoView({behavior:"smooth",block:"center"});
}
document.getElementById("recommendBtn").addEventListener("click",()=>recommend());
document.getElementById("carryText").addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key==="Enter")recommend();});
document.getElementById("changeRecommendation").addEventListener("click",()=>{
  if(!currentRecommendation)return;
  const pool=rituals.filter(r=>r.id!==currentRecommendation.id);
  currentRecommendation=pool[Math.floor(Math.random()*pool.length)];
  renderRecommendation(currentRecommendation,document.getElementById("carryText").value);
});

function moonContext(){
  const synodic=29.53058867;
  const knownNew=Date.UTC(2000,0,6,18,14);
  const days=(Date.now()-knownNew)/86400000;
  const age=((days%synodic)+synodic)%synodic;
  const phases=[
    [1.85,"New Moon","A symbolic invitation to simplify, listen, and begin small."],
    [7.38,"Waxing Crescent","A symbolic frame for building momentum without rushing the process."],
    [9.23,"First Quarter","A symbolic frame for action, friction, and choosing what deserves effort."],
    [14.77,"Waxing Gibbous","A symbolic frame for refining what is already underway."],
    [16.61,"Full Moon","A symbolic frame for visibility, fullness, and noticing what has come into view."],
    [22.15,"Waning Gibbous","A symbolic frame for integration, gratitude, and sharing what has been learned."],
    [23.99,"Last Quarter","A symbolic frame for release, editing, and making space."],
    [29.54,"Waning Crescent","A symbolic frame for rest, closure, and reducing demand."]
  ];
  const p=phases.find(x=>age<x[0])||phases[0];
  document.getElementById("moonName").textContent=p[1];
  document.getElementById("moonCopy").textContent=p[2];
}

function renderCategories(){
  const cats=[...new Set(rituals.map(r=>r.category))].sort();
  document.getElementById("ritualCategory").innerHTML='<option value="all">All themes</option>'+cats.map(c=>'<option>'+esc(c)+'</option>').join("");
}
function renderRituals(){
  const q=document.getElementById("ritualSearch").value.toLowerCase().trim();
  const cat=document.getElementById("ritualCategory").value;
  const list=rituals.filter(r=>{
    const hay=(r.title+" "+r.category+" "+r.summary+" "+r.keywords.join(" ")).toLowerCase();
    return (!q||hay.includes(q))&&(cat==="all"||r.category===cat)&&(!favoritesOnly||state.favorites.includes(r.id));
  });
  const grid=document.getElementById("ritualGrid");
  if(!list.length){grid.innerHTML='<div class="empty">No practices match those filters.</div>';return;}
  grid.innerHTML=list.map(r=>'<article class="card ritual-card">'+
    '<div class="ritual-icon">'+esc(r.symbol)+'</div><div class="eyebrow">'+esc(r.category)+'</div><h3>'+esc(r.title)+'</h3><p>'+esc(r.summary)+'</p>'+
    '<div class="ritual-foot"><button class="secondary" data-details="'+r.id+'">View practice</button><button class="fav '+(state.favorites.includes(r.id)?"active":"")+'" data-fav="'+r.id+'" aria-label="Favorite">'+(state.favorites.includes(r.id)?"♥":"♡")+'</button></div></article>').join("");
  grid.querySelectorAll("[data-details]").forEach(b=>b.addEventListener("click",()=>openRitual(b.dataset.details)));
  grid.querySelectorAll("[data-fav]").forEach(b=>b.addEventListener("click",()=>toggleFavorite(b.dataset.fav)));
}
function toggleFavorite(id){
  const i=state.favorites.indexOf(id);
  if(i>=0)state.favorites.splice(i,1); else state.favorites.push(id);
  save();renderRituals();toast(i>=0?"Removed from favorites":"Saved to favorites");
}
document.getElementById("ritualSearch").addEventListener("input",renderRituals);
document.getElementById("ritualCategory").addEventListener("change",renderRituals);
document.getElementById("favoritesOnly").addEventListener("click",e=>{
  favoritesOnly=!favoritesOnly;e.currentTarget.textContent=favoritesOnly?"♥ Favorites only":"♡ Favorites";renderRituals();
});

function openRitual(id){
  const r=getRitual(id);if(!r)return;
  const modal=document.getElementById("ritualModal");
  document.getElementById("ritualModalContent").innerHTML=
    '<div class="ritual-icon">'+esc(r.symbol)+'</div><div class="eyebrow">'+esc(r.category)+'</div><h2 class="modal-title">'+esc(r.title)+'</h2>'+
    '<p class="modal-copy">'+esc(r.summary)+'</p><div class="modal-list">'+r.needs.map(n=>'<span class="need">'+esc(n)+'</span>').join("")+'</div>'+
    '<p class="modal-copy"><strong>Why this exists:</strong> '+esc(r.why)+'</p>'+
    '<div class="modal-actions"><button class="primary" data-modal-begin="'+r.id+'">Begin guided ritual</button><button class="secondary" data-modal-fav="'+r.id+'">'+(state.favorites.includes(r.id)?"♥ Favorited":"♡ Favorite")+'</button></div>';
  modal.classList.remove("hidden");
  modal.querySelector("[data-modal-begin]").addEventListener("click",()=>{closeModal();beginRitual(r.id,"");});
  modal.querySelector("[data-modal-fav]").addEventListener("click",()=>{toggleFavorite(r.id);closeModal();});
}
function closeModal(){document.getElementById("ritualModal").classList.add("hidden");}
document.querySelectorAll("[data-close-modal]").forEach(x=>x.addEventListener("click",closeModal));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});

function beginRitual(id,source){
  activeRitual=getRitual(id);if(!activeRitual)return;
  guideIndex=0;
  activeRitual._source=source||"";
  setView("guide");renderGuide();
}
function renderGuide(){
  const r=activeRitual;if(!r)return;
  const total=r.steps.length+2;
  const final=guideIndex===total-1;
  const intro=guideIndex===0;
  document.getElementById("guideTitle").textContent=r.title;
  document.getElementById("guideCategory").textContent=r.category;
  document.getElementById("guideSymbol").textContent=r.symbol;
  document.getElementById("guideStepCount").textContent=(guideIndex+1)+" of "+total;
  document.getElementById("guideProgressBar").style.width=((guideIndex+1)/total*100)+"%";
  document.getElementById("guideBack").disabled=guideIndex===0;
  const needs=document.getElementById("guideNeeds");
  const copy=document.getElementById("guideCopy");
  const next=document.getElementById("guideNext");
  if(intro){
    copy.innerHTML='<p>'+esc(r.summary)+'</p>';
    needs.innerHTML=r.needs.map(n=>'<span class="need">'+esc(n)+'</span>').join("");
    next.textContent="Begin";
  }else if(final){
    copy.innerHTML='<p><strong>Reflect before you close.</strong></p><p style="font-size:15px;margin-top:10px">'+esc(r.prompt)+'</p>'+
      '<textarea id="ritualReflection" rows="6" style="width:100%;margin-top:18px;border:1px solid var(--line);border-radius:14px;padding:13px;resize:vertical;background:#fff" placeholder="Write what came up. This becomes part of your Archive."></textarea>';
    needs.innerHTML="";
    next.textContent="Complete & archive";
  }else{
    copy.innerHTML='<p>'+esc(r.steps[guideIndex-1])+'</p>';
    needs.innerHTML="";
    next.textContent=guideIndex===total-2?"Reflect":"Continue";
  }
}
document.getElementById("guideNext").addEventListener("click",()=>{
  if(!activeRitual)return;
  const total=activeRitual.steps.length+2;
  if(guideIndex===total-1){
    const reflection=(document.getElementById("ritualReflection")?.value||"").trim();
    state.history.unshift({id:"h"+Date.now(),type:"ritual",ritualId:activeRitual.id,title:activeRitual.title,category:activeRitual.category,reflection,source:activeRitual._source||"",date:todayISO()});
    if(reflection)state.history.unshift({id:"j"+Date.now(),type:"journal",title:"Reflection: "+activeRitual.title,body:reflection,prompt:activeRitual.prompt,ritualId:activeRitual.id,date:todayISO()});
    save();toast("Practice saved to your Archive");activeRitual=null;setView("today");return;
  }
  guideIndex++;renderGuide();
});
document.getElementById("guideBack").addEventListener("click",()=>{if(guideIndex>0){guideIndex--;renderGuide();}});
document.getElementById("exitGuide").addEventListener("click",()=>{activeRitual=null;setView("today");});

function setupJournal(){
  document.querySelectorAll("[data-prompt]").forEach(b=>b.addEventListener("click",()=>{
    document.getElementById("journalPrompt").value="";
    document.getElementById("journalBody").value=b.dataset.prompt+"\n\n";
    document.getElementById("journalBody").focus();
  }));
  document.getElementById("journalForm").addEventListener("submit",e=>{
    e.preventDefault();
    const body=document.getElementById("journalBody").value.trim();
    if(!body){toast("Write something before saving.");return;}
    const title=document.getElementById("journalTitle").value.trim()||"Journal entry";
    const prompt=document.getElementById("journalPrompt").value;
    state.history.unshift({id:"j"+Date.now(),type:"journal",title,body,prompt,date:todayISO()});
    save();e.currentTarget.reset();document.getElementById("journalSaveState").textContent="Saved to your Archive.";toast("Journal entry archived");
  });
}

function historyText(item){
  if(item.type==="journal")return item.body||"";
  return item.reflection||item.source||"";
}
function renderRecent(){
  const el=document.getElementById("recentTimeline");
  const items=state.history.slice(0,4);
  if(!items.length){el.innerHTML='<div class="empty">Your Archive is waiting for its first entry. Complete a practice or save a journal reflection and it will appear here.</div>';return;}
  el.innerHTML=items.map(renderHistoryItem).join("");
}
function renderHistoryItem(item){
  const r=item.ritualId?getRitual(item.ritualId):null;
  const title=item.title||(r?r.title:"Archive entry");
  const text=historyText(item);
  return '<article class="card timeline-item"><div class="timeline-date">'+esc(formatDate(item.date))+'</div><div><h3>'+esc(title)+'</h3>'+
    (text?'<p>'+esc(text.length>240?text.slice(0,240)+"…":text)+'</p>':'<p>Practice completed and added to your history.</p>')+
    '<span class="timeline-badge">'+esc(item.type==="ritual"?(item.category||"Ritual"):"Journal")+'</span></div></article>';
}
function renderArchive(){
  const q=document.getElementById("archiveSearch").value.toLowerCase().trim();
  const filter=document.getElementById("archiveFilter").value;
  const items=state.history.filter(x=>(filter==="all"||x.type===filter)&&(!q||(x.title+" "+historyText(x)+" "+(x.category||"")).toLowerCase().includes(q)));
  document.getElementById("archiveTimeline").innerHTML=items.length?items.map(renderHistoryItem).join(""):'<div class="empty">Nothing in this part of your Archive yet.</div>';
  const completed=state.history.filter(x=>x.type==="ritual");
  const journals=state.history.filter(x=>x.type==="journal");
  const cats=new Set(completed.map(x=>x.category).filter(Boolean));
  document.getElementById("archiveStats").innerHTML=
    '<article class="card stat"><strong>'+completed.length+'</strong><span>Practices completed</span></article>'+
    '<article class="card stat"><strong>'+journals.length+'</strong><span>Journal entries</span></article>'+
    '<article class="card stat"><strong>'+cats.size+'</strong><span>Themes explored</span></article>'+
    '<article class="card stat"><strong>'+state.favorites.length+'</strong><span>Favorite rituals</span></article>';
}
document.getElementById("archiveSearch").addEventListener("input",renderArchive);
document.getElementById("archiveFilter").addEventListener("change",renderArchive);

function renderMemory(){
  const ritualsDone=state.history.filter(x=>x.type==="ritual");
  const journal=state.history.filter(x=>x.type==="journal");
  if(!ritualsDone.length&&!journal.length){
    document.getElementById("memoryPattern").textContent="Example: “Three months ago, you wrote about boundaries. Would you like to revisit what changed?”";
    document.getElementById("memoryTheme").textContent="Example: “You’ve returned to release practices several times lately. Would a receiving practice offer a useful counterweight?”";
    document.getElementById("memoryIntention").textContent="Example: “You set this intention 90 days ago. Here’s what you wrote then.”";
    return;
  }
  const counts={};ritualsDone.forEach(x=>counts[x.category]=(counts[x.category]||0)+1);
  const top=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
  const old=[...state.history].sort((a,b)=>new Date(a.date)-new Date(b.date))[0];
  const latest=state.history[0];
  document.getElementById("memoryPattern").textContent=old?"Your earliest saved thread is “"+old.title+".” Your Archive can bring it back when it becomes relevant again.":"Your history is beginning.";
  document.getElementById("memoryTheme").textContent=top?"You’ve returned most often to "+top[0].toLowerCase()+" work ("+top[1]+" "+(top[1]===1?"time":"times")+"). That pattern may be worth noticing.":"Your journal is beginning to reveal themes.";
  document.getElementById("memoryIntention").textContent=latest?"Most recently: “"+latest.title+".” You do not have to restart from zero when you come back.":"Your next entry will become future context.";
}

function setupReset(){
  document.getElementById("resetDemo").addEventListener("click",()=>{
    if(!confirm("Reset the Alchemist Archives prototype on this device? This clears your saved local entries and favorites."))return;
    localStorage.removeItem(STORAGE);location.reload();
  });
}

setupOnboarding();
setupQuickStates();
moonContext();
renderCategories();
setupJournal();
setupReset();
renderRecent();
renderMemory();
renderRituals();
})();