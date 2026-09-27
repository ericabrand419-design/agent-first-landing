const {
  authEnabled, verifySession, readCookie,
} = require('../lib/deal-room-auth');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const enabled = authEnabled();
  if (!enabled) return res.status(200).json({ authEnabled:false, authenticated:false });
  const payload = verifySession(readCookie(req, 'af_deal_room'));
  if (!payload) return res.status(200).json({ authEnabled:true, authenticated:false });
  return res.status(200).json({
    authEnabled:true,
    authenticated:true,
    visitorId:payload.visitorId,
    role:payload.role,
    permissions:payload.permissions || [],
  });
};