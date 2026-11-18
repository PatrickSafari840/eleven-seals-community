/* THE ELEVEN SEALS - lang/limits.js
   Translations for one-of-each tools (torch, net) and the fishing rest (src/events.js, src/shops.js, src/beasts.js).
   Keys are the English text; # is a number. */
(function () {
const ROWS = {
  'Torch':                                  { fr: 'Torche', es: 'Antorcha', pt: 'Tocha', ja: '松明', zh: '火把', ar: 'مشعل', ru: 'Факел' },
  'light in the dark of the Seals':         { fr: 'de la lumière dans le noir des Sceaux', es: 'luz en la oscuridad de los Sellos', pt: 'luz na escuridão dos Selos', ja: '封印の闇を照らす', zh: '照亮封印中的黑暗', ar: 'نور في ظلام الأختام', ru: 'свет во тьме Печатей' },
  'you can carry only one':                 { fr: 'tu ne peux en porter qu’un', es: 'solo puedes llevar uno', pt: 'só podes levar um', ja: '持てるのは1つだけ', zh: '只能携带一个', ar: 'يمكنك حمل واحد فقط', ru: 'можно нести только один' },
  'you have one':                           { fr: 'tu en as un', es: 'ya tienes uno', pt: 'já tens um', ja: '持っている', zh: '你已有一个', ar: 'لديك واحد', ru: 'у тебя есть один' },
  'you have none · sold at general stores': { fr: 'tu n’en as pas · vendu au magasin général', es: 'no tienes ninguno · se vende en la tienda', pt: 'não tens nenhum · vende-se na loja', ja: '持っていない · 雑貨屋で売っている', zh: '你没有 · 杂货店有售', ar: 'ليس لديك واحد · يُباع في المتجر العام', ru: 'у тебя нет · продаётся в лавке' },
  'Catches left before the fish grow wary: #': { fr: 'Prises avant que les poissons se méfient : #', es: 'Capturas antes de que los peces desconfíen: #', pt: 'Capturas até os peixes desconfiarem: #', ja: '魚が警戒するまで、あと#匹', zh: '鱼儿警觉前还能钓：#', ar: 'صيد متبقٍّ قبل أن تحذر الأسماك: #', ru: 'Уловов, пока рыба не насторожится: #' },
  'The fish have grown wary of your hook. Wait # more days.': { fr: 'Les poissons se méfient de ton hameçon. Attends encore # jours.', es: 'Los peces desconfían de tu anzuelo. Espera # días más.', pt: 'Os peixes desconfiam do teu anzol. Espera mais # dias.', ja: '魚が針を警戒している。あと#日待とう。', zh: '鱼儿对你的鱼钩有了戒心。再等#天。', ar: 'صارت الأسماك تحذر صنّارتك. انتظر # أيام أخرى.', ru: 'Рыба насторожилась и не берёт наживку. Подожди ещё дней: #.' },
  'Stand next to a lake or river to fish. A rod cannot reach the fish of the open sea.': { fr: 'Place-toi près d’un lac ou d’une rivière pour pêcher. Une canne n’atteint pas les poissons du large.', es: 'Ponte junto a un lago o un río para pescar. Una caña no alcanza los peces del mar abierto.', pt: 'Fica junto a um lago ou rio para pescar. Uma cana não chega aos peixes do mar alto.', ja: '釣りは湖か川のそばで。竿では外海の魚に届かない。', zh: '站在湖边或河边才能钓鱼。鱼竿够不到远海的鱼。', ar: 'قف قرب بحيرة أو نهر لتصطاد. لا تصل الصنّارة إلى أسماك البحر المفتوح.', ru: 'Чтобы рыбачить, встань у озера или реки. Удочкой не достать рыбу открытого моря.' },
  'You receive a <b>torch</b>.':            { fr: 'Tu reçois une <b>torche</b>.', es: 'Recibes una <b>antorcha</b>.', pt: 'Recebes uma <b>tocha</b>.', ja: '<b>松明</b>をもらった。', zh: '你得到一支<b>火把</b>。', ar: 'تحصل على <b>مشعل</b>.', ru: 'Ты получаешь <b>факел</b>.' },
};
for (const l of ['fr', 'es', 'pt', 'ja', 'zh', 'ar', 'ru']) { const d = {}; for (const [en, t] of Object.entries(ROWS)) if (t[l]) d[en] = t[l]; addLang(l, d); }
})();
