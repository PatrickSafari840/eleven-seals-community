/* =====================================================================
   THE ELEVEN SEALS - lang/group.js
   Translations of group battles and hired sellswords (src/group.js).
   One row per text: [English, fr, es, pt, ja, zh].
   # is any number, {x} is a blank (a name).
   ===================================================================== */
(function () {
const ROWS = [
  ['There are # of them!', 'Ils sont # !', '¡Son #!', 'São #!', '敵は#体いる！', '他们有 # 个！'],
  ['<b>{a} falls!</b> {b} steps up.', '<b>{a} tombe !</b> {b} prend sa place.', '<b>¡{a} cae!</b> {b} da un paso al frente.', '<b>{a} cai!</b> {b} avança.', '<b>{a}が倒れた！</b>{b}が前に出る。', '<b>{a}倒下了！</b>{b}顶了上来。'],
  ['{n} bleeds for <b>#</b>.', '{n} saigne : <b>#</b>.', '{n} sangra: <b>#</b>.', '{n} sangra: <b>#</b>.', '{n}は出血で<b>#</b>。', '{n}流血 <b>#</b>。'],
  ['{n} the sellsword strikes for <b>#</b>.', '{n} le mercenaire frappe pour <b>#</b>.', '{n}, el mercenario, ataca por <b>#</b>.', '{n}, o mercenário, ataca por <b>#</b>.', '傭兵{n}の攻撃、<b>#</b>。', '佣兵{n}造成 <b>#</b> 点伤害。'],
  ['The enemy goes for {n}!', 'L’ennemi s’en prend à {n} !', '¡El enemigo va a por {n}!', 'O inimigo vai atrás de {n}!', '敵が{n}に襲いかかる！', '敌人冲向了{n}！'],
  ['Badly hurt, {n} is carried off the field. Your contract is over.', 'Gravement blessé, {n} est emporté loin du combat. Votre contrat est terminé.', 'Malherido, {n} es sacado del campo. Vuestro contrato ha terminado.', 'Gravemente ferido, {n} é levado do campo. O vosso contrato acabou.', '深手を負った{n}は戦場から運び出された。契約はここまでだ。', '{n}伤势严重，被抬下了战场。你们的契约结束了。'],
  ['{n} the sellsword’s contract is over. They head back to the city.', 'Le contrat de {n} le mercenaire est terminé. Il repart vers la ville.', 'El contrato de {n}, el mercenario, ha terminado. Vuelve a la ciudad.', 'O contrato de {n}, o mercenário, acabou. Volta para a cidade.', '傭兵{n}の契約が切れた。街へ帰っていく。', '佣兵{n}的契约到期了，回城去了。'],
  ['Hire a sellsword', 'Engager un mercenaire', 'Contratar un mercenario', 'Contratar um mercenário', '傭兵を雇う', '雇佣一名佣兵'],
  ['{n} the sellsword is with you', '{n} le mercenaire est avec toi', '{n}, el mercenario, va contigo', '{n}, o mercenário, está contigo', '傭兵{n}が同行している', '佣兵{n}与你同行'],
  ['until day #', 'jusqu’au jour #', 'hasta el día #', 'até ao dia #', '#日目まで', '直到第 # 天'],
  ['{n} the sellsword', '{n} le mercenaire', '{n}, el mercenario', '{n}, o mercenário', '傭兵{n}', '佣兵{n}'],
  ['{n} will fight beside you until day #.', '{n} se battra à tes côtés jusqu’au jour #.', '{n} luchará a tu lado hasta el día #.', '{n} vai lutar ao teu lado até ao dia #.', '{n}は#日目まであなたと共に戦う。', '{n}会和你并肩作战，直到第 # 天。'],
  ['A scarred fighter of {k} counts your coins twice, then shoulders a pack. “Three days. I fight, you lead. If it goes bad, I leave.”', 'Un combattant balafré de {k} compte deux fois tes pièces, puis met son sac sur l’épaule. « Trois jours. Je me bats, tu mènes. Si ça tourne mal, je pars. »', 'Un luchador lleno de cicatrices de {k} cuenta tus monedas dos veces y se carga la mochila. «Tres días. Yo lucho, tú mandas. Si sale mal, me voy».', 'Um lutador marcado de cicatrizes de {k} conta as tuas moedas duas vezes e põe a mochila ao ombro. «Três dias. Eu luto, tu mandas. Se correr mal, vou-me embora.»', '{k}の傷だらけの戦士があなたの硬貨を二度数え、荷を担ぐ。「三日だ。俺が戦い、お前が率いる。まずくなったら、俺は抜ける」', '一名来自{k}、满身伤疤的战士把你的钱数了两遍，然后背起行囊。“三天。我打，你带路。要是情况不妙，我就走。”'],
];
const IDS = ['fr', 'es', 'pt', 'ja', 'zh'];
IDS.forEach((id, i) => { const d = {}; for (const r of ROWS) if (r[i + 1]) d[r[0]] = r[i + 1]; addLang(id, d); });
})();
