-- =====================================================================
--  Noor wa Sakina (نور وسكينة) — PostgreSQL schema
--  Compatible with Supabase / Neon / Render Postgres.
--  Safe to run more than once (idempotent).
-- =====================================================================

-- ---------- Reels / posts ----------
CREATE TABLE IF NOT EXISTS posts (
  id              SERIAL PRIMARY KEY,
  title           VARCHAR(200)  NOT NULL,
  title_en        VARCHAR(200),
  description     TEXT,
  instagram_url   VARCHAR(500)  NOT NULL,
  thumbnail_url   VARCHAR(500),
  category        VARCHAR(30)   NOT NULL
                  CHECK (category IN ('tadabbur', 'raqaiq', 'adhkar', 'qisas')),
  views           INTEGER       NOT NULL DEFAULT 0 CHECK (views >= 0),
  likes           INTEGER       NOT NULL DEFAULT 0 CHECK (likes >= 0),
  is_featured     BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_category   ON posts (category);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts (created_at DESC);

-- ---------- Visitor messages & suggestions ----------
CREATE TABLE IF NOT EXISTS messages (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(120)  NOT NULL,
  email       VARCHAR(200),
  type        VARCHAR(20)   NOT NULL DEFAULT 'question'
              CHECK (type IN ('question', 'suggestion', 'feedback')),
  subject     VARCHAR(200),
  message     TEXT          NOT NULL,
  is_read     BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages (created_at DESC);

-- ---------- Daily quotes (ayah / hadith / wisdom) ----------
CREATE TABLE IF NOT EXISTS daily_quotes (
  id           SERIAL PRIMARY KEY,
  kind         VARCHAR(20)  NOT NULL CHECK (kind IN ('ayah', 'hadith', 'wisdom')),
  text         TEXT         NOT NULL,
  translation  TEXT,
  source       VARCHAR(200) NOT NULL,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_daily_quotes_text UNIQUE (text)
);

-- ---------- Supabase: lock tables from the public REST API ----------
-- The site talks to the database only through the Express backend
-- (direct Postgres connection), so Row Level Security is enabled with
-- no policies: Supabase's anon/public API keys cannot read or write.
ALTER TABLE posts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages     ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_quotes ENABLE ROW LEVEL SECURITY;

-- =====================================================================
--  Seed data
-- =====================================================================

INSERT INTO daily_quotes (kind, text, translation, source) VALUES
('ayah', 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', 'Verily, in the remembrance of Allah do hearts find rest.', 'سورة الرعد ٢٨'),
('ayah', 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا', 'For indeed, with hardship comes ease. Indeed, with hardship comes ease.', 'سورة الشرح ٥ - ٦'),
('ayah', 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ', 'So remember Me; I will remember you. And be grateful to Me and do not deny Me.', 'سورة البقرة ١٥٢'),
('ayah', 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا ۝ وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ', 'Whoever fears Allah, He will make for him a way out, and provide for him from where he does not expect.', 'سورة الطلاق ٢ - ٣'),
('ayah', 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا', 'Allah does not burden a soul beyond that it can bear.', 'سورة البقرة ٢٨٦'),
('ayah', 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ', 'And when My servants ask you about Me, indeed I am near. I respond to the call of the caller when he calls upon Me.', 'سورة البقرة ١٨٦'),
('ayah', 'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ', 'Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allah.', 'سورة الزمر ٥٣'),
('ayah', 'هُوَ الَّذِي أَنزَلَ السَّكِينَةَ فِي قُلُوبِ الْمُؤْمِنِينَ لِيَزْدَادُوا إِيمَانًا مَّعَ إِيمَانِهِمْ', 'It is He who sent down tranquillity into the hearts of the believers, that they would increase in faith along with their faith.', 'سورة الفتح ٤'),
('ayah', 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ', 'Allah is the Light of the heavens and the earth.', 'سورة النور ٣٥'),
('ayah', 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ', 'And your Lord is going to give you, and you will be satisfied.', 'سورة الضحى ٥'),
('ayah', 'أَفَمَن شَرَحَ اللَّهُ صَدْرَهُ لِلْإِسْلَامِ فَهُوَ عَلَىٰ نُورٍ مِّن رَّبِّهِ', 'Is one whose breast Allah has expanded to Islam, so he is upon a light from his Lord [like one whose heart rejects it]?', 'سورة الزمر ٢٢'),
('ayah', 'وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ', 'And be patient, and your patience is not but through Allah.', 'سورة النحل ١٢٧'),
('hadith', 'كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ', 'Two words are light on the tongue, heavy on the Scale, and beloved to the Most Merciful: SubhanAllahi wa bihamdihi, SubhanAllahil-Azim.', 'متفق عليه: البخاري ٦٤٠٦، مسلم ٢٦٩٤'),
('hadith', 'أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ', 'The most beloved deeds to Allah are the most consistent, even if they are small.', 'متفق عليه'),
('hadith', 'الطُّهُورُ شَطْرُ الْإِيمَانِ، وَالْحَمْدُ لِلَّهِ تَمْلَأُ الْمِيزَانَ', 'Purity is half of faith, and Alhamdulillah fills the Scale.', 'صحيح مسلم ٢٢٣'),
('hadith', 'مَنْ صَلَّى عَلَيَّ صَلَاةً وَاحِدَةً صَلَّى اللَّهُ عَلَيْهِ عَشْرًا', 'Whoever sends one blessing upon me, Allah sends ten blessings upon him.', 'صحيح مسلم ٤٠٨'),
('hadith', 'مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ', 'Whoever guides to good will have a reward like the one who does it.', 'صحيح مسلم ١٨٩٣'),
('hadith', 'يَسِّرُوا وَلَا تُعَسِّرُوا، وَبَشِّرُوا وَلَا تُنَفِّرُوا', 'Make things easy and do not make them difficult; give glad tidings and do not drive people away.', 'متفق عليه: البخاري ٦٩، مسلم ١٧٣٤'),
('hadith', 'الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ', 'A good word is charity.', 'متفق عليه: البخاري ٢٩٨٩، مسلم ١٠٠٩'),
('wisdom', 'ليس المطلوب أن تكون كاملًا، بل أن تبقى قريبًا. خطوة صغيرة كل يوم نحو الله تكفي لتغيّر قلبك.', 'You are not asked to be perfect, only to stay close. One small step towards Allah every day is enough to change your heart.', 'نور وسكينة'),
('wisdom', 'السكينة لا تأتي حين تختفي المشاكل، بل حين يمتلئ القلب بالله.', 'Tranquillity does not come when problems disappear, but when the heart is filled with Allah.', 'نور وسكينة')
ON CONFLICT (text) DO NOTHING;

-- Sample reels: seeded only when the posts table is empty.
-- Replace the links with your real reel links from the /admin page.
INSERT INTO posts (title, title_en, description, instagram_url, category, views, likes, is_featured)
SELECT * FROM (VALUES
  ('قلبك… من أيّ نوع؟', 'Which heart is yours?', 'تدبّر في آية الزمر ٢٢: قلبٌ على نورٍ من ربّه، وقلبٌ قاسٍ من ذكر الله.', 'https://www.instagram.com/noor.wasakina/', 'tadabbur', 1240, 312, TRUE),
  ('كلمة واحدة… أغلقت أبواب السماء', 'One word closed the gates of heaven', 'حديث عن اللعنة: كيف تصعد الكلمة ثم تُغلق دونها الأبواب.', 'https://www.instagram.com/noor.wasakina/', 'raqaiq', 980, 205, TRUE),
  ('صلاةٌ واحدة، تعود عليك بعشر', 'One salawat returns to you tenfold', 'ليلة الجمعة وفضل الصلاة على النبي ﷺ.', 'https://www.instagram.com/noor.wasakina/', 'adhkar', 1530, 401, TRUE),
  ('وراء كل خيمة حكاية', 'Behind every tent, a story', 'قصة نزوح وصبر من غزة، وأمل لا ينطفئ.', 'https://www.instagram.com/noor.wasakina/', 'qisas', 2110, 640, FALSE),
  ('١٠ أصحاب بعمر ١٨', '10 friends at 18', 'المرء مع من أحب: من يبقى معك حتى النهاية؟', 'https://www.instagram.com/noor.wasakina/', 'qisas', 1875, 522, FALSE),
  ('هالمرّة… لا تسكّر', 'This time, don''t swipe away', 'كم مرة سكّرت فيديو ديني؟ والحمد لله تملأ الميزان.', 'https://www.instagram.com/noor.wasakina/', 'raqaiq', 1420, 380, FALSE),
  ('رمضان أقرب مما تتخيّل', 'Ramadan is closer than you think', 'خطة عملية للاستعداد: ختمة، صيام، واستغفار.', 'https://www.instagram.com/noor.wasakina/', 'tadabbur', 1660, 455, FALSE),
  ('دعاء لأهل غزة', 'A dua for Gaza', 'اكتب آمين… دعاءٌ صادق من القلب لأهلنا في غزة.', 'https://www.instagram.com/noor.wasakina/', 'adhkar', 2390, 870, FALSE)
) AS seed (title, title_en, description, instagram_url, category, views, likes, is_featured)
WHERE NOT EXISTS (SELECT 1 FROM posts);
