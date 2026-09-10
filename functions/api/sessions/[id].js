// GET /api/sessions/:id — نتائج الجلسة (حيّة)
function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

export async function onRequestGet({ params, env }) {
  var id = params.id;

  var session = await env.DB.prepare('SELECT id, title, status FROM sessions WHERE id = ?')
    .bind(id).first();
  if (!session) return json({ ok: false, error: 'الجلسة غير موجودة' }, 404);

  var res = await env.DB.prepare(
    'SELECT o.id, o.name, o.emoji, COUNT(v.id) AS votes ' +
    'FROM options o LEFT JOIN votes v ON v.option_id = o.id ' +
    'WHERE o.session_id = ? GROUP BY o.id ORDER BY o.id'
  ).bind(id).all();

  var options = (res.results || []).map(function (o) {
    return { id: o.id, name: o.name, emoji: o.emoji, votes: Number(o.votes) || 0 };
  });
  var total = options.reduce(function (s, o) { return s + o.votes; }, 0);

  return json({ ok: true, session: { id: session.id, title: session.title, status: session.status, options: options, total: total } });
}
