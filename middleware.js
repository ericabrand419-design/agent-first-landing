function b64urlToBytes(input) {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, c => c.charCodeAt(0));
}

function bytesToB64url(bytes) {
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function validSession(token, secret) {
  try {
    if (!token || !secret) return false;
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name:'HMAC', hash:'SHA-256' },
      false,
      ['sign']
    );
    const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(parts[0])));
    if (bytesToB64url(sig) !== parts[1]) return false;
    const payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(parts[0])));
    return Boolean(payload.exp && Date.now() < Number(payload.exp));
  } catch {
    return false;
  }
}

function cookieValue(request, name) {
  const raw = request.headers.get('cookie') || '';
  const pair = raw.split(';').map(v => v.trim()).find(v => v.startsWith(name + '='));
  return pair ? decodeURIComponent(pair.slice(name.length + 1)) : '';
}

export default async function middleware(request) {
  if (String(process.env.DEAL_ROOM_AUTH_ENABLED || '').toLowerCase() !== 'true') {
    return;
  }
  const ok = await validSession(cookieValue(request, 'af_deal_room'), process.env.DEAL_ROOM_SESSION_SECRET);
  if (ok) return;

  const url = new URL('/deal-room-access.html', request.url);
  url.searchParams.set('returnTo', new URL(request.url).pathname);
  return Response.redirect(url, 302);
}

export const config = {
  matcher: ['/deal-room', '/deal-room-workspace.html'],
};