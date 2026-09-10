// POST /api/sessions/:id/vote — تصويت (بلا تسجيل، صوت واحد لكل جهاز)
function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export async function onRequestPost({ params, request, env }) {
  var id = params.id;
  var body = await request.json().catch(function () { return {}; });

  var optionId = parseInt(body.optionId, 10);
  var voter = String(body.voterName || 'ضيف').slice(0, 40);
  var device = String(body.deviceHash || '').slice(0, 64);

  if (!optionId || !device) return json({ ok: false, error: 'بيانات ناقصة' }, 400);

  var session = await env.DB.prepare('SELECT status FROM sessions WHERE id = ?').bind(id).first();
  if (!session) return json({ ok: false, error: 'الجلسة غير موجودة' }, 404);
  if (session.status !== 'open') return json({ ok: false, error: 'التصويت مقفل' }, 403);

  // تأكّد أن الخيار يخص هذه الجلسة (منع العبث)
  var opt = await env.DB.prepare('SELECT id FROM options WHERE id = ? AND session_id = ?')
    .bind(optionId, id).first();
  if (!opt) return json({ ok: false, error: 'خيار غير صالح' }, 400);

  // صوت واحد لكل جهاز — تغيير الصوت يستبدل السابق
  await env.DB.prepare(
    'INSERT INTO votes (session_id, option_id, voter_name, device_hash, created_at) ' +
    'VALUES (?, ?, ?, ?, ?) ' +
    'ON CONFLICT(session_id, device_hash) DO UPDATE SET ' +
    'option_id = excluded.option_id, voter_name = excluded.voter_name, created_at = excluded.created_at'
  ).bind(id, optionId, voter, device, Date.now()).run();

  return json({ ok: true });
}
