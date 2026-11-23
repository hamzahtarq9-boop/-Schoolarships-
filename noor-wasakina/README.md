# نور وسكينة | Noor wa Sakina

موقع دعوي متكامل: واجهة **React + Vite + Tailwind + Framer Motion**، وخادم **Node.js + Express**، وقاعدة بيانات **PostgreSQL** (Supabase).

```
noor-wasakina/
├── backend/                 ← Express API (يُنشر على Render)
│   ├── schema.sql           ← الجداول + بيانات أولية
│   ├── .env.example
│   └── src/
│       ├── server.js        ← نقطة التشغيل (ينشئ الجداول تلقائيًا)
│       ├── app.js           ← الإعدادات: CORS، Helmet، Rate limit
│       ├── routes/          ← posts, messages, quotes, admin
│       ├── middleware/      ← حماية الإدارة + معالجة الأخطاء
│       └── db/              ← الاتصال بقاعدة البيانات + التهيئة
└── frontend/                ← React (يُنشر على Vercel)
    ├── public/              ← الشعار، الأيقونات، صورة المشاركة
    ├── .env.example
    ├── vercel.json
    ├── tailwind.config.js
    └── src/
        ├── pages/           ← Home, Admin, NotFound
        ├── components/      ← Navbar, Hero, reels/, dhikr/, admin/ ...
        ├── context/         ← الوضع الليلي/النهاري
        └── lib/             ← API، البيانات، التنسيق
```

## واجهة البرمجة (API)

| الطريقة | المسار | الحماية | الوظيفة |
|---|---|---|---|
| GET | `/api/posts?category=tadabbur` | عام | جلب الريلز (التصنيفات: `tadabbur` · `raqaiq` · `adhkar` · `qisas`) |
| POST | `/api/posts` | `x-admin-secret` | إضافة ريل |
| PATCH / DELETE | `/api/posts/:id` | `x-admin-secret` | تعديل / حذف ريل |
| POST | `/api/posts/:id/view` · `/api/posts/:id/like` | عام | عدّاد المشاهدات والإعجابات |
| POST | `/api/messages` | عام (محدود: ٨ رسائل / ١٥ دقيقة) | استقبال رسائل الزوار |
| GET / PATCH / DELETE | `/api/messages[/:id]` | `x-admin-secret` | إدارة الرسائل |
| GET | `/api/daily-quote` | عام | رسالة اليوم (تتبدّل يوميًا بتوقيت عمّان) |
| GET / POST / DELETE | `/api/quotes[/:id]` | الإضافة والحذف للإدارة | نصوص رسالة اليوم |
| POST | `/api/admin/verify` · GET `/api/admin/stats` | `x-admin-secret` | دخول لوحة الإدارة والإحصائيات |
| GET | `/api/health` | عام | فحص الخادم وقاعدة البيانات |

مثال لإضافة ريل من الطرفية:

```bash
curl -X POST https://YOUR-API.onrender.com/api/posts \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: YOUR_ADMIN_SECRET" \
  -d '{"title":"قلبك من أي نوع؟","instagram_url":"https://www.instagram.com/reel/XXXX/","category":"tadabbur"}'
```

---

## التشغيل محليًا

المتطلبات: Node.js 20 أو أحدث، وقاعدة PostgreSQL (محلية أو من Supabase).

```bash
# 1) الخادم
cd noor-wasakina/backend
cp .env.example .env          # عدّل DATABASE_URL و ADMIN_SECRET
npm install
npm run dev                   # http://localhost:4000  (ينشئ الجداول تلقائيًا)

# 2) الواجهة (في نافذة أخرى)
cd noor-wasakina/frontend
cp .env.example .env          # VITE_API_URL=http://localhost:4000
npm install
npm run dev                   # http://localhost:5173  ولوحة الإدارة: /admin
```

> الواجهة تعمل حتى بدون خادم (تعرض محتوى تجريبيًا)، فيمكنك معاينة التصميم فورًا.

---

## دليل النشر المجاني خطوة بخطوة

الترتيب مهم: **Supabase ← Render ← Vercel ← الربط بينهم**.

### الخطوة ١: قاعدة البيانات على Supabase

1. ادخل إلى [supabase.com](https://supabase.com) وأنشئ حسابًا، ثم **New project**.
2. اختر اسمًا (مثل `noor-wasakina`)، واكتب **Database Password** قويًا واحفظه عندك، واختر منطقة قريبة (مثل Frankfurt).
3. بعد اكتمال الإنشاء افتح **SQL Editor ← New query**، والصق محتوى الملف `backend/schema.sql` كاملًا، ثم اضغط **Run**.
   (هذه الخطوة اختيارية لأن الخادم ينشئ الجداول تلقائيًا عند أول تشغيل، لكنها تتيح لك رؤية الجداول فورًا في **Table Editor**.)
4. اضغط زر **Connect** أعلى الصفحة، ثم من تبويب **Connection String** اختر **Session pooler**، وانسخ الرابط. سيكون بهذا الشكل:
   ```
   postgresql://postgres.abcdefghijkl:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
   ```
   استبدل `[YOUR-PASSWORD]` بكلمة المرور التي اخترتها.
   > ⚠️ استخدم **Session pooler** وليس Direct connection، لأن الاتصال المباشر يعمل عبر IPv6 فقط، وRender المجاني يحتاج IPv4.
   > إذا كانت كلمة المرور تحتوي رموزًا مثل `@` أو `#` أو `/` فإما أن تغيّرها إلى حروف وأرقام فقط، أو تكتبها مُرمّزة (مثلًا `@` تصبح `%40`).

### الخطوة ٢: الخادم على Render

1. ادخل إلى [render.com](https://render.com) وسجّل بحساب GitHub.
2. **New ← Web Service**، واختر المستودع `-Schoolarships-`.
3. الإعدادات:

   | الحقل | القيمة |
   |---|---|
   | Name | `noor-wasakina-api` |
   | Branch | الفرع الذي فيه المشروع (بعد الدمج: `main`) |
   | Root Directory | `noor-wasakina/backend` |
   | Runtime | Node |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Instance Type | **Free** |

4. في **Environment Variables** أضف:

   | المفتاح | القيمة |
   |---|---|
   | `DATABASE_URL` | رابط Supabase من الخطوة ١ |
   | `DATABASE_SSL` | `true` |
   | `ADMIN_SECRET` | كلمة سر طويلة وعشوائية (مثلًا ناتج `openssl rand -hex 24`). هذه هي كلمة دخولك إلى `/admin` |
   | `CORS_ORIGINS` | اتركها فارغة الآن، وسنضبطها في الخطوة ٤ |
   | `NODE_ENV` | `production` |

5. اضغط **Deploy Web Service**. بعد انتهاء النشر ستحصل على رابط مثل:
   `https://noor-wasakina-api.onrender.com`
6. افتح `https://noor-wasakina-api.onrender.com/api/health`. إذا ظهر `"database":"connected"` فالخادم وقاعدة البيانات يعملان ✅

### الخطوة ٣: الواجهة على Vercel

1. ادخل إلى [vercel.com](https://vercel.com) وسجّل بحساب GitHub.
2. **Add New ← Project**، واختر المستودع `-Schoolarships-`، ثم **Import**.
3. الإعدادات:

   | الحقل | القيمة |
   |---|---|
   | Framework Preset | Vite |
   | Root Directory | `noor-wasakina/frontend` (اضغط Edit واختره) |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |

4. في **Environment Variables** أضف:

   | المفتاح | القيمة |
   |---|---|
   | `VITE_API_URL` | `https://noor-wasakina-api.onrender.com` (بدون `/` في النهاية) |
   | `VITE_INSTAGRAM_HANDLE` | `noor.wasakina` |

5. اضغط **Deploy**، وستحصل على رابط مثل `https://noor-wasakina.vercel.app`.

### الخطوة ٤: الربط النهائي (CORS)

1. ارجع إلى Render ← خدمتك ← **Environment**.
2. ضع في `CORS_ORIGINS` رابط موقعك على Vercel (ويمكن إضافة أكثر من رابط بينها فاصلة):
   ```
   https://noor-wasakina.vercel.app
   ```
3. احفظ (**Save, rebuild, and deploy**).
4. افتح موقعك وجرّب: الريلز تظهر من قاعدة البيانات، وأرسل رسالة من نموذج التواصل، ثم ادخل `https://noor-wasakina.vercel.app/admin` بكلمة `ADMIN_SECRET` لترى الرسالة وتضيف ريلًا جديدًا 🎉

> **مهم:** متغيرات `VITE_*` تُدمج في الواجهة وقت البناء. إذا غيّرت `VITE_API_URL` لاحقًا فاعمل **Redeploy** في Vercel.

### ملاحظات عن الخطط المجانية

- **Render المجاني ينام بعد ١٥ دقيقة بلا زيارات**، وأول طلب بعدها يأخذ قرابة ٥٠ ثانية. الواجهة تتعامل مع هذا (تنتظر حتى ٦٠ ثانية، ثم تعرض محتوى احتياطيًا). لإبقائه مستيقظًا مجانًا: أنشئ مراقبًا في [UptimeRobot](https://uptimerobot.com) يزور `/api/health` كل ١٠ دقائق.
- **Supabase المجاني يُوقف المشروع مؤقتًا بعد أسبوع بلا نشاط.** المراقب السابق يمنع ذلك أيضًا، لأن `/api/health` يستعلم من قاعدة البيانات.
- الجداول مفعّل عليها **Row Level Security** بلا سياسات، فلا يمكن لأحد قراءتها عبر مفاتيح Supabase العامة؛ الوصول فقط عبر خادمك.

---

## إدارة المحتوى (`/admin`)

- **الريلز:** الصق رابط الريل من إنستغرام (مشاركة ← نسخ الرابط)، واكتب العنوان بالعربية والإنجليزية، واختر التصنيف. يمكنك أيضًا تمييز ريل ليظهر أولًا، أو تعديله أو حذفه.
- **صورة الغلاف (اختياري):** ضع رابط صورة مباشرًا (مثلًا من Supabase Storage أو Imgur)، وإلا يولّد الموقع غلافًا فخمًا حسب التصنيف.
- **الرسائل:** فلترة حسب النوع وغير المقروء، تعليم كمقروءة، الرد بالبريد، والحذف.
- **رسائل اليوم:** أضف آيات وأحاديث وحِكَمًا بالتشكيل والمصدر، وتتبدّل تلقائيًا كل يوم.

## ملاحظات المحتوى

- الريلز التجريبية في `schema.sql` تشير إلى رابط الحساب العام. استبدلها بروابط الريلز الحقيقية من `/admin`، أو احذفها.
- الآيات والأحاديث المضافة مُشكّلة ومعها مصادرها. راجعها مع مصحف وكتب الحديث قبل الإطلاق كما هي العادة في كل محتوى ديني.
- الشعار مأخوذ من الملف الأصلي دون أي تعديل (قصّ دائري فقط حول إطاره الذهبي).
