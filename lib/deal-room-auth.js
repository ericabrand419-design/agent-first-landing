const crypto = require('crypto');

function authEnabled() {
  return String(process.env.DEAL_ROOM_AUTH_ENABLED || '').toLowerCase() === 'true';
}

function users() {
  try {
    const parsed = JSON.parse(process.env.DEAL_ROOM_USERS || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function verifyPassword(password, record) {
  if (!record || !record.salt || !record.hash) return false;
  try {
    const actual = crypto.pbkdf2Sync(String(password || ''), record.salt, 160000, 32, 'sha256');
    const expected = Buffer.from(record.hash, 'base64url');
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

function signSession(payload) {
  const secret = process.env.DEAL_ROOM_SESSION_SECRET;
  if (!secret) throw new Error('DEAL_ROOM_SESSION_SECRET is not configured');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return body + '.' + sig;
}

function verifySession(token) {
  try {
    const secret = process.env.DEAL_ROOM_SESSION_SECRET;
    if (!secret || !token) return null;
    const parts = String(token).split('.');
    if (parts.length !== 2) return null;
    const expected = crypto.createHmac('sha256', secret).update(parts[0]).digest();
    const supplied = Buffer.from(parts[1], 'base64url');
    if (expected.length !== supplied.length || !crypto.timingSafeEqual(expected, supplied)) return null;
    const payload = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    if (!payload.exp || Date.now() > Number(payload.exp)) return null;
    return payload;
  } catch {
    return null;
  }
}

function readCookie(req, name) {
  const raw = req.headers.cookie || '';
  const pair = raw.split(';').map(v => v.trim()).find(v => v.startsWith(name + '='));
  return pair ? decodeURIComponent(pair.slice(name.length + 1)) : '';
}

function sessionCookie(token) {
  const maxAge = 60 * 60 * 12;
  return 'af_deal_room=' + encodeURIComponent(token) + '; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=' + maxAge;
}

function clearSessionCookie() {
  return 'af_deal_room=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0';
}

module.exports = {
  authEnabled,
  users,
  normalizeEmail,
  verifyPassword,
  signSession,
  verifySession,
  readCookie,
  sessionCookie,
  clearSessionCookie,
};