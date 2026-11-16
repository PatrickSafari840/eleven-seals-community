/* =====================================================================
   THE ELEVEN SEALS - lang/community.js
   Translations of the Community card (src/title.js communityMenu).
   One row per text: [English, fr, es, pt, ja, zh].
   ===================================================================== */
(function () {
const ROWS = [
  ['Share my hero', 'Partager mon héros', 'Compartir mi héroe', 'Partilhar o meu herói', '英雄を共有', '分享我的英雄'],
  ['a card of your hero to save or send', 'une carte de ton héros à garder ou envoyer', 'una carta de tu héroe para guardar o enviar', 'um cartão do teu herói para guardar ou enviar', '保存や送信ができる英雄カード', '一张可保存或发送的英雄卡片'],
  ['start a game first', 'commence d’abord une partie', 'empieza primero una partida', 'começa primeiro um jogo', 'まずゲームを始めよう', '请先开始一局游戏'],
  ['Community page', 'Page de la communauté', 'Página de la comunidad', 'Página da comunidade', 'コミュニティページ', '社区页面'],
  ['news, kingdoms, Book of Monsters', 'nouveautés, royaumes, Livre des monstres', 'novedades, reinos, Libro de monstruos', 'novidades, reinos, Livro dos Monstros', 'お知らせ、王国、魔物の書', '新闻、王国、怪物之书'],
  ['Report a bug', 'Signaler un bug', 'Informar de un error', 'Reportar um erro', 'バグを報告', '报告问题'],
  ['tell us what went wrong', 'dis-nous ce qui n’a pas marché', 'cuéntanos qué salió mal', 'diz-nos o que correu mal', '何が起きたか教えてください', '告诉我们哪里出了问题'],
  ['Share your hero, report a bug, or tell us your stories:', 'Partage ton héros, signale un bug ou raconte-nous tes histoires :', 'Comparte tu héroe, informa de un error o cuéntanos tus historias:', 'Partilha o teu herói, reporta um erro ou conta-nos as tuas histórias:', '英雄を共有したり、バグを報告したり、冒険の話を聞かせてください：', '分享你的英雄、报告问题，或讲讲你的故事：'],
  ['Made by Patrick Safari. Pictures painted with GPT Image 2.5 on Higgsfield and Gemini; game written in plain JavaScript.',
    'Créé par Patrick Safari. Images peintes avec GPT Image 2.5 sur Higgsfield et Gemini ; jeu écrit en JavaScript pur.',
    'Hecho por Patrick Safari. Imágenes pintadas con GPT Image 2.5 en Higgsfield y Gemini; juego escrito en JavaScript puro.',
    'Feito por Patrick Safari. Imagens pintadas com GPT Image 2.5 no Higgsfield e no Gemini; jogo escrito em JavaScript puro.',
    '制作：Patrick Safari。絵はHiggsfieldとGeminiのGPT Image 2.5で描画。ゲームは素のJavaScriptで作られています。',
    '由Patrick Safari制作。图片使用Higgsfield和Gemini上的GPT Image 2.5绘制；游戏用纯JavaScript编写。'],
  // the level cap (src/game.js, src/ui.js) - kept here with the other small additions
  ['Max level', 'Niveau max', 'Nivel máximo', 'Nível máximo', '最大レベル', '最高等级'],
  ['You have reached the highest level, {n}.', 'Tu as atteint le plus haut niveau, {n}.', 'Has alcanzado el nivel más alto, {n}.', 'Chegaste ao nível mais alto, {n}.', '最高レベル{n}に到達した。', '你已达到最高等级 {n}。'],
  ['Meet other hunters', 'Rencontre d’autres chasseurs', 'Conoce a otros cazadores', 'Conhece outros caçadores', '他の狩人と出会おう', '结识其他猎人'],
];
const IDS = ['fr', 'es', 'pt', 'ja', 'zh'];
IDS.forEach((id, i) => { const d = {}; for (const r of ROWS) if (r[i + 1]) d[r[0]] = r[i + 1]; addLang(id, d); });
})();
