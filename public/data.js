/* ══ وش ناكل؟ — بيانات الأكلات (نموذج أولي) ══
   time: quick (≤30د) | mid | long
   mood: light | hearty | healthy | sweet
   budget: low | mid | high
*/
window.DISHES = [
  { id: 1,  name: 'كبسة دجاج',       emoji: '🍛', time: 'long',  mood: 'hearty',  budget: 'mid',  mins: 60, tags: ['غداء', 'عزايم'] },
  { id: 2,  name: 'مندي لحم',        emoji: '🥘', time: 'long',  mood: 'hearty',  budget: 'high', mins: 90, tags: ['غداء', 'عزايم'] },
  { id: 3,  name: 'مقلوبة',          emoji: '🍲', time: 'long',  mood: 'hearty',  budget: 'mid',  mins: 70, tags: ['غداء'] },
  { id: 4,  name: 'برياني ربيان',    emoji: '🍤', time: 'long',  mood: 'hearty',  budget: 'high', mins: 75, tags: ['غداء'] },
  { id: 5,  name: 'شكشوكة بيض',      emoji: '🍳', time: 'quick', mood: 'light',   budget: 'low',  mins: 15, tags: ['فطور', 'سريعة'] },
  { id: 6,  name: 'فول وبيض',        emoji: '🫘', time: 'quick', mood: 'light',   budget: 'low',  mins: 12, tags: ['فطور'] },
  { id: 7,  name: 'سلطة سيزر دجاج',  emoji: '🥗', time: 'quick', mood: 'healthy', budget: 'mid',  mins: 20, tags: ['عشاء', 'دايت'] },
  { id: 8,  name: 'شوربة عدس',       emoji: '🍜', time: 'quick', mood: 'light',   budget: 'low',  mins: 25, tags: ['عشاء', 'رمضان'] },
  { id: 9,  name: 'باستا بالدجاج',   emoji: '🍝', time: 'mid',   mood: 'hearty',  budget: 'mid',  mins: 35, tags: ['غداء', 'عشاء'] },
  { id: 10, name: 'برجر لحم بيتي',   emoji: '🍔', time: 'mid',   mood: 'hearty',  budget: 'mid',  mins: 30, tags: ['عشاء'] },
  { id: 11, name: 'بيتزا مارجريتا',  emoji: '🍕', time: 'mid',   mood: 'hearty',  budget: 'mid',  mins: 40, tags: ['عشاء'] },
  { id: 12, name: 'شاورما دجاج',     emoji: '🌯', time: 'mid',   mood: 'hearty',  budget: 'mid',  mins: 35, tags: ['عشاء'] },
  { id: 13, name: 'صيادية سمك',      emoji: '🐟', time: 'long',  mood: 'healthy', budget: 'high', mins: 65, tags: ['غداء'] },
  { id: 14, name: 'مجبوس دجاج',      emoji: '🍚', time: 'long',  mood: 'hearty',  budget: 'mid',  mins: 60, tags: ['غداء'] },
  { id: 15, name: 'كفتة بالصينية',   emoji: '🥩', time: 'mid',   mood: 'hearty',  budget: 'mid',  mins: 45, tags: ['غداء'] },
  { id: 16, name: 'محشي ورق عنب',    emoji: '🍇', time: 'long',  mood: 'light',   budget: 'mid',  mins: 80, tags: ['غداء', 'عزايم'] },
  { id: 17, name: 'فتة حمص',         emoji: '🫓', time: 'quick', mood: 'light',   budget: 'low',  mins: 20, tags: ['فطور'] },
  { id: 18, name: 'أومليت خضار',     emoji: '🥚', time: 'quick', mood: 'healthy', budget: 'low',  mins: 12, tags: ['فطور', 'دايت'] },
  { id: 19, name: 'سلطة كينوا',      emoji: '🥙', time: 'quick', mood: 'healthy', budget: 'mid',  mins: 20, tags: ['دايت', 'عشاء'] },
  { id: 20, name: 'دجاج مشوي بالفرن',emoji: '🍗', time: 'mid',   mood: 'healthy', budget: 'mid',  mins: 45, tags: ['غداء', 'دايت'] },
  { id: 21, name: 'رز بخاري لحم',    emoji: '🍖', time: 'long',  mood: 'hearty',  budget: 'high', mins: 85, tags: ['غداء', 'عزايم'] },
  { id: 22, name: 'مسقعة باذنجان',   emoji: '🍆', time: 'mid',   mood: 'light',   budget: 'low',  mins: 40, tags: ['عشاء'] },
  { id: 23, name: 'بطاطس بالفرن',    emoji: '🥔', time: 'mid',   mood: 'light',   budget: 'low',  mins: 40, tags: ['عشاء'] },
  { id: 24, name: 'نودلز بالخضار',   emoji: '🍜', time: 'quick', mood: 'light',   budget: 'low',  mins: 18, tags: ['عشاء', 'سريعة'] },
  { id: 25, name: 'كنافة',           emoji: '🍮', time: 'mid',   mood: 'sweet',   budget: 'mid',  mins: 35, tags: ['حلا'] },
  { id: 26, name: 'بان كيك',         emoji: '🥞', time: 'quick', mood: 'sweet',   budget: 'low',  mins: 20, tags: ['فطور', 'حلا'] },
  { id: 27, name: 'لقيمات',          emoji: '🍩', time: 'mid',   mood: 'sweet',   budget: 'low',  mins: 40, tags: ['حلا', 'رمضان'] },
  { id: 28, name: 'تشيز كيك',        emoji: '🍰', time: 'long',  mood: 'sweet',   budget: 'mid',  mins: 70, tags: ['حلا'] },
  { id: 29, name: 'سمك مشوي',        emoji: '🐠', time: 'mid',   mood: 'healthy', budget: 'high', mins: 40, tags: ['غداء', 'دايت'] },
  { id: 30, name: 'كبة مقلية',       emoji: '🧆', time: 'long',  mood: 'hearty',  budget: 'mid',  mins: 75, tags: ['عزايم'] },
  { id: 31, name: 'ساندويتش تونة',   emoji: '🥪', time: 'quick', mood: 'light',   budget: 'low',  mins: 10, tags: ['عشاء', 'سريعة'] },
  { id: 32, name: 'مكرونة بشاميل',   emoji: '🧀', time: 'long',  mood: 'hearty',  budget: 'mid',  mins: 65, tags: ['غداء'] },
  { id: 33, name: 'فاهيتا دجاج',     emoji: '🌮', time: 'mid',   mood: 'hearty',  budget: 'mid',  mins: 35, tags: ['عشاء'] },
  { id: 34, name: 'حريرة',           emoji: '🥣', time: 'mid',   mood: 'light',   budget: 'low',  mins: 45, tags: ['رمضان', 'عشاء'] },
  { id: 35, name: 'سمبوسة',          emoji: '🥟', time: 'mid',   mood: 'hearty',  budget: 'low',  mins: 40, tags: ['رمضان'] },
  { id: 36, name: 'رول خضار',        emoji: '🥬', time: 'quick', mood: 'healthy', budget: 'low',  mins: 20, tags: ['دايت', 'عشاء'] },
  { id: 37, name: 'دجاج بالكاري',    emoji: '🍛', time: 'mid',   mood: 'hearty',  budget: 'mid',  mins: 45, tags: ['غداء'] },
  { id: 38, name: 'طاجن خضار',       emoji: '🍲', time: 'mid',   mood: 'healthy', budget: 'low',  mins: 40, tags: ['غداء', 'دايت'] },
  { id: 39, name: 'وافل',            emoji: '🧇', time: 'quick', mood: 'sweet',   budget: 'low',  mins: 20, tags: ['فطور', 'حلا'] },
  { id: 40, name: 'كريب نوتيلا',     emoji: '🥐', time: 'quick', mood: 'sweet',   budget: 'low',  mins: 15, tags: ['حلا'] },
  { id: 41, name: 'شوربة طماطم',     emoji: '🍅', time: 'quick', mood: 'light',   budget: 'low',  mins: 25, tags: ['عشاء'] },
  { id: 42, name: 'ستيك لحم',        emoji: '🥩', time: 'mid',   mood: 'hearty',  budget: 'high', mins: 30, tags: ['عشاء', 'عزايم'] },
];

/* لون خلفية البطاقة حسب المزاج */
window.MOOD_BG = {
  hearty:  'linear-gradient(135deg,#FDE7DF,#F8C7B4)',
  light:   'linear-gradient(135deg,#E7F6EC,#C9EBD5)',
  healthy: 'linear-gradient(135deg,#E4F7EE,#BEEAD3)',
  sweet:   'linear-gradient(135deg,#FDF0D5,#F9DCA0)',
};

window.TIME_LABEL = { quick: 'سريعة', mid: 'متوسطة', long: 'على مهل' };
window.MOOD_LABEL = { light: 'خفيف', hearty: 'دسم', healthy: 'صحّي', sweet: 'حلا' };
