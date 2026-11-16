/* =====================================================================
   THE ELEVEN SEALS - lang/beasts.js
   Translations of the tamed beast companion (src/beasts.js).
   One row per text: [English, fr, es, pt, ja, zh].
   # is any number, {beast} is the animal's name.
   ===================================================================== */
(function () {
const ROWS = [
  ['snarls when you come close', 'grogne quand tu t’approches', 'gruñe cuando te acercas', 'rosna quando te aproximas', '近づくと唸る', '你一靠近就龇牙低吼'],
  ['watches you warily', 'te surveille avec méfiance', 'te vigila con recelo', 'vigia-te com desconfiança', '警戒してあなたを見ている', '警惕地盯着你'],
  ['follows at your heel', 'te suit pas à pas', 'te sigue de cerca', 'segue-te de perto', 'あなたの足元についてくる', '紧跟在你脚边'],
  ['would die for you', 'mourrait pour toi', 'moriría por ti', 'morreria por ti', 'あなたのためなら命も惜しまない', '愿意为你去死'],
  ['Caught!', 'Capturé !', '¡Atrapado!', 'Apanhado!', '捕まえた！', '抓住了！'],
  ['The net drops over the {beast}. It thrashes, then lies still, glaring at you.', 'Le filet tombe sur le {beast}. Il se débat, puis s’immobilise en te fusillant du regard.', 'La red cae sobre el {beast}. Se revuelve y luego se queda quieto, mirándote con rabia.', 'A rede cai sobre o {beast}. Debate-se e depois fica quieto, a olhar-te com raiva.', '網が{beast}にかぶさる。暴れたあと、じっとしてあなたを睨みつける。', '网罩住了{beast}。它挣扎了一阵，然后一动不动，狠狠地瞪着你。'],
  ['It is yours now, but it is not tame. Feed it every day, care for it, and it may learn to trust you.', 'Il est à toi maintenant, mais il n’est pas apprivoisé. Nourris-le chaque jour, prends soin de lui, et il apprendra peut-être à te faire confiance.', 'Ahora es tuyo, pero no está domado. Dale de comer cada día, cuídalo, y puede que aprenda a confiar en ti.', 'Agora é teu, mas não está domado. Alimenta-o todos os dias, cuida dele, e talvez aprenda a confiar em ti.', 'もうあなたのものだが、まだ懐いてはいない。毎日餌をやり、世話をすれば、信頼してくれるかもしれない。', '它现在归你了，但还没被驯服。每天喂它、照顾它，它也许会学着信任你。'],
  ['A fox will not fight for you, but once it trusts you it will scout ahead.', 'Un renard ne se battra pas pour toi, mais une fois en confiance il partira en éclaireur.', 'Un zorro no luchará por ti, pero cuando confíe en ti explorará por delante.', 'Uma raposa não luta por ti, mas quando confiar em ti vai à frente a explorar.', '狐は戦ってはくれないが、信頼すれば先を偵察してくれる。', '狐狸不会替你打仗，但一旦信任你，就会在前面替你探路。'],
  ['Once it trusts you, it will fight at your side.', 'Une fois en confiance, il se battra à tes côtés.', 'Cuando confíe en ti, luchará a tu lado.', 'Quando confiar em ti, vai lutar ao teu lado.', '信頼すれば、あなたの隣で戦ってくれる。', '一旦信任你，它就会在你身边作战。'],
  ['The {beast} tears through the net!', 'Le {beast} déchire le filet !', '¡El {beast} rompe la red!', 'O {beast} rasga a rede!', '{beast}が網を引き裂いた！', '{beast}撕破了网！'],
  ['Your {beast} strikes for <b>#</b>.', 'Ton {beast} frappe pour <b>#</b>.', 'Tu {beast} ataca por <b>#</b>.', 'O teu {beast} ataca por <b>#</b>.', 'あなたの{beast}の攻撃、<b>#</b>。', '你的{beast}造成 <b>#</b> 点伤害。'],
  ['<b>The heavy blow falls on your {beast}.</b> It does not get up again.', '<b>Le coup terrible s’abat sur ton {beast}.</b> Il ne se relève pas.', '<b>El golpe brutal cae sobre tu {beast}.</b> Ya no se levanta.', '<b>O golpe pesado cai sobre o teu {beast}.</b> Não se volta a levantar.', '<b>重い一撃があなたの{beast}を襲った。</b>二度と立ち上がらなかった。', '<b>重击落在你的{beast}身上。</b>它再也没能站起来。'],
  ['The enemy turns on your {beast}!', 'L’ennemi s’en prend à ton {beast} !', '¡El enemigo se lanza contra tu {beast}!', 'O inimigo vira-se contra o teu {beast}!', '敵があなたの{beast}に襲いかかった！', '敌人转而攻击你的{beast}！'],
  ['It limps out of the fight.', 'Il quitte le combat en boitant.', 'Sale del combate cojeando.', 'Sai do combate a coxear.', '足を引きずって戦いから離れる。', '它一瘸一拐地退出了战斗。'],
  ['Your {beast} trusts you now.', 'Ton {beast} te fait confiance maintenant.', 'Tu {beast} ya confía en ti.', 'O teu {beast} já confia em ti.', 'あなたの{beast}が心を許した。', '你的{beast}现在信任你了。'],
  ['Your {beast} went hungry today.', 'Ton {beast} n’a rien mangé aujourd’hui.', 'Tu {beast} ha pasado hambre hoy.', 'O teu {beast} passou fome hoje.', 'あなたの{beast}は今日、腹を空かせていた。', '你的{beast}今天饿着肚子。'],
  ['Your {beast} chewed through its rope and ran back to the wild.', 'Ton {beast} a rongé sa corde et est retourné à l’état sauvage.', 'Tu {beast} ha roído la cuerda y ha vuelto a la naturaleza.', 'O teu {beast} roeu a corda e voltou para a natureza.', 'あなたの{beast}は綱を噛み切って、野生に帰っていった。', '你的{beast}咬断绳子，跑回了野外。'],
  ['fights beside you', 'se bat à tes côtés', 'lucha a tu lado', 'luta ao teu lado', '共に戦う', '与你并肩作战'],
  ['wounded: rest at an inn or camp', 'blessé : repose-toi à une auberge ou au camp', 'herido: descansa en una posada o acampa', 'ferido: descansa numa estalagem ou acampa', '負傷：宿か野営で休ませよう', '受伤：在旅店或营地休息'],
  ['scouts ahead', 'part en éclaireur', 'explora por delante', 'explora à frente', '先を偵察する', '在前面探路'],
  ['not tame yet', 'pas encore apprivoisé', 'aún no está domado', 'ainda não está domado', 'まだ懐いていない', '还没被驯服'],
  ['eats # food a day', 'mange # ration(s) par jour', 'come # ración(es) al día', 'come # ração(ões) por dia', '1日に食料#つを食べる', '每天吃 # 份食物'],
  ['Care for it', 'S’en occuper', 'Cuidarlo', 'Cuidar dele', '世話をする', '照顾它'],
  ['Release', 'Relâcher', 'Liberar', 'Libertar', '放す', '放生'],
  ['You share a meal and sit with it a while.', 'Tu partages un repas et restes un moment avec lui.', 'Compartes una comida y te quedas un rato con él.', 'Partilhas uma refeição e ficas um bocado com ele.', '食事を分け合い、しばらく一緒に座っている。', '你和它分享了一顿饭，陪它坐了一会儿。'],
  ['Release your {beast}?', 'Relâcher ton {beast} ?', '¿Liberar a tu {beast}?', 'Libertar o teu {beast}?', 'あなたの{beast}を放す？', '放走你的{beast}？'],
  ['It will go back to the wild, and you cannot call it back.', 'Il retournera à l’état sauvage, et tu ne pourras pas le rappeler.', 'Volverá a la naturaleza y no podrás llamarlo de nuevo.', 'Vai voltar para a natureza, e não o podes chamar de volta.', '野生に帰り、二度と呼び戻すことはできない。', '它会回到野外，你再也唤不回它。'],
  ['Free', 'Libre', 'Libre', 'Livre', '自由', '自由了'],
  ['It looks back once, then is gone into the grass.', 'Il se retourne une fois, puis disparaît dans les herbes.', 'Mira atrás una vez y desaparece entre la hierba.', 'Olha para trás uma vez e desaparece na erva.', '一度だけ振り返り、草むらへ消えていった。', '它回头看了一眼，就消失在草丛里。'],
  ['Capture net', 'Filet de capture', 'Red de captura', 'Rede de captura', '捕獲網', '捕兽网'],
  ['weaken a wolf, boar, warthog, bear or fox, then throw it', 'affaiblis un loup, un sanglier, un phacochère, un ours ou un renard, puis lance-le', 'debilita a un lobo, jabalí, facóquero, oso o zorro, y luego lánzala', 'enfraquece um lobo, javali, javali-africano, urso ou raposa, e depois lança-a', '狼・猪・イボイノシシ・熊・狐を弱らせてから投げる', '先削弱狼、野猪、疣猪、熊或狐狸，再把网扔出去'],
  ['you have #', 'tu en as #', 'tienes #', 'tens #', '#個持っている', '你有 #'],
  ['Throw the net', 'Lancer le filet', 'Lanzar la red', 'Lançar a rede', '網を投げる', '撒网'],
  ['nets: #', 'filets : #', 'redes: #', 'redes: #', '網：#', '网：#'],
  ['Your beast', 'Ton animal', 'Tu bestia', 'O teu animal', 'あなたの獣', '你的野兽'],
  ['Supplies', 'Provisions', 'Provisiones', 'Provisões', '物資', '补给'],
];
const IDS = ['fr', 'es', 'pt', 'ja', 'zh'];
IDS.forEach((id, i) => { const d = {}; for (const r of ROWS) if (r[i + 1]) d[r[0]] = r[i + 1]; addLang(id, d); });
})();
