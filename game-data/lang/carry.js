/* =====================================================================
   THE ELEVEN SEALS - lang/carry.js
   Translations of carry weight, bags, the pack mule and the storage
   chest (src/carry.js). One row per text: [English, fr, es, pt, ja, zh].
   # is any number or amount, {x} is a blank.
   ===================================================================== */
(function () {
const ROWS = [
  ['Load: {w} of {c}', 'Charge : {w} sur {c}', 'Carga: {w} de {c}', 'Carga: {w} de {c}', '荷物：{w} / {c}', '负重：{w} / {c}'],
  ['overloaded', 'surchargé', 'sobrecargado', 'sobrecarregado', '重量オーバー', '超重'],
  ['heavy', 'lourd', 'pesado', 'pesado', '重い', '很重'],
  ['You are carrying too much! Every step is slow. Sell, store or drop something.', 'Tu portes trop de choses ! Chaque pas est lent. Vends, range ou laisse quelque chose.', '¡Llevas demasiado peso! Cada paso es lento. Vende, guarda o deja algo.', 'Estás a carregar demasiado! Cada passo é lento. Vende, guarda ou larga alguma coisa.', '荷物が多すぎる！一歩一歩が遅い。何かを売るか、預けるか、捨てよう。', '你背的东西太多了！每一步都很慢。卖掉、存放或丢掉一些东西吧。'],
  ['Your pack is getting heavy. You walk a little slower.', 'Ton sac devient lourd. Tu marches un peu moins vite.', 'Tu mochila empieza a pesar. Caminas un poco más despacio.', 'A tua mochila está a ficar pesada. Andas um pouco mais devagar.', '荷物が重くなってきた。歩みが少し遅くなる。', '你的背包越来越沉，走得慢了一些。'],
  ['With nothing to eat, your mule slipped its rope in the night and is gone.', 'Faute de nourriture, ta mule a défait sa corde pendant la nuit et s’est enfuie.', 'Sin nada que comer, tu mula se soltó de la cuerda por la noche y se fue.', 'Sem nada para comer, a tua mula soltou-se da corda durante a noite e foi-se.', '食べる物がなく、ラバは夜のうちに綱を外していなくなった。', '没东西吃，你的骡子夜里挣脱绳子跑了。'],
  ['Bags', 'Sacs', 'Bolsas', 'Sacos', '鞄', '背包'],
  ['Cloth pouch', 'Bourse en toile', 'Bolsa de tela', 'Bolsa de pano', '布の袋', '布袋'],
  ['Leather bag', 'Sac en cuir', 'Bolsa de cuero', 'Saco de couro', '革の鞄', '皮背包'],
  ['Travel pack', 'Sac de voyage', 'Mochila de viaje', 'Mochila de viagem', '旅の背負い袋', '旅行背包'],
  ['carries #', 'contient #', 'lleva #', 'leva #', '容量 #', '可装 #'],
  ['you carry #', 'le tien : #', 'la tuya: #', 'a tua: #', '今の鞄 #', '你现在的：#'],
  ['capitals only', 'capitales seulement', 'solo en capitales', 'só nas capitais', '首都のみ', '仅限首都'],
  ['Your new {bag} holds {kg}.', 'Ton nouveau {bag} contient {kg}.', 'Tu nueva {bag} lleva {kg}.', 'A tua nova {bag} leva {kg}.', '新しい{bag}には{kg}入る。', '你的新{bag}能装{kg}。'],
  ['mule', 'mule', 'mula', 'mula', 'ラバ', '骡子'],
  ['Buy a pack mule', 'Acheter une mule de bât', 'Comprar una mula de carga', 'Comprar uma mula de carga', '荷運びのラバを買う', '买一头驮骡'],
  ['+# kg', '+# kg', '+# kg', '+# kg', '+# kg', '+# kg'],
  ['eats 1 food a day', 'mange 1 ration par jour', 'come 1 ración al día', 'come 1 ração por dia', '1日に食料1つを食べる', '每天吃 1 份食物'],
  ['A pack mule', 'Une mule de bât', 'Una mula de carga', 'Uma mula de carga', '荷運びのラバ', '一头驮骡'],
  ['The stable boy leads out a patient grey mule. It sniffs your pockets for food.', 'Le garçon d’écurie amène une mule grise et patiente. Elle renifle tes poches en quête de nourriture.', 'El mozo de cuadra saca una mula gris y paciente. Te olfatea los bolsillos buscando comida.', 'O moço da estrebaria traz uma mula cinzenta e paciente. Ela cheira-te os bolsos à procura de comida.', '馬丁がおとなしい灰色のラバを連れてくる。ラバはあなたのポケットの匂いを嗅いで食べ物を探す。', '马童牵出一头温顺的灰骡子。它在你的口袋里嗅来嗅去找吃的。'],
  ['You can carry # more. It eats 1 food a day; with no food it will wander off.', 'Tu peux porter # de plus. Elle mange 1 ration par jour ; sans nourriture, elle s’en ira.', 'Puedes llevar # más. Come 1 ración al día; sin comida, se marchará.', 'Podes levar mais #. Come 1 ração por dia; sem comida, vai-se embora.', 'さらに#運べる。1日に食料1つを食べる。食べ物がなければ、どこかへ行ってしまう。', '你能多背 #。它每天吃 1 份食物；没有食物，它就会走掉。'],
  ['Storage chest', 'Coffre de rangement', 'Cofre de almacenaje', 'Baú de arrumação', '保管箱', '储物箱'],
  ['Wooden chest', 'Coffre en bois', 'Cofre de madera', 'Baú de madeira', '木箱', '木箱'],
  ['Storeroom', 'Réserve', 'Despensa', 'Arrecadação', '物置部屋', '储藏室'],
  ['Cellar', 'Cave', 'Bodega', 'Adega', '地下貯蔵庫', '地窖'],
  ['The chest is full.', 'Le coffre est plein.', 'El cofre está lleno.', 'O baú está cheio.', '箱がいっぱいだ。', '箱子满了。'],
  ['In the chest', 'Dans le coffre', 'En el cofre', 'No baú', '箱の中', '箱子里'],
  ['In your bag', 'Dans ton sac', 'En tu bolsa', 'No teu saco', '鞄の中', '背包里'],
  ['each', 'chacun', 'cada uno', 'cada', '1つあたり', '每个'],
  ['Rations', 'Rations', 'Raciones', 'Rações', '携帯食', '口粮'],
  ['Take 1', 'Prendre 1', 'Coger 1', 'Tirar 1', '1つ取る', '取 1'],
  ['Take 5', 'Prendre 5', 'Coger 5', 'Tirar 5', '5つ取る', '取 5'],
  ['Take all', 'Tout prendre', 'Cogerlo todo', 'Tirar tudo', 'すべて取る', '全部取出'],
  ['Take', 'Prendre', 'Coger', 'Tirar', '取る', '取出'],
  ['Store 1', 'Ranger 1', 'Guardar 1', 'Guardar 1', '1つ預ける', '存 1'],
  ['Store 5', 'Ranger 5', 'Guardar 5', 'Guardar 5', '5つ預ける', '存 5'],
  ['Store all', 'Tout ranger', 'Guardarlo todo', 'Guardar tudo', 'すべて預ける', '全部存放'],
  ['Store', 'Ranger', 'Guardar', 'Guardar', '預ける', '存放'],
  ['Empty.', 'Vide.', 'Vacío.', 'Vazio.', '空っぽだ。', '空的。'],
  ['Make room', 'Faire de la place', 'Hacer sitio', 'Arranjar espaço', '場所を広げる', '扩建'],
  ['A bigger chest: # space.', 'Un coffre plus grand : # de place.', 'Un cofre más grande: # de espacio.', 'Um baú maior: # de espaço.', 'もっと大きな箱：容量#。', '更大的箱子：容量 #。'],
  ['the builders need a day', 'les ouvriers ont besoin d’une journée', 'los obreros necesitan un día', 'os construtores precisam de um dia', '職人に1日かかる', '工匠需要一天'],
  ['Build', 'Construire', 'Construir', 'Construir', '建てる', '建造'],
  ['A day of sawing and hammering, and it is done. Your chest now holds #.', 'Une journée à scier et à marteler, et c’est fini. Ton coffre contient maintenant #.', 'Un día de serrar y martillear, y está hecho. Tu cofre ahora guarda #.', 'Um dia a serrar e a martelar, e está feito. O teu baú agora leva #.', '1日がかりで鋸を引き、槌を打ち、完成した。箱には#入るようになった。', '锯了一天、敲了一天，终于完工。你的箱子现在能装 #。'],
  ['Your things are safe here, in the room you sleep in. Only you have the key.', 'Tes affaires sont en sécurité ici, dans la chambre où tu dors. Toi seul as la clé.', 'Tus cosas están a salvo aquí, en la habitación donde duermes. Solo tú tienes la llave.', 'As tuas coisas estão seguras aqui, no quarto onde dormes. Só tu tens a chave.', '寝泊まりする部屋なら、荷物は安全だ。鍵を持っているのはあなただけ。', '你的东西放在你睡觉的房间里，很安全。只有你有钥匙。'],
  ['This is your old chest. You no longer sleep here, but your things are still safe.', 'C’est ton ancien coffre. Tu ne dors plus ici, mais tes affaires sont toujours en sécurité.', 'Es tu antiguo cofre. Ya no duermes aquí, pero tus cosas siguen a salvo.', 'É o teu baú antigo. Já não dormes aqui, mas as tuas coisas continuam seguras.', '前に使っていた箱だ。もうここでは寝ていないが、荷物は無事だ。', '这是你以前的箱子。你已经不住这里了，但东西还安然无恙。'],
];
const IDS = ['fr', 'es', 'pt', 'ja', 'zh'];
IDS.forEach((id, i) => { const d = {}; for (const r of ROWS) if (r[i + 1]) d[r[0]] = r[i + 1]; addLang(id, d); });
})();
