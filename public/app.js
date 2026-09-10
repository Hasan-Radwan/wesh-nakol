/* ══ وش ناكل؟ — منطق الواجهة (نموذج أولي) ══ */
(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ── حالة الفلاتر + آخر الاقتراحات (منع التكرار) ── */
  var state = { time: 'any', mood: 'any' };
  var recent = [];                                  // آخر ما اقترحناه
  var LS = window.localStorage;
  var favorites = JSON.parse(LS.getItem('wn_favs') || '[]');

  /* ══════════ الفلاتر ══════════ */
  $$('#filters .chip-group').forEach(function (group) {
    var key = group.getAttribute('data-filter');
    $$('.chip', group).forEach(function (chip) {
      chip.addEventListener('click', function () {
        $$('.chip', group).forEach(function (c) { c.classList.remove('is-on'); });
        chip.classList.add('is-on');
        state[key] = chip.getAttribute('data-value');
      });
    });
  });

  /* ══════════ خوارزمية الاقتراح ══════════ */
  function pool(pantryOnly) {
    return window.DISHES.filter(function (d) {
      if (state.time !== 'any' && d.time !== state.time) return false;
      if (state.mood !== 'any' && d.mood !== state.mood) return false;
      // pantryOnly: في النموذج نحاكيها باختيار السريعة/الاقتصادية
      if (pantryOnly && !(d.budget === 'low')) return false;
      return true;
    });
  }

  function weightedPick(list, n) {
    // ترجيح المفضلات + تجنّب آخر اقتراحين
    var scored = list.map(function (d) {
      var w = 1;
      if (favorites.indexOf(d.id) !== -1) w += 3;
      if (recent.indexOf(d.id) !== -1)   w -= 0.85;
      return { d: d, w: Math.max(0.05, w) * (0.5 + Math.random()) };
    }).sort(function (a, b) { return b.w - a.w; });
    return scored.slice(0, n).map(function (s) { return s.d; });
  }

  /* ══════════ عرض البطاقات ══════════ */
  function timeChip(d) {
    return '<span class="inline-flex items-center gap-1 rounded-full bg-black/5 px-2.5 py-1 text-xs font-700 text-ink-soft">' +
      '<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>' +
      d.mins + ' د</span>';
  }

  function card(d, i) {
    var liked = favorites.indexOf(d.id) !== -1;
    var bg = window.MOOD_BG[d.mood] || window.MOOD_BG.hearty;
    var tags = d.tags.slice(0, 2).map(function (t) {
      return '<span class="rounded-full bg-saffron/15 px-2.5 py-1 text-xs font-700 text-saffron-600">' + t + '</span>';
    }).join('');

    return '' +
    '<article class="dish-card overflow-hidden rounded-4xl bg-white shadow-card" style="animation-delay:' + (i * 90) + 'ms">' +
      '<div class="dish-thumb" style="background:' + bg + '"><span>' + d.emoji + '</span></div>' +
      '<div class="p-5">' +
        '<div class="flex items-start justify-between gap-2">' +
          '<h3 class="font-display text-xl font-800">' + d.name + '</h3>' +
          '<button class="like-btn ' + (liked ? 'is-liked' : '') + ' grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black/5 text-ink-soft transition hover:bg-tomato/10" ' +
            'data-id="' + d.id + '" aria-label="أضِف للمفضلة" aria-pressed="' + liked + '">' +
            '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="' + (liked ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="mt-3 flex flex-wrap items-center gap-2">' + timeChip(d) + tags + '</div>' +
        '<div class="mt-5 flex gap-2">' +
          '<button class="pick-btn flex-1 rounded-full bg-tomato px-4 py-2.5 text-sm font-700 text-white transition hover:bg-tomato-600 active:scale-95" data-id="' + d.id + '">اخترناها 🎉</button>' +
          '<button class="vote-add-btn grid h-11 w-11 shrink-0 place-items-center rounded-full bg-herb/10 text-herb-600 transition hover:bg-herb/20 active:scale-95" data-id="' + d.id + '" aria-label="أضِف للتصويت" title="أضِف للتصويت">' +
            '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  var voteBasket = [];   // أكلات مرشّحة للتصويت

  function render(list) {
    var box = $('#results');
    box.innerHTML = list.map(card).join('');
    recent = list.map(function (d) { return d.id; });
    bindCardEvents();
  }

  function bindCardEvents() {
    $$('.like-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = +b.getAttribute('data-id');
        var idx = favorites.indexOf(id);
        if (idx === -1) { favorites.push(id); b.classList.add('is-liked'); b.setAttribute('aria-pressed', 'true'); toast('انضافت للمفضلة ♥'); }
        else { favorites.splice(idx, 1); b.classList.remove('is-liked'); b.setAttribute('aria-pressed', 'false'); toast('انشالت من المفضلة'); }
        b.querySelector('svg').setAttribute('fill', idx === -1 ? 'currentColor' : 'none');
        LS.setItem('wn_favs', JSON.stringify(favorites));
      });
    });
    $$('.pick-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        var d = byId(+b.getAttribute('data-id'));
        toast('بالهنا والشفا! اخترتوا ' + d.name + ' 🍽️');
      });
    });
    $$('.vote-add-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = +b.getAttribute('data-id');
        if (voteBasket.indexOf(id) === -1 && voteBasket.length < 5) {
          voteBasket.push(id);
          toast('انضافت لتصويت العائلة (' + voteBasket.length + ')');
        } else if (voteBasket.length >= 5) {
          toast('أقصى شيء ٥ خيارات للتصويت');
        }
      });
    });
  }

  function byId(id) { return window.DISHES.filter(function (d) { return d.id === id; })[0]; }

  /* ══════════ زر «وش ناكل؟» ══════════ */
  function suggest(pantryOnly) {
    var btn = $('#magicBtn');
    btn.classList.add('is-loading');
    var empty = $('#emptyState'); if (empty) empty.remove();
    $('#results').innerHTML = loadingCards();

    setTimeout(function () {
      var list = weightedPick(pool(pantryOnly), 3);
      if (!list.length) {
        $('#results').innerHTML = '<p class="col-span-full py-10 text-center text-ink-soft">ما لقينا أكلة بهالفلاتر — جرّب توسّع الخيارات.</p>';
      } else {
        render(list);
      }
      btn.classList.remove('is-loading');
    }, 650);
  }

  function loadingCards() {
    var one = '<div class="rounded-4xl bg-white p-4 shadow-card"><div class="h-[150px] animate-pulse rounded-3xl bg-black/5"></div>' +
      '<div class="mt-4 h-5 w-2/3 animate-pulse rounded-full bg-black/5"></div>' +
      '<div class="mt-3 h-4 w-1/3 animate-pulse rounded-full bg-black/5"></div>' +
      '<div class="mt-5 h-11 animate-pulse rounded-full bg-black/5"></div></div>';
    return one + one + one;
  }

  $('#magicBtn').addEventListener('click', function () { suggest(false); });
  $('#fromPantryBtn').addEventListener('click', function () { suggest(true); });

  /* ══════════ تصويت العائلة ══════════ */
  var POLL_SEED = [
    { name: 'كبسة دجاج',   emoji: '🍛', votes: 4 },
    { name: 'برجر بيتي',   emoji: '🍔', votes: 2 },
    { name: 'باستا',       emoji: '🍝', votes: 1 },
  ];

  function renderPoll() {
    var total = POLL_SEED.reduce(function (s, o) { return s + o.votes; }, 0) || 1;
    var lead = Math.max.apply(null, POLL_SEED.map(function (o) { return o.votes; }));
    $('#poll').innerHTML = POLL_SEED.map(function (o) {
      var pct = Math.round((o.votes / total) * 100);
      return '<div class="poll-row">' +
        '<div class="mb-1 flex items-center justify-between text-sm font-700"><span>' + o.emoji + ' ' + o.name + '</span><span class="text-ink-soft">' + pct + '%</span></div>' +
        '<div class="poll-bar"><div class="poll-fill ' + (o.votes === lead ? 'is-lead' : '') + '" data-pct="' + pct + '"></div></div>' +
        '</div>';
    }).join('');
    // حرّك الأشرطة بعد الرسم
    requestAnimationFrame(function () {
      $$('.poll-fill').forEach(function (f) { f.style.width = f.getAttribute('data-pct') + '%'; });
    });
  }

  function showShare(url, names) {
    var link = $('#voteLink');
    link.textContent = '🔗 ' + url;
    link.classList.remove('hidden');

    var msg = 'وش ناكل اليوم؟ 🍽️\nصوّتوا على العشاء:\n' +
      names.map(function (n, i) { return (i + 1) + '. ' + n; }).join('\n') +
      '\n\nصوّت من هنا (بدون تسجيل):\n' + url;
    var wa = $('#waShareBtn');
    wa.href = 'https://wa.me/?text=' + encodeURIComponent(msg);
    wa.classList.remove('hidden');
    wa.classList.add('flex');
  }

  $('#createVoteBtn').addEventListener('click', function () {
    var btn = $('#createVoteBtn');
    var picks = voteBasket.length
      ? voteBasket.map(byId)
      : [byId(1), byId(10), byId(9)];   // افتراضي: كبسة، برجر، باستا
    var options = picks.map(function (d) { return { name: d.name, emoji: d.emoji }; });
    var names = picks.map(function (d) { return d.name; });

    btn.disabled = true;
    btn.textContent = 'جارٍ الإنشاء…';

    fetch('/api/sessions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'وش ناكل اليوم؟', options: options }),
    })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d.ok) throw new Error(d.error || 'فشل الإنشاء');
        var url = location.origin + '/vote?s=' + d.id;
        showShare(url, names);
        toast('تم إنشاء التصويت! أرسل الرابط للعائلة');
      })
      .catch(function () {
        // احتياطي: لو فُتحت الصفحة كملف محلي (بدون خادم) أو تعذّر الاتصال
        toast('التصويت الحقيقي يحتاج تشغيل الخادم (npm run dev)');
      })
      .then(function () {
        btn.disabled = false;
        btn.textContent = 'أنشئ تصويت العائلة';
      });
  });

  /* ══════════ خطوات «كيف يشتغل» ══════════ */
  var STEPS = [
    { t: 'اضغط الزر', d: 'خيار «وش ناكل؟» يعطيك ٣ أكلات تناسب وقتك ومزاجك.', c: 'tomato',
      p: '<path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/>' },
    { t: 'اختر أو صوّت', d: 'يعجبك؟ اخترها. اختلفتوا؟ أرسل تصويت للعائلة بالواتساب.', c: 'herb',
      p: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>' },
    { t: 'كلوا وطيبوا', d: 'قرار خلال ثانية بدل نص ساعة نقاش. بالهنا والشفا 🎉', c: 'saffron',
      p: '<path d="M3 11h18M5 11a7 7 0 0 1 14 0M2 20h20M6 15h.01M12 15h.01M18 15h.01"/>' },
  ];
  $('#steps').innerHTML = STEPS.map(function (s, i) {
    return '<div class="relative rounded-4xl bg-white p-7 shadow-card">' +
      '<span class="absolute left-6 top-6 font-display text-5xl font-800 text-black/5">' + (i + 1) + '</span>' +
      '<div class="grid h-14 w-14 place-items-center rounded-2xl bg-' + s.c + '/12 text-' + s.c + '-600">' +
        '<svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + s.p + '</svg>' +
      '</div>' +
      '<h3 class="mt-5 font-display text-xl font-800">' + s.t + '</h3>' +
      '<p class="mt-2 text-sm leading-relaxed text-ink-soft">' + s.d + '</p>' +
    '</div>';
  }).join('');

  /* ══════════ Toast ══════════ */
  var toastTimer;
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  /* init */
  renderPoll();
})();
