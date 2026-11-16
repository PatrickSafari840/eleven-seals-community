/* =====================================================================
   THE ELEVEN SEALS - lang/worldquests.js
   Translations of the quests that come from the world (src/worldquests.js):
   border defence, caravan escorts, shortages and royal requests.
   One row per text: [English, fr, es, pt, ja, zh].
   # is any number (keep the same order), {x} is a blank (a name).
   ===================================================================== */
(function () {
const ROWS = [
  // ---------- on the notice board and in the Journal ----------
  ['Defend the border against {k}', 'Défendre la frontière contre {k}', 'Defender la frontera contra {k}', 'Defender a fronteira contra {k}', '{k}から国境を守る', '抵御{k}，守卫边境'],
  ['Escort a caravan to {t}', 'Escorter une caravane jusqu’à {t}', 'Escoltar una caravana hasta {t}', 'Escoltar uma caravana até {t}', '{t}まで隊商を護衛する', '护送商队前往{t}'],
  ['Shortage: bring # {item}', 'Pénurie : apporte # {item}', 'Escasez: trae # {item}', 'Escassez: traz # {item}', '品不足：{item}を#個持ってくる', '短缺：带来 # 份{item}'],
  // fish and hides: their own rows, so "Fish" is not read as the verb on the Fish button
  ['Shortage: bring # Fish', 'Pénurie : apporte # poissons', 'Escasez: trae # peces', 'Escassez: traz # peixes', '品不足：魚を#匹持ってくる', '短缺：带来 # 条鱼'],
  ['Shortage: bring # Hide', 'Pénurie : apporte # peaux', 'Escasez: trae # pieles', 'Escassez: traz # peles', '品不足：毛皮を#枚持ってくる', '短缺：带来 # 张兽皮'],
  ['Royal request: bring # {item} from {k}', 'Requête royale : rapporte # {item} de {k}', 'Petición real: trae # {item} de {k}', 'Pedido real: traz # {item} de {k}', '王の頼み：{k}の{item}を#個持ってくる', '王室请求：从{k}带回 # 份{item}'],
  ['present it at the castle in {c}', 'à présenter au château de {c}', 'preséntalo en el castillo de {c}', 'apresenta-o no castelo de {c}', '{c}の城で献上する', '到{c}的城堡呈上'],
  ['from {k}', 'de {k}', 'de {k}', 'de {k}', '{k}産', '来自{k}'],
  ['win battles on the {k} front', 'gagne des batailles sur le front de {k}', 'gana batallas en el frente de {k}', 'ganha batalhas na frente de {k}', '{k}との前線で戦いに勝つ', '在{k}前线打赢战斗'],
  ['reach {t} by day #', 'atteins {t} avant le jour #', 'llega a {t} antes del día #', 'chega a {t} até ao dia #', '#日目までに{t}に着く', '第 # 天前抵达{t}'],
  ['Border held. Claim it at any notice board.', 'Frontière tenue. Réclame ta prime à n’importe quel tableau d’annonces.', 'Frontera defendida. Cóbralo en cualquier tablón de anuncios.', 'Fronteira defendida. Recebe no quadro de avisos que quiseres.', '国境は守られた。どの掲示板でも報酬を受け取れる。', '边境守住了。到任意布告栏领取赏金。'],
  ['The caravan reached {t} safely. Claim your pay at any notice board.', 'La caravane est arrivée à {t} sans encombre. Réclame ta paie à n’importe quel tableau d’annonces.', 'La caravana llegó a {t} sana y salva. Cobra tu paga en cualquier tablón de anuncios.', 'A caravana chegou a {t} em segurança. Recebe o pagamento no quadro de avisos que quiseres.', '隊商は無事に{t}に着いた。どの掲示板でも報酬を受け取れる。', '商队平安抵达{t}。到任意布告栏领取报酬。'],
  // ---------- caravans on the road ----------
  ['The caravan turns back', 'La caravane fait demi-tour', 'La caravana da media vuelta', 'A caravana dá meia-volta', '隊商は引き返した', '商队折返了'],
  ['You took too long. The merchants bound for <b>{t}</b> gave up on you and hired other guards.', 'Tu as mis trop de temps. Les marchands en route pour <b>{t}</b> ont renoncé à toi et engagé d’autres gardes.', 'Tardaste demasiado. Los mercaderes que iban a <b>{t}</b> se cansaron de esperarte y contrataron a otros guardias.', 'Demoraste demasiado. Os mercadores a caminho de <b>{t}</b> desistiram de ti e contrataram outros guardas.', '時間がかかりすぎた。<b>{t}</b>へ向かう商人たちはあなたを見限り、別の護衛を雇った。', '你耽搁得太久了。前往<b>{t}</b>的商人们不再等你，另雇了护卫。'],
  ['Caravan raider', 'Pillard de caravanes', 'Asaltacaravanas', 'Salteador de caravanas', '隊商襲撃者', '劫掠商队的匪徒'],
  ['Raiders burst from cover and go for the wagons!', 'Des pillards jaillissent de leur cachette et se ruent sur les chariots !', '¡Unos asaltantes salen de su escondite y van a por los carros!', 'Salteadores saem do esconderijo e atiram-se às carroças!', '襲撃者たちが物陰から飛び出し、荷車に襲いかかった！', '劫匪从藏身处冲出来，扑向货车！'],
  ['The caravan is safe', 'La caravane est sauve', 'La caravana está a salvo', 'A caravana está a salvo', '隊商は無事だ', '商队安全了'],
  ['The drivers whip the oxen on. <b>{t}</b> is still waiting.', 'Les conducteurs fouettent les bœufs. <b>{t}</b> attend toujours.', 'Los carreteros arrean a los bueyes. <b>{t}</b> sigue esperando.', 'Os carreteiros chicoteiam os bois. <b>{t}</b> continua à espera.', '御者たちが牛に鞭を入れる。<b>{t}</b>が待っている。', '车夫们挥鞭赶牛。<b>{t}</b>还在等着。'],
  // ---------- royal requests ----------
  ['Hear the ruler’s request', 'Écouter la requête du souverain', 'Escuchar la petición del soberano', 'Ouvir o pedido do soberano', '王の頼みを聞く', '聆听统治者的请求'],
  ['A royal request', 'Une requête royale', 'Una petición real', 'Um pedido real', '王の頼み', '王室请求'],
  ['“I want # {item} from {k} on the wall of this hall, so my lords remember what waits beyond our borders.”', '« Je veux # {item} de {k} au mur de cette salle, pour que mes seigneurs se souviennent de ce qui attend au-delà de nos frontières. »', '«Quiero # {item} de {k} en la pared de este salón, para que mis señores recuerden lo que espera más allá de nuestras fronteras».', '«Quero # {item} de {k} na parede deste salão, para que os meus senhores se lembrem do que espera para lá das nossas fronteiras.»', '「{k}の{item}を#個、この広間の壁に飾りたい。国境の向こうに何が待っているか、家臣たちが忘れぬようにな」', '“我要 # 份来自{k}的{item}挂在这大厅的墙上，好让我的臣子们记得边境之外有什么在等着。”'],
  ['“Someone dear to me has fallen ill, and our healers say only {item} from {k} will help. Bring me #.”', '« Quelqu’un qui m’est cher est tombé malade, et nos guérisseurs disent qu’une seule chose pourra aider : {item}, de {k}. Apporte-m’en #. »', '«Alguien a quien quiero ha enfermado, y nuestros sanadores dicen que solo {item} de {k} puede ayudar. Tráeme #».', '«Alguém que me é querido adoeceu, e os nossos curandeiros dizem que só {item} de {k} pode ajudar. Traz-me #.»', '「大切な者が病に倒れた。治療師たちは、{k}の{item}でなければ効かぬと言う。#個持ってきてくれ」', '“我的一位至亲病倒了，医师们说只有{k}的{item}才有用。给我带 # 份来。”'],
  ['Reward: <b># gold</b>, <b># XP</b> and the ruler’s favour. Bring it here, to the castle in {c}.', 'Récompense : <b># or</b>, <b># XP</b> et la faveur du souverain. Rapporte-le ici, au château de {c}.', 'Recompensa: <b># de oro</b>, <b># PX</b> y el favor del soberano. Tráelo aquí, al castillo de {c}.', 'Recompensa: <b># de ouro</b>, <b># XP</b> e o favor do soberano. Traz aqui, ao castelo de {c}.', '報酬：<b>金貨#枚</b>、<b>#XP</b>、そして王の好意。{c}の城まで持ってくること。', '奖励：<b>#金币</b>、<b>#经验</b>，以及统治者的青睐。把它带到{c}的城堡来。'],
  ['Request accepted. See it in your Journal.', 'Requête acceptée. Retrouve-la dans ton Journal.', 'Petición aceptada. Consúltala en tu Diario.', 'Pedido aceite. Vê-o no teu Diário.', '頼みを引き受けた。日誌で確認できる。', '已接受请求。可在日志中查看。'],
  ['Present the {item}', 'Présenter : {item}', 'Presentar: {item}', 'Apresentar: {item}', '{item}を献上する', '呈上{item}'],
  ['the ruler’s request', 'la requête du souverain', 'la petición del soberano', 'o pedido do soberano', '王の頼み', '统治者的请求'],
  ['The ruler is pleased', 'Le souverain est satisfait', 'El soberano está complacido', 'O soberano está satisfeito', '王は満足している', '统治者很满意'],
  ['The {title} takes it in both hands. “You went to {k} for this. {k2} will not forget.”', 'Le {title} le prend à deux mains. « Tu es allé jusqu’à {k} pour cela. {k2} ne l’oubliera pas. »', 'El {title} lo toma con ambas manos. «Fuiste hasta {k} por esto. {k2} no lo olvidará».', 'O {title} pega nele com as duas mãos. «Foste até {k} por isto. {k2} não vai esquecer.»', '{title}は両手でそれを受け取る。「このために{k}まで行ってくれたのか。{k2}は忘れぬ」', '{title}双手接过。“你为此远赴{k}。{k2}不会忘记。”'],
  ['You receive <b># gold</b> and <b># XP</b>.', 'Tu reçois <b># or</b> et <b># XP</b>.', 'Recibes <b># de oro</b> y <b># PX</b>.', 'Recebes <b># de ouro</b> e <b># XP</b>.', '<b>金貨#枚</b>と<b>#XP</b>を受け取った。', '你获得<b>#金币</b>和<b>#经验</b>。'],
  ['you did the ruler a favour', 'tu as rendu service au souverain', 'le hiciste un favor al soberano', 'fizeste um favor ao soberano', '王に恩を売った', '你帮了统治者一个忙'],
];
const IDS = ['fr', 'es', 'pt', 'ja', 'zh'];
IDS.forEach((id, i) => { const d = {}; for (const r of ROWS) if (r[i + 1]) d[r[0]] = r[i + 1]; addLang(id, d); });
})();
