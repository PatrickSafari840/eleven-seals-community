/* =====================================================================
   THE ELEVEN SEALS - lang/townmap.js
   Translations of the walkable town map (src/townmap.js).
   One row per text: [English, fr, es, pt, ja, zh].
   ===================================================================== */
(function () {
const ROWS = [
  ['Town square', 'Place du village', 'Plaza', 'Praça', '広場', '广场'],
  ['Street', 'Rue', 'Calle', 'Rua', '通り', '街道'],
  ['Gate', 'Porte', 'Puerta', 'Portão', '門', '城门'],
  ['Tap a glowing hex next to you to walk there.', 'Touche une case lumineuse à côté de toi pour y aller.', 'Toca una casilla iluminada a tu lado para ir allí.', 'Toca numa casa iluminada ao teu lado para ires até lá.', '隣の光っているマスをタップすると、そこへ歩いていく。', '点你身边发光的格子，就能走过去。'],
  ['You walk down a narrow street.', 'Tu descends une rue étroite.', 'Bajas por una calle estrecha.', 'Desces uma rua estreita.', '細い通りを歩いていく。', '你走在一条窄窄的街上。'],
  ['Step on a building to go in.', 'Marche sur un bâtiment pour y entrer.', 'Pisa un edificio para entrar.', 'Pisa um edifício para entrares.', '建物のマスに進むと中に入る。', '走到建物格子上就能进去。'],
  ['Walk the streets', 'Parcourir les rues', 'Recorrer las calles', 'Percorrer as ruas', '町を歩く', '逛逛街道'],
  ['the town as a map: walk from building to building', 'la ville en carte : va de bâtiment en bâtiment', 'el pueblo como mapa: ve de edificio en edificio', 'a vila como mapa: anda de edifício em edifício', '町を地図で：建物から建物へ歩く', '把城镇看成地图：从一栋建筑走到另一栋'],
  ['List view', 'Vue en liste', 'Vista de lista', 'Vista em lista', '一覧表示', '列表视图'],
  ['all the buildings as buttons', 'tous les bâtiments en boutons', 'todos los edificios como botones', 'todos os edifícios como botões', 'すべての建物をボタンで表示', '所有建筑都显示为按钮'],
];
const IDS = ['fr', 'es', 'pt', 'ja', 'zh'];
IDS.forEach((id, i) => { const d = {}; for (const r of ROWS) if (r[i + 1]) d[r[0]] = r[i + 1]; addLang(id, d); });
})();
