(function(){
'use strict';
var state={user:null,clients:[],drafts:[],team:[],draft:null,draftId:null,file:null};
var $=function(id){return document.getElementById(id);};
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
async function api(url,opts){
  opts=opts||{}; opts.headers=Object.assign({'content-type':'application/json'},opts.headers||{});
  var r=await fetch(url,opts);
  var j={}; try{j=await r.json();}catch(e){}
  if(!r.ok) throw new Error(j.error||('Request failed ('+r.status+')'));
  return j;
}
function msg(id,text,kind){var el=$(id); if(!el)return; el.textContent=text||''; el.className='formMsg '+(kind||'');}
async function init(){
  bind();
  try{
    var s=await api('/api/portal?action=session');
    enter(s.user);
  }catch(e){
    $('authScreen').hidden=false; $('portalApp').hidden=true;
  }
}
function bind(){
  $('loginForm').addEventListener('submit',login);
  $('setupForm').addEventListener('submit',setup);
  $('logoutBtn').onclick=logout;
  document.querySelectorAll('.navBtn').forEach(function(b){b.onclick=function(){showView(b.dataset.view);};});
  $('openWorkspaceBtn').onclick=function(){location.href='/';};
  $('newClientBtn').onclick=openNewClient;
  $('closeOnboard').onclick=closeOnboard;
  $('backToSourceBtn').onclick=function(){setOnboardStep(1);};
  $('analyzeSourceBtn').onclick=analyzeSource;
  $('saveDraftBtn').onclick=function(){saveDraft('review',false);};
  $('approveDraftBtn').onclick=function(){saveDraft('approved',true);};
  $('publishBtn').onclick=publishDraft;
  $('finishDraftBtn').onclick=function(){closeOnboard();loadClients();};
  $('showAddUserBtn').onclick=function(){$('addUserPanel').hidden=false;renderAssignmentChecks();};
  $('cancelAddUser').onclick=function(){$('addUserPanel').hidden=true;};
  $('addUserForm').addEventListener('submit',createUser);
  $('sourceFile').addEventListener('change',function(){handleFile(this.files&&this.files[0]);});
  ['dragenter','dragover'].forEach(function(ev){$('dropZone').addEventListener(ev,function(e){e.preventDefault();this.classList.add('drag');});});
  ['dragleave','drop'].forEach(function(ev){$('dropZone').addEventListener(ev,function(e){e.preventDefault();this.classList.remove('drag');});});
  $('dropZone').addEventListener('drop',function(e){var f=e.dataTransfer.files&&e.dataTransfer.files[0]; if(f)handleFile(f);});
}
async function login(e){
  e.preventDefault(); msg('loginErr','');
  try{
    var j=await api('/api/portal?action=login',{method:'POST',body:JSON.stringify({email:$('loginEmail').value,password:$('loginPassword').value})});
    enter(j.user);
  }catch(err){msg('loginErr',err.message,'err');}
}
async function setup(e){
  e.preventDefault(); msg('setupErr','');
  try{
    var j=await api('/api/portal?action=setup',{method:'POST',body:JSON.stringify({adminKey:$('setupKey').value,name:$('setupName').value,email:$('setupEmail').value,password:$('setupPassword').value})});
    enter(j.user);
  }catch(err){msg('setupErr',err.message,'err');}
}
async function logout(){
  try{await api('/api/portal?action=logout',{method:'POST',body:'{}'});}catch(e){}
  location.href='/portal.html';
}
async function enter(user){
  state.user=user;
  $('authScreen').hidden=true; $('portalApp').hidden=false;
  $('whoAmI').textContent=user.name;
  $('rolePill').textContent=user.role;
  $('welcomeTitle').textContent='Welcome back, '+String(user.name||'').split(' ')[0];
  var isAdmin=user.role==='admin', isSupervisor=isAdmin||user.role==='supervisor';
  document.querySelectorAll('.adminOnly').forEach(function(el){el.hidden=!isAdmin;});
  document.querySelectorAll('.roleSupervisor,.supervisorOnly').forEach(function(el){el.hidden=!isSupervisor;});
  await loadClients();
  if(isSupervisor) await loadTeam();
}
function showView(view){
  document.querySelectorAll('.view').forEach(function(v){v.classList.remove('activeView');});
  document.querySelectorAll('.navBtn').forEach(function(b){b.classList.toggle('active',b.dataset.view===view);});
  var target=$('view-'+view); if(target)target.classList.add('activeView');
}
async function loadClients(){
  try{
    var j=await api('/api/portal?action=clients');
    state.clients=j.clients||[]; state.drafts=j.drafts||[];
    renderClients();
  }catch(err){console.error(err);}
}
function clientIndustry(c){return (c.data&&c.data.industry)||'Automotive Service';}
function renderClients(){
  $('publishedCount').textContent=state.clients.length;
  $('draftCount').textContent=state.drafts.length;
  $('assignedCount').textContent=state.user.role==='agent'?state.clients.length:'—';
  var isAdmin=!!(state.user && state.user.role==='admin');
  var html=state.clients.map(function(c){
    var d=c.data||{}, industry=clientIndustry(c);
    var editBtn=isAdmin?'<button type="button" class="ghost editClientBtn" data-id="'+esc(c.id)+'">Edit</button>':'';
    return '<article class="clientCard"><div class="clientCardTop"><div><h3>'+esc(d.name||c.id)+'</h3><span class="industryTag">'+esc(industry)+'</span></div></div>'+
      '<div class="cardMeta">'+esc(d.address||'No address on file')+'<br>'+esc(d.hours||'Hours not yet verified')+'</div>'+
      '<div class="cardActions"><a class="buttonLink ghost" href="/?client='+encodeURIComponent(c.id)+'">Open workspace</a>'+editBtn+'</div></article>';
  }).join('');
  if(!html)html='<div class="panel muted">No Client Profiles are assigned to this account yet.</div>';
  $('clientGrid').innerHTML=html; $('workspaceClients').innerHTML=html;
  document.querySelectorAll('.editClientBtn').forEach(function(b){b.onclick=function(){openPublishedClient(b.dataset.id);};});
  var drafts=state.drafts.map(function(d){
    var x=d.data||{};
    return '<article class="draftCard"><div class="clientCardTop"><div><h3>'+esc(x.name||d.id)+'</h3><span class="industryTag">'+esc(x.industry||'Unspecified')+'</span></div><span class="statusTag '+(d.status==='approved'?'approved':'')+'">'+esc(d.status)+'</span></div>'+
      '<div class="cardMeta">'+esc((x.sourceFiles||[]).join(', ')||'Manual draft')+'</div>'+
      '<div class="cardActions"><button class="ghost reviewDraftBtn" data-id="'+esc(d.id)+'">Review draft</button></div></article>';
  }).join('');
  $('draftGrid').innerHTML=drafts||'<div class="panel muted">No drafts waiting for review.</div>';
  document.querySelectorAll('.reviewDraftBtn').forEach(function(b){b.onclick=function(){openDraft(b.dataset.id);};});
}
function openNewClient(){
  resetOnboardMode();
  state.draft=null; state.draftId=null; state.file=null;
  $('clientIndustry').value='Automotive Service'; $('clientNameSeed').value=''; $('sourceText').value=''; $('sourceFile').value='';
  $('fileStatus').textContent=''; msg('extractMsg',''); msg('reviewMsg',''); msg('publishMsg','');
  $('onboardBackdrop').hidden=false; setOnboardStep(1);
}
function openDraft(id){
  var item=state.drafts.find(function(d){return d.id===id;});
  if(!item)return;
  resetOnboardMode();
  state.draft=JSON.parse(JSON.stringify(item.data||{})); state.draftId=id; state.file=null;
  $('onboardBackdrop').hidden=false; fillReview(); setOnboardStep(2);
}
function openPublishedClient(id){
  var item=state.clients.find(function(c){return c.id===id;});
  if(!item)return;
  state.draft=JSON.parse(JSON.stringify(item.data||{})); state.draftId=id; state.file=null;
  msg('reviewMsg',''); msg('publishMsg','');
  $('onboardBackdrop').hidden=false; fillReview(); setOnboardStep(2);
  enterEditPublishedMode();
}
function enterEditPublishedMode(){
  state.editingPublished=true;
  $('onboardEyebrow').textContent='EDIT CLIENT';
  $('onboardTitle').textContent='Edit Client Profile';
  $('onboardSteps').hidden=true;
  $('onboardReviewBanner').hidden=true;
  $('backToSourceBtn').hidden=true;
  $('approveDraftBtn').hidden=true;
  $('saveDraftBtn').hidden=false;
  $('saveDraftBtn').textContent='Save changes';
  $('saveDraftBtn').onclick=saveClientEdit;
}
function resetOnboardMode(){
  state.editingPublished=false;
  $('onboardEyebrow').textContent='NEW CLIENT';
  $('onboardTitle').textContent='Build a Client Profile';
  $('onboardSteps').hidden=false;
  $('onboardReviewBanner').hidden=false;
  $('backToSourceBtn').hidden=false;
  $('approveDraftBtn').hidden=false;
  $('approveDraftBtn').textContent='Approve & continue →';
  $('saveDraftBtn').textContent='Save draft';
  $('saveDraftBtn').onclick=function(){saveDraft('review',false);};
}
function closeOnboard(){$('onboardBackdrop').hidden=true;}
function setOnboardStep(n){
  [1,2,3].forEach(function(i){$('onboardStep'+i).hidden=i!==n;});
  document.querySelectorAll('.step').forEach(function(s){s.classList.toggle('active',Number(s.dataset.step)===n);});
}
function handleFile(file){
  if(!file)return;
  var allowed=/pdf|text|json|csv|markdown/i.test(file.type||'')||/\.(pdf|txt|md|csv|json)$/i.test(file.name);
  if(!allowed){$('fileStatus').textContent='Use PDF, text, CSV, Markdown, or JSON for this preview.';state.file=null;return;}
  $('fileStatus').textContent='Reading '+file.name+'…';
  if(file.type==='application/pdf'||/\.pdf$/i.test(file.name)){
    var fr=new FileReader();
    fr.onload=function(){var raw=String(fr.result||'');state.file={filename:file.name,mimeType:'application/pdf',fileBase64:raw.split(',')[1]||''};$('fileStatus').textContent=file.name+' ready for extraction.';};
    fr.onerror=function(){$('fileStatus').textContent='Could not read that PDF.';};
    fr.readAsDataURL(file);
  }else{
    var tr=new FileReader();
    tr.onload=function(){state.file={filename:file.name,mimeType:file.type||'text/plain',sourceText:String(tr.result||'')};$('fileStatus').textContent=file.name+' ready for extraction.';};
    tr.onerror=function(){$('fileStatus').textContent='Could not read that file.';};
    tr.readAsText(file);
  }
}
async function analyzeSource(){
  msg('extractMsg','');
  var pasted=$('sourceText').value.trim(), industry=$('clientIndustry').value;
  var body={industry:industry,filename:state.file?state.file.filename:'pasted-client-information.txt',mimeType:state.file?state.file.mimeType:'text/plain'};
  if(state.file&&state.file.fileBase64){body.fileBase64=state.file.fileBase64;}
  else{
    var fileText=state.file&&state.file.sourceText?state.file.sourceText:'';
    body.sourceText=[fileText,pasted].filter(Boolean).join('\n\n--- ADDITIONAL NOTES ---\n\n');
  }
  if(!body.fileBase64&&!body.sourceText){msg('extractMsg','Upload a file or paste client information first.','err');return;}
  var btn=$('analyzeSourceBtn'), old=btn.textContent; btn.disabled=true;btn.textContent='Analyzing source…';
  try{
    var j=await api('/api/portal?action=extract',{method:'POST',body:JSON.stringify(body)});
    state.draft=j.draft||{}; if($('clientNameSeed').value.trim()&&!state.draft.name)state.draft.name=$('clientNameSeed').value.trim();
    fillReview(); setOnboardStep(2);
  }catch(err){msg('extractMsg',err.message,'err');}
  finally{btn.disabled=false;btn.textContent=old;}
}
function fillReview(){
  var d=state.draft||{};
  $('rName').value=d.name||''; $('rIndustry').value=d.industry||'Automotive Service'; $('rPhone').value=d.mainPhone||'';
  $('rAddress').value=d.address||''; $('rHours').value=d.hours||''; $('rOpening').value=d.openingScript||'';
  $('rTransfer').value=d.transferRule||''; $('rVerify').value=d.verificationRequirement||d.advisorRequirement||'';
  $('rContacts').value=JSON.stringify(d.contacts||d.staff||[],null,2);
  $('rServices').value=JSON.stringify(d.services||{},null,2); $('rPolicies').value=JSON.stringify(d.policies||{},null,2);
  var flags=Array.isArray(d.needsHumanReview)?d.needsHumanReview:[];
  $('reviewFlags').innerHTML=flags.map(function(x){return '<div class="reviewFlag">Review: '+esc(x)+'</div>';}).join('');
}
function parseBox(id,label){
  try{return JSON.parse($(id).value||(/Contacts/.test(label)?'[]':'{}'));}catch(e){throw new Error(label+' contains invalid JSON.');}
}
function collectDraft(){
  var d=Object.assign({},state.draft||{});
  d.name=$('rName').value.trim(); d.industry=$('rIndustry').value; d.mainPhone=$('rPhone').value.trim(); d.address=$('rAddress').value.trim();
  d.hours=$('rHours').value.trim(); d.openingScript=$('rOpening').value.trim(); d.transferRule=$('rTransfer').value.trim(); d.verificationRequirement=$('rVerify').value.trim();
  d.contacts=parseBox('rContacts','Contacts'); d.services=parseBox('rServices','Services'); d.policies=parseBox('rPolicies','Policies');
  if(!d.name)throw new Error('Client name is required before saving.');
  return d;
}
async function saveDraft(status,advance){
  msg('reviewMsg','');
  try{
    state.draft=collectDraft();
    var j=await api('/api/portal?action=drafts',{method:'POST',body:JSON.stringify({id:state.draftId,data:state.draft,status:status})});
    state.draftId=j.id; msg('reviewMsg','Draft saved.','ok'); await loadClients();
    if(advance){renderPublishStep();setOnboardStep(3);}
  }catch(err){msg('reviewMsg',err.message,'err');}
}
async function saveClientEdit(){
  msg('reviewMsg','');
  var btn=$('saveDraftBtn'), old=btn.textContent; btn.disabled=true; btn.textContent='Saving…';
  try{
    var data=collectDraft();
    // Reuses the existing save-draft endpoint (no new backend route): passing this
    // already-published client's id with status:'published' asks it to write the
    // updated data back to the same record instead of creating a new draft.
    await api('/api/portal?action=drafts',{method:'POST',body:JSON.stringify({id:state.draftId,data:data,status:'published'})});
    msg('reviewMsg','Saved — this Client Profile is live with these changes.','ok');
    await loadClients();
    setTimeout(closeOnboard,700);
  }catch(err){msg('reviewMsg',err.message,'err');}
  finally{btn.disabled=false;btn.textContent=old;}
}
function renderPublishStep(){
  var d=state.draft||{}, industry=d.industry||'Automotive Service';
  $('publishSummary').textContent=(d.name||'This client')+' is approved for publication.';
  if(industry==='Automotive Service'){
    $('publishLimit').className='notice';
    $('publishLimit').textContent='Publishing will add this Client Profile to the current production-style automotive workspace.';
    $('publishBtn').hidden=false;
  }else{
    $('publishLimit').className='notice warn';
    $('publishLimit').textContent='This profile is saved and approved, but the current production workspace is automotive-specific. It will stay as an approved draft until the multi-industry runtime is connected to this portal.';
    $('publishBtn').hidden=true;
  }
}
async function publishDraft(){
  msg('publishMsg','');
  try{
    await api('/api/portal?action=publish',{method:'POST',body:JSON.stringify({id:state.draftId})});
    msg('publishMsg','Published. Agents can now be assigned to this Client Profile.','ok'); await loadClients(); setTimeout(closeOnboard,700);
  }catch(err){msg('publishMsg',err.message,'err');}
}
async function loadTeam(){
  try{var j=await api('/api/portal?action=team');state.team=j.users||[];renderTeam();}catch(err){console.error(err);}
}
function renderAssignmentChecks(){
  $('assignmentChecks').innerHTML=state.clients.map(function(c){return '<label class="checkItem"><input type="checkbox" name="assignment" value="'+esc(c.id)+'"><span>'+esc((c.data&&c.data.name)||c.id)+'</span></label>';}).join('')||'<span class="muted small">No published clients yet.</span>';
}
function renderTeam(){
  var html=state.team.map(function(u){
    var names=(u.assignments||[]).map(function(id){var c=state.clients.find(function(x){return x.id===id;});return (c&&c.data&&c.data.name)||id;});
    return '<article class="teamCard"><div><h3>'+esc(u.name)+' <span class="rolePill" style="color:#5b3fa5;background:#f0ebff;border-color:#dfd4f5">'+esc(u.role)+'</span></h3><p>'+esc(u.email)+(u.active?'':' · inactive')+'</p><div class="teamAssignments">'+names.map(function(n){return '<span class="assignmentChip">'+esc(n)+'</span>';}).join('')+'</div></div></article>';
  }).join('');
  $('teamList').innerHTML=html||'<div class="panel muted">No team members yet.</div>';
  renderAssignmentChecks();
}
async function createUser(e){
  e.preventDefault(); msg('teamMsg','');
  var assignments=Array.from(document.querySelectorAll('input[name="assignment"]:checked')).map(function(i){return i.value;});
  var body={name:$('newUserName').value,email:$('newUserEmail').value,role:$('newUserRole').value,password:$('newUserPassword').value,assignments:assignments};
  try{
    var j=await api('/api/portal?action=team',{method:'POST',body:JSON.stringify(body)});
    state.team=j.users||[]; renderTeam(); $('addUserForm').reset(); $('addUserPanel').hidden=true; msg('teamMsg','Account created.','ok');
  }catch(err){msg('teamMsg',err.message,'err');}
}
document.addEventListener('DOMContentLoaded',init);
})();
