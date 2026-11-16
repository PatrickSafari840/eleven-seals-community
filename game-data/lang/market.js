/* =====================================================================
   THE ELEVEN SEALS - lang/market.js
   Translations of the Rare Goods Market and the level-up gift (src/market.js).
   One row per text: [English, fr, es, pt, ja, zh].
   ===================================================================== */
(function () {
const ROWS = [
  ['Rare Goods Market', 'Marché des raretés', 'Mercado de rarezas', 'Mercado de raridades', '希少品市場', '珍品市场'],
  ['Market', 'Marché', 'Mercado', 'Mercado', '市場', '市场'],
  ['Real money', 'Argent réel', 'Dinero real', 'Dinheiro real', '現金払い', '真实货币'],
  ['Legendary weapons, special armour, the rarest materials', 'Armes légendaires, armures spéciales, matériaux rarissimes', 'Armas legendarias, armaduras especiales, los materiales más raros', 'Armas lendárias, armaduras especiais, os materiais mais raros', '伝説の武器、特別な鎧、最も希少な素材', '传说武器、特殊护甲、最稀有的材料'],
  ['The Rare Goods Market is not switched on in this version of the game.', 'Le Marché des raretés n’est pas activé dans cette version du jeu.', 'El Mercado de rarezas no está activado en esta versión del juego.', 'O Mercado de raridades não está ativado nesta versão do jogo.', 'このバージョンのゲームでは、希少品市場はまだ有効になっていない。', '此版本的游戏尚未开放珍品市场。'],
  ['Ink-iron is otherwise only taken from the guardians of the Seals; each monster part only from the monsters of its kingdom.', 'Sinon, l’encre-fer ne se prend qu’aux gardiens des Sceaux, et chaque trophée de monstre qu’aux monstres de son royaume.', 'Si no, el hierro de tinta solo se obtiene de los guardianes de los Sellos, y cada pieza de monstruo solo de los monstruos de su reino.', 'De outro modo, o ferro-tinta só se tira aos guardiões dos Selos, e cada parte de monstro só aos monstros do seu reino.', '墨鉄は本来、封印の守護者からしか得られず、魔物の素材はその王国の魔物からしか取れない。', '墨铁平时只能从封印守护者身上取得，各种怪物材料也只能从其王国的怪物身上获得。'],
  ['legendary weapons, the finest armour, the rarest materials', 'armes légendaires, armures d’élite, matériaux rarissimes', 'armas legendarias, las mejores armaduras, los materiales más raros', 'armas lendárias, as melhores armaduras, os materiais mais raros', '伝説の武器、最上の鎧、最も希少な素材', '传说武器、顶级护甲、最稀有的材料'],
  ['Legendary weapons, the finest armour, the rarest materials', 'Armes légendaires, armures d’élite, matériaux rarissimes', 'Armas legendarias, las mejores armaduras, los materiales más raros', 'Armas lendárias, as melhores armaduras, os materiais mais raros', '伝説の武器、最上の鎧、最も希少な素材', '传说武器、顶级护甲、最稀有的材料'],
  ['“Only the finest, brought to you wherever you stand. Legends are not cheap, hunter.”', '« Seulement le meilleur, livré où que tu sois. Les légendes ne sont pas bon marché, chasseur. »', '«Solo lo mejor, llevado allí donde estés. Las leyendas no son baratas, cazador.»', '«Só o melhor, entregue onde quer que estejas. As lendas não são baratas, caçador.»', '「最上の品だけを、どこにいても届けよう。伝説は安くないぞ、狩人。」', '“只有最好的货，无论你身在何处都送到你手上。传说可不便宜，猎人。”'],
  ['Weapons', 'Armes', 'Armas', 'Armas', '武器', '武器'],
  ['Armour', 'Armures', 'Armaduras', 'Armaduras', '鎧', '护甲'],
  ['Materials', 'Matériaux', 'Materiales', 'Materiais', '素材', '材料'],
  ['Legendary', 'Légendaire', 'Legendaria', 'Lendária', '伝説', '传说'],
  ['vs yours', 'par rapport à la tienne', 'frente a la tuya', 'em relação à tua', '今の装備比', '与你的相比'],
  ['in your hand', 'en main', 'en tu mano', 'na tua mão', '装備中', '手中'],
  ['owned', 'possédé', 'en tu poder', 'tens', '所持', '已拥有'],
  ['worn', 'porté', 'puesto', 'vestido', '着用中', '已穿戴'],
  ['requires level #', 'niveau # requis', 'requiere nivel #', 'requer nível #', 'レベル#が必要', '需要等级 #'],
  ['Level #', 'Niveau #', 'Nivel #', 'Nível #', 'レベル#', '等级 #'],
  ['You now wield {w}!', 'Tu manies maintenant {w} !', '¡Ahora empuñas {w}!', 'Agora empunhas {w}!', '{w}を手にした！', '你现在手持{w}！'],
  ['You put on the {a}.', 'Tu enfiles : {a}.', 'Te pones: {a}.', 'Vestes: {a}.', '{a}を身につけた。', '你穿上了{a}。'],
  ['A few of each come in every day. Ink-iron is otherwise only taken from the guardians of the Seals; each monster part only from the monsters of its kingdom.',
    'Quelques exemplaires de chaque arrivent chaque jour. Sinon, l’encre-fer ne se prend qu’aux gardiens des Sceaux, et chaque trophée de monstre qu’aux monstres de son royaume.',
    'Cada día llegan unos pocos de cada uno. Si no, el hierro de tinta solo se obtiene de los guardianes de los Sellos, y cada pieza de monstruo solo de los monstruos de su reino.',
    'Todos os dias chegam alguns de cada. De outro modo, o ferro-tinta só se tira aos guardiões dos Selos, e cada parte de monstro só aos monstros do seu reino.',
    '毎日それぞれ少しずつ入荷する。墨鉄は本来、封印の守護者からしか得られず、魔物の素材はその王国の魔物からしか取れない。',
    '每样每天只进几件。墨铁平时只能从封印守护者身上取得，各种怪物材料也只能从其王国的怪物身上获得。'],
  ['From the monsters of {k}.', 'Des monstres de {k}.', 'De los monstruos de {k}.', 'Dos monstros de {k}.', '{k}の魔物から。', '来自{k}的怪物。'],
  ['you have #', 'tu en as #', 'tienes #', 'tens #', '所持 #', '你有 #'],
  ['# left today', 'encore # aujourd’hui', 'quedan # hoy', 'restam # hoje', '本日残り#', '今天还剩 #'],
  ['sold out until tomorrow', 'épuisé jusqu’à demain', 'agotado hasta mañana', 'esgotado até amanhã', '明日まで売り切れ', '售罄，明天补货'],
  ['Bought: {x}.', 'Acheté : {x}.', 'Comprado: {x}.', 'Comprado: {x}.', '購入：{x}。', '已购买：{x}。'],
  // the top techniques (TOP_TECH in src/combat.js, techDesc in src/places.js)
  ['top technique', 'technique suprême', 'técnica suprema', 'técnica suprema', '奥義', '绝技'],
  ['halve damage 4 turns', 'dégâts réduits de moitié pendant 4 tours', 'reduce el daño a la mitad 4 turnos', 'reduz o dano para metade durante 4 turnos', '4ターンの間ダメージ半減', '4回合内伤害减半'],
  ['{t}: your blows grow much heavier for # turns.', '{t} : tes coups deviennent bien plus lourds pendant # tours.', '{t}: tus golpes se vuelven mucho más pesados durante # turnos.', '{t}: os teus golpes ficam muito mais pesados durante # turnos.', '{t}：#ターンの間、攻撃がはるかに重くなる。', '{t}：#回合内，你的攻击变得沉重得多。'],
  ['A gift for your new level:', 'Un cadeau pour ton nouveau niveau :', 'Un regalo por tu nuevo nivel:', 'Um presente pelo teu novo nível:', '新しいレベルへの贈り物：', '新等级的礼物：'],
];
const IDS = ['fr', 'es', 'pt', 'ja', 'zh'];
IDS.forEach((id, i) => { const d = {}; for (const r of ROWS) if (r[i + 1]) d[r[0]] = r[i + 1]; addLang(id, d); });
})();
