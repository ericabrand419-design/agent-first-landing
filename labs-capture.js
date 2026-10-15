/* Agent First Free Tools: the "one idea" card at the end of each game and tool.
   AFLabs.mount(id, {tool, question, context}) turns an empty card into a short, optional prompt.
   Answers go to the same Web3Forms inbox as the email forms. Nothing is sent unless the visitor clicks Send. */
(function () {
  'use strict';
  var ACCESS_KEY = '7207f464-b77a-4a0c-b6b7-3a747ab11496';
  var linked = {};

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function mount(id, opts) {
    var el = document.getElementById(id);
    if (!el) return;
    opts = opts || {};
    var tool = opts.tool || 'Free Tools';
    var ctx = opts.context && opts.context.result ? String(opts.context.result) : '';
    el.style.display = 'block';
    el.innerHTML =
      '<div style="font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:#7c3aed;margin-bottom:8px;">One question, optional</div>' +
      '<div style="font-size:16px;font-weight:750;line-height:1.45;margin-bottom:12px;">' + esc(opts.question || 'What would have made that easier?') + '</div>' +
      '<form class="afl-form" style="display:flex;flex-direction:column;gap:10px;">' +
        '<textarea name="idea" rows="3" required placeholder="A sentence or two is plenty." style="width:100%;padding:12px 14px;border-radius:12px;border:1.5px solid #e5e4f1;font:inherit;font-size:15px;resize:vertical;"></textarea>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
          '<input name="email" type="email" placeholder="Your email (optional)" style="flex:1;min-width:200px;padding:12px 14px;border-radius:12px;border:1.5px solid #e5e4f1;font:inherit;font-size:15px;">' +
          '<button type="submit" class="btn btn-ghost-light" style="white-space:nowrap;">Send my answer</button>' +
        '</div>' +
      '</form>' +
      '<div class="afl-status" style="display:none;margin-top:10px;font-size:14px;"></div>';
    var form = el.querySelector('.afl-form'), status = el.querySelector('.afl-status');
    if (linked[tool]) form.querySelector('[name="email"]').value = linked[tool];
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var idea = form.querySelector('[name="idea"]').value.trim();
      if (!idea) return;
      var btn = form.querySelector('button');
      btn.disabled = true; btn.textContent = 'Sending...';
      var data = new FormData();
      data.append('access_key', ACCESS_KEY);
      data.append('subject', tool + ': visitor idea, Agent First Free Tools');
      data.append('from_name', 'Agent First website');
      data.append('tool', tool);
      data.append('question', opts.question || '');
      data.append('answer', idea);
      if (ctx) data.append('result', ctx);
      var email = form.querySelector('[name="email"]').value.trim();
      if (email) data.append('email', email);
      fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Accept': 'application/json' }, body: data })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (!d || !d.success) throw new Error('send failed');
          form.style.display = 'none';
          status.style.color = '#1f5c42';
          status.textContent = 'Thank you. Erica reads every one of these.';
          status.style.display = 'block';
        })
        .catch(function () {
          btn.disabled = false; btn.textContent = 'Send my answer';
          status.style.color = '#c53636';
          status.textContent = 'That did not send. You can email info@myagentfirst.com instead.';
          status.style.display = 'block';
        });
    });
  }

  function linkEmail(tool, email) { if (tool && email) linked[tool] = String(email); }

  window.AFLabs = { mount: mount, linkEmail: linkEmail };

  /* Until a result exists, the idea card stays out of sight instead of showing as an empty box. */
  function hideEmpty() { var el = document.getElementById('afIdea'); if (el && !el.innerHTML.trim()) el.style.display = 'none'; }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hideEmpty); else hideEmpty();
})();
