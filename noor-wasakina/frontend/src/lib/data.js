// Static content + offline fallbacks (used when the API is not reachable).
import { INSTAGRAM_URL } from './config.js';

export const CATEGORIES = [
  { id: 'all', label: 'الكل', en: 'All' },
  { id: 'tadabbur', label: 'تدبّر آيات', en: 'Reflections' },
  { id: 'raqaiq', label: 'رقائق ومواعظ', en: 'Heart softeners' },
  { id: 'adhkar', label: 'أذكار وأدعية', en: 'Adhkar & duas' },
  { id: 'qisas', label: 'قصص وعِبَر', en: 'Stories' },
];

export const categoryLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label || id;

export const NAV_LINKS = [
  { id: 'home', label: 'الرئيسية' },
  { id: 'reels', label: 'المقاطع' },
  { id: 'dhikr', label: 'الأذكار' },
  { id: 'contact', label: 'تواصل معنا' },
];

// Rotating verses in the hero card.
export const HERO_AYAT = [
  { text: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', source: 'الرعد ٢٨', en: 'Verily, in the remembrance of Allah do hearts find rest.' },
  { text: 'هُوَ الَّذِي أَنزَلَ السَّكِينَةَ فِي قُلُوبِ الْمُؤْمِنِينَ', source: 'الفتح ٤', en: 'It is He who sent down tranquillity into the hearts of the believers.' },
  { text: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ', source: 'النور ٣٥', en: 'Allah is the Light of the heavens and the earth.' },
  { text: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', source: 'الشرح ٥', en: 'For indeed, with hardship comes ease.' },
];

export const DHIKR_LIST = [
  { id: 'subhanallah', text: 'سُبْحَانَ اللَّهِ', target: 33 },
  { id: 'alhamdulillah', text: 'الْحَمْدُ لِلَّهِ', target: 33 },
  { id: 'allahuakbar', text: 'اللَّهُ أَكْبَرُ', target: 34 },
  { id: 'tahlil', text: 'لَا إِلَٰهَ إِلَّا اللَّهُ', target: 100 },
  { id: 'istighfar', text: 'أَسْتَغْفِرُ اللَّهَ', target: 100 },
  { id: 'salawat', text: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ ﷺ', target: 100 },
  { id: 'hawqala', text: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', target: 33 },
  { id: 'subhan-bihamdihi', text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', target: 100 },
];

export const FALLBACK_QUOTES = [
  { id: 1, kind: 'ayah', text: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', translation: 'Verily, in the remembrance of Allah do hearts find rest.', source: 'سورة الرعد ٢٨' },
  { id: 2, kind: 'ayah', text: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا', translation: 'For indeed, with hardship comes ease. Indeed, with hardship comes ease.', source: 'سورة الشرح ٥ - ٦' },
  { id: 3, kind: 'ayah', text: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ', translation: 'So remember Me; I will remember you. And be grateful to Me and do not deny Me.', source: 'سورة البقرة ١٥٢' },
  { id: 4, kind: 'hadith', text: 'كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ', translation: 'Two words are light on the tongue, heavy on the Scale, and beloved to the Most Merciful.', source: 'متفق عليه: البخاري ٦٤٠٦، مسلم ٢٦٩٤' },
  { id: 5, kind: 'hadith', text: 'الطُّهُورُ شَطْرُ الْإِيمَانِ، وَالْحَمْدُ لِلَّهِ تَمْلَأُ الْمِيزَانَ', translation: 'Purity is half of faith, and Alhamdulillah fills the Scale.', source: 'صحيح مسلم ٢٢٣' },
  { id: 6, kind: 'ayah', text: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ', translation: 'And when My servants ask you about Me, indeed I am near. I respond to the call of the caller when he calls upon Me.', source: 'سورة البقرة ١٨٦' },
  { id: 7, kind: 'wisdom', text: 'السكينة لا تأتي حين تختفي المشاكل، بل حين يمتلئ القلب بالله.', translation: 'Tranquillity does not come when problems disappear, but when the heart is filled with Allah.', source: 'نور وسكينة' },
];

const seed = (id, title, title_en, description, category, views, likes, is_featured = false) => ({
  id,
  title,
  title_en,
  description,
  instagram_url: INSTAGRAM_URL,
  thumbnail_url: null,
  category,
  views,
  likes,
  is_featured,
});

export const FALLBACK_POSTS = [
  seed(1, 'قلبك… من أيّ نوع؟', 'Which heart is yours?', 'تدبّر في آية الزمر ٢٢: قلبٌ على نورٍ من ربّه، وقلبٌ قاسٍ من ذكر الله.', 'tadabbur', 1240, 312, true),
  seed(2, 'كلمة واحدة… أغلقت أبواب السماء', 'One word closed the gates of heaven', 'حديث عن اللعنة: كيف تصعد الكلمة ثم تُغلق دونها الأبواب.', 'raqaiq', 980, 205, true),
  seed(3, 'صلاةٌ واحدة، تعود عليك بعشر', 'One salawat returns to you tenfold', 'ليلة الجمعة وفضل الصلاة على النبي ﷺ.', 'adhkar', 1530, 401, true),
  seed(4, 'وراء كل خيمة حكاية', 'Behind every tent, a story', 'قصة نزوح وصبر من غزة، وأمل لا ينطفئ.', 'qisas', 2110, 640),
  seed(5, '١٠ أصحاب بعمر ١٨', '10 friends at 18', 'المرء مع من أحب: من يبقى معك حتى النهاية؟', 'qisas', 1875, 522),
  seed(6, 'هالمرّة… لا تسكّر', "This time, don't swipe away", 'كم مرة سكّرت فيديو ديني؟ والحمد لله تملأ الميزان.', 'raqaiq', 1420, 380),
  seed(7, 'رمضان أقرب مما تتخيّل', 'Ramadan is closer than you think', 'خطة عملية للاستعداد: ختمة، صيام، واستغفار.', 'tadabbur', 1660, 455),
  seed(8, 'دعاء لأهل غزة', 'A dua for Gaza', 'اكتب آمين… دعاءٌ صادق من القلب لأهلنا في غزة.', 'adhkar', 2390, 870),
];
