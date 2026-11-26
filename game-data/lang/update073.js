/* THE ELEVEN SEALS - lang/update073.js
   Translations for version 0.7.3: the Rare Goods Market in the Android app with Google Play, its cheaper
   materials and the kingdom plants (src/market.js, data/payments.js), and the What's new line (data/tales.js).
   Keys are the English text; # is a number, words in {braces} are filled in by the game. */
(function () {
const ROWS = {
  'A plant of {k}.': { fr: 'Une plante de {k}.', es: 'Una planta de {k}.', pt: 'Uma planta de {k}.', ja: '{k}の植物。', zh: '{k}的植物。', ar: 'نبتة من {k}.', ru: 'Растение из {k}.' },
  '<b>The Rare Goods Market in the Android app.</b> Buy legendary weapons, special armour, irons, herbs and monster parts with Google Play. Small things now cost less: herbs and bog iron from $0.19.': {
    fr: '<b>Le Marché des raretés dans l’appli Android.</b> Achète armes légendaires, armures spéciales, fers, herbes et trophées de monstres avec Google Play. Les petites choses coûtent moins cher : herbes et fer des marais dès 0,19 $.',
    es: '<b>El Mercado de rarezas en la app de Android.</b> Compra armas legendarias, armaduras especiales, hierros, hierbas y piezas de monstruo con Google Play. Las cosas pequeñas cuestan menos: hierbas y hierro de pantano desde 0,19 $.',
    pt: '<b>O Mercado de raridades na app Android.</b> Compra armas lendárias, armaduras especiais, ferros, ervas e partes de monstros com o Google Play. As coisas pequenas custam menos: ervas e ferro de pântano desde 0,19 $.',
    ja: '<b>Androidアプリに希少品市場。</b>伝説の武器、特別な鎧、鉄、薬草、魔物の素材をGoogle Playで買える。小さな品は安くなった：薬草と沼鉄は0.19ドルから。',
    zh: '<b>安卓应用中的珍品市场。</b>用 Google Play 购买传说武器、特殊护甲、铁料、草药和怪物材料。小东西更便宜了：草药和沼铁 0.19 美元起。',
    ar: '<b>سوق النوادر في تطبيق أندرويد.</b> اشترِ الأسلحة الأسطورية والدروع الخاصة والحديد والأعشاب وأجزاء الوحوش عبر Google Play. الأشياء الصغيرة صارت أرخص: الأعشاب وحديد المستنقعات من 0.19 دولار.',
    ru: '<b>Рынок редкостей в приложении для Android.</b> Покупай легендарное оружие, особые доспехи, железо, травы и части чудовищ через Google Play. Мелочи теперь дешевле: травы и болотное железо — от 0,19 $.' },
};
for (const l of ['fr', 'es', 'pt', 'ja', 'zh', 'ar', 'ru']) { const d = {}; for (const [en, t] of Object.entries(ROWS)) if (t[l]) d[en] = t[l]; addLang(l, d); }
})();
