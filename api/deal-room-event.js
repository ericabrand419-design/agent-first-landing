module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok:false, error:'Method not allowed' });
  }
  const body = req.body || {};
  const name = String(body.name || '').slice(0,120);
  const data = body.data && typeof body.data === 'object' ? body.data : {};
  const safe = {};
  Object.keys(data).slice(0,20).forEach(function(key){
    const k = String(key).slice(0,60);
    const v = data[key];
    if (['string','number','boolean'].includes(typeof v)) safe[k] = String(v).slice(0,300);
  });
  console.log(JSON.stringify({
    event:'deal_room_event',
    name,
    data:safe,
    at:new Date().toISOString(),
    userAgent:String(req.headers['user-agent'] || '').slice(0,300)
  }));
  res.setHeader('Cache-Control','no-store');
  return res.status(200).json({ok:true});
};