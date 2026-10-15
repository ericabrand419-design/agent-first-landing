/* Agent First Arcade kit: sound, effects, results-screen wiring, and the shared fictional clients.
   Every client below is fictional and mirrors the Agent First demo. */
(function () {
  'use strict';

  /* ---------- sound (Web Audio, no files) ---------- */
  var MUTE_KEY = 'afArcade.muted';
  var muted = false;
  try { muted = localStorage.getItem(MUTE_KEY) === '1'; } catch (e) { /* ignore */ }
  var ctx = null;
  function ac() {
    if (!ctx) { var C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ctx = new C(); }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(freq, dur, type, vol, when) {
    if (muted) return;
    var a = ac(); if (!a) return;
    var t = a.currentTime + (when || 0);
    var o = a.createOscillator(), g = a.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.12, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(a.destination);
    o.start(t); o.stop(t + dur + 0.02);
  }
  var sfx = {
    ring: function () { for (var i = 0; i < 2; i++) { tone(880, 0.12, 'triangle', 0.07, i * 0.16); tone(1100, 0.12, 'triangle', 0.05, i * 0.16 + 0.06); } },
    good: function () { tone(660, 0.12, 'sine', 0.12); tone(990, 0.18, 'sine', 0.1, 0.08); },
    great: function () { tone(660, 0.1, 'sine', 0.12); tone(880, 0.1, 'sine', 0.1, 0.07); tone(1320, 0.22, 'sine', 0.1, 0.14); },
    bad: function () { tone(180, 0.28, 'sawtooth', 0.07); tone(140, 0.3, 'sawtooth', 0.05, 0.05); },
    click: function () { tone(1200, 0.04, 'square', 0.03); },
    tick: function () { tone(1500, 0.03, 'square', 0.025); },
    hangup: function () { tone(480, 0.15, 'square', 0.05); tone(480, 0.15, 'square', 0.05, 0.25); tone(480, 0.15, 'square', 0.05, 0.5); },
    alarm: function () { tone(520, 0.18, 'square', 0.06); tone(420, 0.18, 'square', 0.06, 0.2); },
    end: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.22, 'triangle', 0.09, i * 0.11); }); }
  };
  function muteButton() {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'afk-mute';
    b.setAttribute('aria-label', 'Sound on or off');
    var paint = function () { b.textContent = muted ? '🔇 Sound off' : '🔊 Sound on'; };
    paint();
    b.addEventListener('click', function () { muted = !muted; try { localStorage.setItem(MUTE_KEY, muted ? '1' : '0'); } catch (e) { /* ignore */ } paint(); if (!muted) sfx.click(); });
    document.body.appendChild(b);
  }

  /* ---------- effects ---------- */
  function floatText(anchor, text, color) {
    var r = anchor && anchor.getBoundingClientRect ? anchor.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0 };
    var d = document.createElement('div');
    d.className = 'afk-float';
    d.textContent = text;
    d.style.left = (r.left + r.width / 2) + 'px';
    d.style.top = (r.top + window.scrollY) + 'px';
    d.style.color = color || '#7c3aed';
    document.body.appendChild(d);
    setTimeout(function () { d.remove(); }, 1000);
  }
  function shake(el) { if (!el) return; el.classList.remove('afk-shake'); void el.offsetWidth; el.classList.add('afk-shake'); }
  function pop(el) { if (!el) return; el.classList.remove('afk-pop'); void el.offsetWidth; el.classList.add('afk-pop'); }
  function flash(kind) {
    var f = document.querySelector('.afk-flash');
    if (!f) { f = document.createElement('div'); f.className = 'afk-flash'; document.body.appendChild(f); }
    f.className = 'afk-flash show ' + kind;
    setTimeout(function () { f.className = 'afk-flash'; }, 220);
  }
  function stamp(container, text, kind) {
    var s = document.createElement('div');
    s.className = 'afk-stamp ' + (kind || 'bad');
    s.textContent = text;
    container.appendChild(s);
    setTimeout(function () { s.remove(); }, 900);
  }
  function confetti() {
    var colors = ['#ff6b54', '#e447d5', '#7c3aed', '#ffb547', '#2fbf8f'];
    for (var i = 0; i < 90; i++) {
      var c = document.createElement('div');
      c.className = 'afk-confetti';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = colors[i % colors.length];
      c.style.animationDelay = (Math.random() * 0.4) + 's';
      c.style.animationDuration = (1.6 + Math.random() * 1.2) + 's';
      c.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      document.body.appendChild(c);
      (function (el) { setTimeout(function () { el.remove(); }, 3200); })(c);
    }
  }

  /* ---------- helpers ---------- */
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function best(key, score) {
    var k = 'afArcade.best.' + key, prev = 0;
    try { prev = +localStorage.getItem(k) || 0; if (score > prev) localStorage.setItem(k, String(score)); } catch (e) { /* ignore */ }
    return { previous: prev, isNew: score > prev };
  }

  /* ---------- results screen: share, copy, email, idea card ---------- */
  function results(opts) {
    var $ = function (id) { return document.getElementById(id); };
    if ($('shareText')) $('shareText').value = opts.share || '';
    if ($('resultSummaryField')) $('resultSummaryField').value = opts.summary || opts.share || '';
    if (window.AFLabs && $('afIdea')) window.AFLabs.mount('afIdea', { tool: opts.tool, question: opts.question, context: { result: opts.share } });
  }
  function wireCommon(toolName) {
    var $ = function (id) { return document.getElementById(id); };
    var copy = $('copyBtn');
    if (copy) copy.addEventListener('click', function () {
      var field = $('shareText'); field.select();
      var done = function () { $('copyStatus').style.display = 'block'; setTimeout(function () { $('copyStatus').style.display = 'none'; }, 1800); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(field.value).then(done).catch(function () { try { document.execCommand('copy'); done(); } catch (e) { /* ignore */ } });
      else { try { document.execCommand('copy'); done(); } catch (e) { /* ignore */ } }
    });
    var form = $('emailForm');
    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]'), status = $('emailStatus'), original = btn.textContent;
      btn.disabled = true; btn.textContent = 'Sending...';
      var fail = function () { btn.disabled = false; btn.textContent = original; status.style.color = '#c53636'; status.textContent = 'Something went wrong. Please try again, or email info@myagentfirst.com directly.'; status.style.display = 'block'; };
      fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form) })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (!d || !d.success) return fail();
          if (window.AFLabs) window.AFLabs.linkEmail(toolName, form.querySelector('[name="email"]').value);
          form.style.display = 'none'; status.style.color = '#1f5c42'; status.textContent = "Sent. I'll follow up directly too."; status.style.display = 'block';
        }).catch(fail);
    });
  }

  /* ---------- shared fictional clients (mirrors the Agent First demo) ---------- */
  var TOPICS = {
    saturday: { label: 'Saturday service', ask: ['Can I bring my car in Saturday afternoon for the check engine light?', 'Are you guys open Saturday for a diagnostic?'] },
    loaner: { label: 'Loaner car', ask: ['Can I get a loaner while my car is in the shop?', 'Do I get a free loaner for this repair?'] },
    shuttle: { label: 'Shuttle', ask: ['Can someone drive me to work after I drop the car off?', 'Do you have a shuttle?'] },
    rideshare: { label: 'Rideshare', ask: ['Can you get me an Uber home?', 'Will you pay for a Lyft while I wait?'] },
    express: { label: 'Express service', ask: ['Can I just swing by for an oil change, no appointment?', 'Do you do walk-in oil changes?'] },
    price: { label: 'Price quotes', ask: ['How much is a brake job?', 'Just give me a ballpark on the repair.'] },
    same_day: { label: 'Same-day sick visit', ask: ['My son has a fever. Can he be seen today?', 'I woke up sick. Do you have anything today?'] },
    late: { label: 'Running late', ask: ["I'm running about 12 minutes late. Can I still come in?", "Traffic is bad, I'll be 12 minutes late. Is that okay?"] },
    refill: { label: 'Refills', ask: ['I need a refill on my blood pressure medication.', 'Can you send in a refill for me?'] },
    records: { label: 'Medical records', ask: ['I need my records sent to a new doctor.', 'How do I get a copy of my records?'] },
    meds: { label: 'Medication questions', ask: ['Is it normal to feel dizzy on this new medication?', 'Can I take this with ibuprofen?'] },
    arrival: { label: 'Arrival time', ask: ['How early should I get there?', 'When should I show up before my appointment?'] },
    hot_water: { label: 'No hot water', ask: ["It's 9:40 at night and we have no hot water.", 'Our water heater just died. Can someone come tonight?'] },
    leak: { label: 'Active leak', ask: ['Water is pouring out under my sink!', 'A pipe burst in the basement!'] },
    window: { label: 'Arrival window', ask: ['What time will the technician get here?', 'How long is the arrival window?'] },
    no_heat: { label: 'No heat', ask: ["My heat is out and it's 38 degrees outside.", 'The furnace stopped working tonight.'] },
    lockout: { label: 'Lockouts', ask: ['I locked myself out of my apartment.', "I'm locked out. Can someone let me in?"] },
    charge: { label: 'Tenant charges', ask: ['Am I going to get charged for this repair?', 'Who pays for this, me or you?'] },
    parking: { label: 'Guest parking', ask: ['Where can my guest park overnight?', 'Can my sister park here this weekend?'] }
  };
  var CLIENTS = [
    { id: 'crestline', name: 'Crestline Toyota', industry: 'Auto service', color: '#e2483d', rules: {
      saturday: 'Open Saturday 8 AM to 2 PM. Repair and diagnostic work Saturday mornings only.',
      loaner: 'Free loaner for repairs over 4 hours and over $200. Verify license and insurance first.',
      shuttle: 'Shuttle covers about 10 miles, Monday through Friday, 8 AM to 5 PM.',
      rideshare: 'No rideshare here. Offer the shuttle instead.',
      express: 'Walk-in express oil changes and tire rotations, Monday through Saturday.',
      price: 'Never quote a price. Send a callback alert to a service advisor.' } },
    { id: 'marlowe', name: 'Marlowe Ford', industry: 'Auto service', color: '#2459c4', rules: {
      saturday: 'Saturday 8 AM to 3 PM is maintenance only. No diagnostics on Saturday.',
      loaner: 'Loaners need Service approval first. Send an alert to a service advisor.',
      shuttle: 'No shuttle at this location.',
      rideshare: 'Rideshare is available once a service advisor confirms it.',
      express: 'No express lane. Book an appointment instead.',
      price: 'Never quote a price. Send a callback alert to a service advisor.' } },
    { id: 'riverside', name: 'Riverside Family Clinic', industry: 'Healthcare', color: '#177a55', rules: {
      same_day: 'Book routine sick visits directly from the approved list.',
      late: 'More than 15 minutes late: offer to reschedule.',
      refill: 'Take the refill request and send it to the clinical team.',
      records: 'Transfer records requests to Medical Records.',
      meds: 'Medication questions go to Nurse Triage. Never give advice.',
      arrival: 'Arrive 15 minutes early, 30 minutes for new patients.' } },
    { id: 'sunridge', name: 'Sunridge Pediatrics', industry: 'Healthcare', color: '#c25e00', rules: {
      same_day: 'Every same-day sick visit goes to Nurse Triage first. Do not book it.',
      late: 'More than 10 minutes late: offer to reschedule.',
      refill: 'Verify the pharmacy and medication list before sending a refill.',
      records: 'Send records requests to the Practice Manager by alert.',
      meds: 'Medication questions go to Nurse Triage. Never give advice.',
      arrival: 'Arrive 10 minutes early.' } },
    { id: 'apex', name: 'Apex Plumbing & Drain', industry: 'Home services', color: '#0f7c9c', rules: {
      hot_water: 'No hot water after hours: dispatch the on-call technician.',
      leak: 'Active leak: emergency dispatch now. Tell them to shut off the water if safe.',
      price: 'No price quotes before the technician diagnoses it.',
      window: 'Two-hour arrival window. The tech calls when on the way.' } },
    { id: 'coastal', name: 'Coastal Heating & Air', industry: 'Home services', color: '#7c3aed', rules: {
      hot_water: 'No hot water is not covered after hours. Offer a business-hours visit.',
      leak: 'Plumbing leaks are out of scope. Transfer to the Dispatch Supervisor.',
      price: 'No price quotes before the technician diagnoses it.',
      window: 'Four-hour arrival window. The tech calls when on the way.' } },
    { id: 'lockwood', name: 'Lockwood Management', industry: 'Property', color: '#a3367a', rules: {
      no_heat: 'No heat below 40°F: dispatch the on-call vendor now.',
      lockout: 'Verify ID and the lockout policy before arranging access.',
      charge: 'Never say whether the tenant will be charged. Alert the Property Manager.',
      parking: 'Guests use visitor spaces. Overnight guests need a pass from the office.' } },
    { id: 'greenpark', name: 'GreenPark Properties', industry: 'Property', color: '#4d7a12', rules: {
      no_heat: 'No heat after hours: transfer to the on-call Property Manager first.',
      lockout: 'No after-hours lockout service. Note the call for the office.',
      charge: 'Never say whether the tenant will be charged. Property Management decides.',
      parking: 'One assigned space per unit. Guests use clubhouse spaces, 24 hours max.' } }
  ];
  /* Rival pairs: same industry, same questions, different answers. */
  var PAIRS = [['crestline', 'marlowe'], ['riverside', 'sunridge'], ['apex', 'coastal'], ['lockwood', 'greenpark']];
  function client(id) { for (var i = 0; i < CLIENTS.length; i++) if (CLIENTS[i].id === id) return CLIENTS[i]; return null; }

  /* ---------- styles ---------- */
  var css = '' +
    '.afk-mute{position:fixed;right:16px;bottom:16px;z-index:60;border:1px solid #e5e4f1;background:#fff;color:#171a2b;border-radius:999px;padding:8px 14px;font:700 13px Inter,system-ui,sans-serif;box-shadow:0 6px 18px rgba(20,22,45,.12);cursor:pointer}' +
    '.afk-float{position:absolute;z-index:70;transform:translate(-50%,0);font:900 20px Inter,system-ui,sans-serif;pointer-events:none;animation:afk-float 1s ease-out forwards;text-shadow:0 2px 8px rgba(255,255,255,.9)}' +
    '@keyframes afk-float{from{opacity:1;transform:translate(-50%,0)}to{opacity:0;transform:translate(-50%,-60px)}}' +
    '.afk-shake{animation:afk-shake .38s ease}@keyframes afk-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(7px)}60%{transform:translateX(-5px)}80%{transform:translateX(3px)}}' +
    '.afk-pop{animation:afk-pop .35s ease}@keyframes afk-pop{0%{transform:scale(1)}45%{transform:scale(1.08)}100%{transform:scale(1)}}' +
    '.afk-flash{position:fixed;inset:0;pointer-events:none;opacity:0;transition:opacity .12s;z-index:55}.afk-flash.show{opacity:1}.afk-flash.good{background:rgba(23,122,85,.10)}.afk-flash.bad{background:rgba(197,54,74,.14)}.afk-flash.warn{background:rgba(161,92,0,.10)}' +
    '.afk-stamp{position:absolute;left:50%;top:42%;transform:translate(-50%,-50%) rotate(-8deg);font:900 28px Inter,system-ui,sans-serif;letter-spacing:.06em;padding:8px 18px;border:4px solid currentColor;border-radius:12px;background:rgba(255,255,255,.92);z-index:20;animation:afk-stamp .9s ease forwards;pointer-events:none;white-space:nowrap}' +
    '.afk-stamp.bad{color:#c5364a}.afk-stamp.good{color:#177a55}.afk-stamp.warn{color:#a15c00}' +
    '@keyframes afk-stamp{0%{opacity:0;transform:translate(-50%,-50%) rotate(-8deg) scale(1.8)}18%{opacity:1;transform:translate(-50%,-50%) rotate(-8deg) scale(1)}75%{opacity:1}100%{opacity:0}}' +
    '.afk-confetti{position:fixed;top:-12px;width:9px;height:14px;border-radius:2px;z-index:80;pointer-events:none;animation-name:afk-fall;animation-timing-function:cubic-bezier(.2,.6,.4,1);animation-fill-mode:forwards}' +
    '@keyframes afk-fall{to{top:105vh;transform:rotate(720deg)}}' +
    '@media (prefers-reduced-motion:reduce){.afk-shake,.afk-pop,.afk-float,.afk-confetti{animation:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', muteButton); else muteButton();

  window.AFArcade = { sfx: sfx, floatText: floatText, shake: shake, pop: pop, flash: flash, stamp: stamp, confetti: confetti,
    shuffle: shuffle, pick: pick, esc: esc, best: best, results: results, wireCommon: wireCommon,
    TOPICS: TOPICS, CLIENTS: CLIENTS, PAIRS: PAIRS, client: client };
})();
