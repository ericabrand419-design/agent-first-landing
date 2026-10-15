/* Agent First Free Tools: numbers you enter in one calculator carry into the others.
   Stored only in this browser (localStorage). Nothing is sent anywhere.
   Each tool page includes this file; the page's own math and display stay exactly as they were. */
(function () {
  'use strict';
  var KEY = 'afLabsNumbers.v1';
  var TOOL_NAMES = {
    stc: 'Supervisor Tax Calculator', rce: 'New-Hire Ramp Cost Estimator', ccc: 'Chaos Cost Calculator',
    cib: 'Can I Book It?', drtc: 'Decision Resolution Time Calculator'
  };
  /* field id -> shared key, per page prefix */
  var PAGES = {
    stc: { btn: 'stc-calc', fields: { 'stc-agents': 'agents', 'stc-freq': 'freq', 'stc-minutes': 'minutes', 'stc-wage': 'wage' } },
    rce: { btn: 'rce-calc', fields: { 'rce-hires': 'hires', 'rce-weeks': 'weeks', 'rce-cost': 'weeklyCost', 'rce-clients': 'clients' } },
    ccc: { btn: 'ccc-calc', fields: { 'ccc-agents': 'agents', 'ccc-freq': 'freq', 'ccc-minutes': 'minutes', 'ccc-wage': 'wage', 'ccc-hires': 'hires', 'ccc-weeks': 'weeks', 'ccc-rampcost': 'weeklyCost', 'ccc-clients': 'clients' } },
    cib: { btn: 'cib-calc', fields: { 'cib-bookings': 'bookings', 'cib-missrate': 'missRate', 'cib-fixcost': 'fixCost', 'cib-profiles': 'clients' } },
    drtc: { btn: 'drtc-calc', fields: { 'drtc-agents': 'agents', 'drtc-volume': 'volume', 'drtc-wage': 'wage' } }
  };

  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* storage unavailable */ } }
  function num(id) { var el = document.getElementById(id); if (!el) return NaN; var v = parseFloat(el.value); return isNaN(v) ? NaN : v; }
  function money(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

  function results(prefix, inp) {
    var r = {};
    if (prefix === 'stc' || prefix === 'ccc') {
      if (inp.agents >= 0 && inp.freq >= 0 && inp.minutes >= 0 && inp.wage > 0)
        r.supTaxAnnual = inp.agents * inp.freq * inp.minutes / 60 * 260 * inp.wage;
    }
    if (prefix === 'rce' || prefix === 'ccc') {
      if (inp.hires >= 0 && inp.weeks >= 0 && inp.weeklyCost >= 0) r.rampAnnual = inp.hires * inp.weeks * inp.weeklyCost;
    }
    if (prefix === 'cib') {
      if (inp.bookings >= 0 && inp.missRate >= 0 && inp.fixCost >= 0) r.bookingAnnual = inp.bookings * inp.missRate / 100 * 12 * inp.fixCost;
    }
    if (prefix === 'drtc') {
      var s = ['drtc-find', 'drtc-interpret', 'drtc-confirm', 'drtc-act'].map(num).reduce(function (a, b) { return a + (b || 0); }, 0);
      if (s > 0) r.decisionSeconds = s;
    }
    return r;
  }

  function note(container, html) {
    if (!container) return;
    var n = document.createElement('div');
    n.className = 'afn-note';
    n.style.cssText = 'margin:0 0 16px;padding:10px 14px;border-radius:12px;background:#f4efff;color:#4b2a98;font-size:13.5px;line-height:1.5;';
    n.innerHTML = html + ' <a href="#" class="afn-reset" style="color:#7c3aed;font-weight:750;margin-left:4px;">Start fresh</a>';
    container.insertBefore(n, container.firstChild);
    n.querySelector('.afn-reset').addEventListener('click', function (e) {
      e.preventDefault();
      try { localStorage.removeItem(KEY); } catch (err) { /* ignore */ }
      location.reload();
    });
  }

  function setupCalculator(prefix) {
    var cfg = PAGES[prefix], data = load(), inputs = data.inputs || {}, from = data.inputFrom || {};
    var filled = [], sources = {};
    Object.keys(cfg.fields).forEach(function (id) {
      var el = document.getElementById(id), k = cfg.fields[id];
      if (!el || inputs[k] == null || inputs[k] === '') return;
      if (String(el.value) !== String(inputs[k])) { el.value = inputs[k]; filled.push(id); if (from[k] && TOOL_NAMES[from[k]]) sources[TOOL_NAMES[from[k]]] = 1; }
    });
    if (filled.length) {
      var first = document.getElementById(filled[0]);
      var names = Object.keys(sources);
      var others = names.filter(function (n) { return n !== TOOL_NAMES[prefix]; });
      note(first && first.closest('.card'), 'We filled in ' + filled.length + (filled.length === 1 ? ' number' : ' numbers') + ' you already entered' + (others.length ? ' in the ' + others.join(' and the ') : ' last time') + '. Change anything that doesn’t fit.');
    }
    var btn = document.getElementById(cfg.btn);
    if (!btn) return;
    btn.addEventListener('click', function () {
      setTimeout(function () {
        var d = load(); d.inputs = d.inputs || {}; d.inputFrom = d.inputFrom || {}; d.results = d.results || {}; d.resultFrom = d.resultFrom || {};
        var inp = {};
        Object.keys(cfg.fields).forEach(function (id) {
          var k = cfg.fields[id], v = num(id);
          inp[k] = v;
          if (!isNaN(v)) { d.inputs[k] = v; d.inputFrom[k] = prefix; }
        });
        /* fill gaps from what is already known, so Chaos can reuse the Supervisor Tax wage, etc. */
        Object.keys(d.inputs).forEach(function (k) { if (inp[k] == null || isNaN(inp[k])) inp[k] = d.inputs[k]; });
        var r = results(prefix, inp);
        Object.keys(r).forEach(function (k) { d.results[k] = r[k]; d.resultFrom[k] = prefix; });
        save(d);
      }, 0);
    });
  }

  function setupBusinessCase() {
    var d = load(), r = d.results || {}, rf = d.resultFrom || {};
    var map = { 'pbc-suptax': 'supTaxAnnual', 'pbc-ramp': 'rampAnnual', 'pbc-drt': 'decisionSeconds', 'pbc-booking': 'bookingAnnual' };
    var used = [];
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id), k = map[id];
      if (!el || r[k] == null) return;
      el.value = Math.round(r[k]);
      var src = TOOL_NAMES[rf[k]] || 'another tool';
      var hint = document.createElement('div');
      hint.style.cssText = 'margin-top:6px;font-size:12px;color:#7c3aed;font-weight:650;';
      hint.textContent = 'Pulled from ' + src + (k === 'decisionSeconds' ? '' : ' · ' + money(r[k]) + ' a year');
      el.insertAdjacentElement('afterend', hint);
      used.push(src);
    });
    if (used.length) {
      var first = document.getElementById(Object.keys(map)[0]);
      note(first && first.closest('.card'), 'Your numbers from ' + used.filter(function (v, i, a) { return a.indexOf(v) === i; }).join(', ') + ' are already filled in.');
    }
  }

  function init() {
    if (document.getElementById('pbc-calc')) { setupBusinessCase(); return; }
    Object.keys(PAGES).forEach(function (p) { if (document.getElementById(PAGES[p].btn)) setupCalculator(p); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
