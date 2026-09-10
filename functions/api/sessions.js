// POST /api/sessions — إنشاء جلسة تصويت جديدة
function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

function genId() {
  var chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  var s = '';
  for (var i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export async function onRequestPost({ request, env }) {
  var body = await request.json().catch(function () { return {}; });
  var title = String(body.title || 'وش ناكل اليوم؟').slice(0, 120);
  var options = Array.isArray(body.options) ? body.options.slice(0, 5) : [];

  if (options.length < 2) return json({ ok: false, error: 'لازم خيارين على الأقل' }, 400);

  var id = genId();
  var now = Date.now();

  await env.DB.prepare('INSERT INTO sessions (id, title, status, created_at) VALUES (?, ?, ?, ?)')
    .bind(id, title, 'open', now).run();

  var stmts = options.map(function (o) {
    return env.DB.prepare('INSERT INTO options (session_id, name, emoji) VALUES (?, ?, ?)')
      .bind(id, String(o.name || 'أكلة').slice(0, 60), String(o.emoji || '🍽️').slice(0, 8));
  });
  await env.DB.batch(stmts);

  return json({ ok: true, id: id });
}
