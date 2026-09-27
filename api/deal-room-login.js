const {
  authEnabled, users, normalizeEmail, verifyPassword, signSession, sessionCookie, visitorId,
} = require('../lib/deal-room-auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  if (!authEnabled()) {
    return res.status(503).json({ ok: false, error: 'Deal Room access control is not enabled yet.' });
  }

  const body = req.body || {};
  const email = normalizeEmail(body.email);
  const password = String(body.password || '');
  const requestedRole = String(body.role || 'client');
  const record = users().find(u => normalizeEmail(u.email) === email);

  if (!record || !verifyPassword(password, record)) {
    console.warn(JSON.stringify({event:'deal_room_login_failed', visitorId:visitorId(email), role:requestedRole, at:new Date().toISOString()}));
    return res.status(401).json({ ok: false, error: 'Email or password is incorrect.' });
  }

  const allowedRoles = Array.isArray(record.roles) && record.roles.length ? record.roles : ['client'];
  const role = allowedRoles.includes(requestedRole) ? requestedRole : allowedRoles[0];
  const permissions = Array.isArray(record.permissions) ? record.permissions : [];
  const id = String(record.id || visitorId(email));
  const payload = {
    visitorId:id,
    role,
    permissions,
    exp: Date.now() + (12 * 60 * 60 * 1000),
  };
  const token = signSession(payload);
  res.setHeader('Set-Cookie', sessionCookie(token));
  res.setHeader('Cache-Control', 'no-store');
  console.log(JSON.stringify({event:'deal_room_login', visitorId:id, role, permissions, at:new Date().toISOString()}));
  return res.status(200).json({ ok: true, role, permissions });
};