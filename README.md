# وش ناكل؟ 🍽️

قرار وجبة اليوم بضغطة زر + **تصويت عائلي حقيقي** عبر رابط واتساب — بدون تسجيل.
مبني على **Cloudflare Pages + Pages Functions + D1**.

## المعمارية
```
Cloudflare Pages       →  الواجهة الثابتة (public/)
Pages Functions        →  API التصويت (functions/api/…)  ← Workers تحت الغطاء
Cloudflare D1 (SQLite) →  الجلسات + الخيارات + الأصوات (منع تكرار بـ deviceHash)
```

## البنية
```
public/            الواجهة (تُنشر كما هي)
  index.html       الصفحة الرئيسية
  vote.html        صفحة التصويت العامة (/vote?s=ID)
  app.js vote.js data.js styles.css
functions/api/
  sessions.js              POST  /api/sessions            إنشاء جلسة
  sessions/[id].js         GET   /api/sessions/:id         النتائج الحيّة
  sessions/[id]/vote.js    POST  /api/sessions/:id/vote    تصويت
schema.sql         مخطط D1
wrangler.toml      الإعداد + ربط D1
```

## التشغيل محلياً
```bash
npm install
npm run db:local      # يطبّق schema.sql على D1 محلي
npm run dev           # wrangler pages dev  →  http://localhost:8788
```

## النشر على Cloudflare (يحتاج حسابك)
```bash
npx wrangler login                 # مصادقة عبر متصفحك (مرة واحدة)
npm run db:create                  # ينشئ D1 — انسخ database_id إلى wrangler.toml
npm run db:remote                  # يطبّق المخطط على D1 السحابي
npm run deploy                     # ينشر الموقع + الـ Functions
```
> بعد `db:create` استبدل `PLACEHOLDER_REPLACE_AFTER_D1_CREATE` في `wrangler.toml`
> بالـ `database_id` الظاهر في المخرجات.

## واجهات API
| الطريقة | المسار | الجسم | الناتج |
|--------|--------|------|--------|
| POST | `/api/sessions` | `{title, options:[{name,emoji}]}` (٢–٥) | `{ok,id}` |
| GET  | `/api/sessions/:id` | — | `{ok,session:{title,status,options:[{id,name,emoji,votes}],total}}` |
| POST | `/api/sessions/:id/vote` | `{optionId, voterName, deviceHash}` | `{ok}` |

## تم اختباره ✅
إنشاء جلسة · تصويت وتجميع حيّ · **صوت واحد لكل جهاز** (تغيير الصوت يستبدل السابق) ·
رفض الخيار من جلسة أخرى · جلسة غير موجودة (404).

## الخطوات القادمة
- حسابات المستخدمين + مخزون فعلي (اليوم الاقتراح والمخزون واجهة فقط عبر localStorage).
- قفل الجلسة من المُنشئ + WebSocket بدل الـ polling.
- تكامل مطاعم/بقالة (عمولات).
