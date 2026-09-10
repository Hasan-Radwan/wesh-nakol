/* ══ وش ناكل؟ — صفحة التصويت العامة (بلا تسجيل) ══ */
(function () {
  'use strict';

  var stage = document.getElementById('stage');
  var LS = window.localStorage;

  // معرّف الجلسة من ?s=id (أو من المسار /vote/:id احتياطاً)
  var m = location.pathname.match(/\/vote\/([A-Za-z0-9]+)/);
  var sessionId = new URLSearchParams(location.search).get('s') || (m && m[1]) || '';

  // بصمة جهاز ثابتة لمنع التصويت المكرر
  var device = LS.getItem('wn_device');
  if (!device) { device = 'd_' + Math.random().toString(36).slice(2) + Date.now().toString(36); LS.setItem('wn_device', device); }

  var myName = LS.getItem('wn_name') || '';
  var myVote = null;           // option_id اللي صوّت له هالجهاز (نعرفه محلياً)
  var pollTimer = null;

  if (!sessionId) { return renderError('الرابط ناقص — تأكد من رابط التصويت.'); }

  /* ── جلب الحالة ── */
  function load() {
    fetch('/api/sessions/' + sessionId, { headers: { 'accept': 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d.ok) return renderError(d.error || 'تعذّر تحميل التصويت.');
        render(d.session);
      })
      .catch(function () { renderError('ما قدرنا نتصل بالخادم. جرّب تحدّث الصفحة.'); });
  }

  /* ── تصويت ── */
  function castVote(optionId) {
    if (!myName) return askName(function () { castVote(optionId); });
    myVote = optionId;
    fetch('/api/sessions/' + sessionId + '/vote', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ optionId: optionId, voterName: myName, deviceHash: device }),
    })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d.ok) { toast(d.error || 'ما ضبط التصويت'); return; }
        toast('انحفظ صوتك ✅');
        load();
      })
      .catch(function () { toast('تعذّر الإرسال — تأكد من النت'); });
  }

  /* ── واجهة الاسم ── */
  function askName(after) {
    var name = window.prompt('وش اسمك؟ (يظهر لأهل البيت)', myName || '');
    if (name && name.trim()) { myName = name.trim().slice(0, 40); LS.setItem('wn_name', myName); if (after) after(); }
  }

  /* ── الرسم ── */
  function render(s) {
    var total = s.total || 0;
    var lead = Math.max.apply(null, s.options.map(function (o) { return o.votes; }).concat([0]));
    var closed = s.status !== 'open';

    var head =
      '<div class="rounded-4xl bg-white p-6 shadow-card">' +
        '<div class="flex items-center justify-between">' +
          '<h1 class="font-display text-2xl font-800">' + esc(s.title) + '</h1>' +
          (closed
            ? '<span class="rounded-full bg-ink/10 px-3 py-1 text-xs font-700 text-ink-soft">مقفل</span>'
            : '<span class="flex items-center gap-1.5 rounded-full bg-herb/10 px-3 py-1 text-xs font-700 text-herb-600"><span class="relative flex h-2 w-2"><span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-herb opacity-75"></span><span class="relative inline-flex h-2 w-2 rounded-full bg-herb"></span></span>مباشر</span>') +
        '</div>' +
        '<p class="mt-1 text-sm text-ink-soft">' + (closed ? 'انتهى التصويت' : 'اضغط على اختيارك — تقدر تغيّره') + '</p>';

    var opts = s.options.map(function (o) {
      var pct = total ? Math.round((o.votes / total) * 100) : 0;
      var isLead = total > 0 && o.votes === lead;
      var mine = myVote === o.id;
      return '' +
        '<button class="vote-opt w-full text-right ' + (closed ? 'pointer-events-none' : '') + '" data-id="' + o.id + '" ' + (mine ? 'aria-pressed="true"' : '') + '>' +
          '<div class="mb-1.5 flex items-center justify-between text-sm font-700">' +
            '<span>' + esc(o.emoji) + ' ' + esc(o.name) + (mine ? ' <span class="text-herb-600">· صوتك</span>' : '') + '</span>' +
            '<span class="text-ink-soft">' + o.votes + ' (' + pct + '%)</span>' +
          '</div>' +
          '<div class="poll-bar ' + (mine ? 'ring-2 ring-herb/50' : '') + '"><div class="poll-fill ' + (isLead ? 'is-lead' : '') + '" data-pct="' + pct + '"></div></div>' +
        '</button>';
    }).join('');

    stage.innerHTML = head +
      '<div class="mt-5 space-y-3">' + opts + '</div>' +
      '<p class="mt-5 text-center text-sm text-ink-soft">' + total + ' صوت' + (myName ? ' · تصوّت باسم «' + esc(myName) + '»' : '') + '</p>' +
    '</div>';

    // تحريك الأشرطة
    requestAnimationFrame(function () {
      Array.prototype.forEach.call(document.querySelectorAll('.poll-fill'), function (f) { f.style.width = f.getAttribute('data-pct') + '%'; });
    });

    if (!closed) {
      Array.prototype.forEach.call(document.querySelectorAll('.vote-opt'), function (b) {
        b.addEventListener('click', function () { castVote(parseInt(b.getAttribute('data-id'), 10)); });
      });
    }
  }

  function renderError(msg) {
    if (pollTimer) clearInterval(pollTimer);
    stage.innerHTML =
      '<div class="rounded-4xl bg-white p-8 text-center shadow-card">' +
        '<div class="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-tomato/10 text-tomato">' +
          '<svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>' +
        '</div>' +
        '<p class="font-700">' + esc(msg) + '</p>' +
        '<a href="/" class="mt-5 inline-block rounded-full bg-tomato px-6 py-2.5 text-sm font-700 text-white">للصفحة الرئيسية</a>' +
      '</div>';
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var toastTimer;
  function toast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  // تحميل + تحديث حيّ كل ٤ ثوان
  load();
  pollTimer = setInterval(load, 4000);
})();
