/* =====================================================================
   THE ELEVEN SEALS - lang/balance.js
   Translations of the balance rules (src/balance.js): gear wear and
   repairs, potion sickness, and great foes that learn your attacks.
   One row per text: [English, fr, es, pt, ja, zh].
   # is any number (keep the same order), {x} is a blank.
   ===================================================================== */
(function () {
const ROWS = [
  ['Your {item} is getting worn. A blacksmith can repair it.', 'Ton {item} commence à s’user. Un forgeron peut le réparer.', 'Tu {item} empieza a desgastarse. Un herrero puede repararlo.', 'O teu {item} está a ficar gasto. Um ferreiro pode repará-lo.', '{item}が傷んできた。鍛冶屋で修理できる。', '你的{item}开始磨损了。铁匠可以修理。'],
  ['Your {item} is badly worn. Have it repaired soon.', 'Ton {item} est très usé. Fais-le réparer bientôt.', 'Tu {item} está muy desgastado. Haz que lo reparen pronto.', 'O teu {item} está muito gasto. Manda-o reparar em breve.', '{item}はひどく傷んでいる。早めに修理しよう。', '你的{item}磨损严重。尽快去修理吧。'],
  ['<b>Your {item} breaks!</b> It is only half as good until a blacksmith repairs it.', '<b>Ton {item} se brise !</b> Il ne vaut plus que la moitié tant qu’un forgeron ne l’a pas réparé.', '<b>¡Tu {item} se rompe!</b> Solo rinde la mitad hasta que un herrero lo repare.', '<b>O teu {item} parte-se!</b> Só vale metade até um ferreiro o reparar.', '<b>{item}が壊れた！</b>鍛冶屋で直すまで、半分の力しか出ない。', '<b>你的{item}坏了！</b>在铁匠修好之前，它只有一半的效果。'],
  ['condition #%', 'état #%', 'estado #%', 'estado #%', '状態 #%', '耐久 #%'],
  ['broken', 'brisé', 'roto', 'partido', '壊れている', '已损坏'],
  ['Repair', 'Réparer', 'Reparar', 'Reparar', '修理', '修理'],
  ['Patch up', 'Rafistoler', 'Remendar', 'Remendar', '応急修理', '简单修补'],
  ['Repaired: {item}', 'Réparé : {item}', 'Reparado: {item}', 'Reparado: {item}', '修理済み：{item}', '已修理：{item}'],
  ['Patched up: {item}', 'Rafistolé : {item}', 'Remendado: {item}', 'Remendado: {item}', '応急修理済み：{item}', '已修补：{item}'],
  ['Repairs', 'Réparations', 'Reparaciones', 'Reparações', '修理', '修理'],
  ['Patch-ups', 'Rafistolages', 'Remiendos', 'Remendos', '応急修理', '简单修补'],
  ['Worn gear hits softer and protects less. The smith makes it as good as new.', 'Un équipement usé frappe moins fort et protège moins. Le forgeron le remet à neuf.', 'El equipo desgastado golpea más flojo y protege menos. El herrero lo deja como nuevo.', 'Equipamento gasto bate mais fraco e protege menos. O ferreiro deixa-o como novo.', '傷んだ装備は威力も守りも落ちる。鍛冶屋なら新品同様に直してくれる。', '磨损的装备打得更轻、防护更差。铁匠能把它修得跟新的一样。'],
  ['The shopkeeper can patch up what you wear, but only so far (#%). For a real repair, see a blacksmith.', 'Le marchand peut rafistoler ce que tu portes, mais pas au-delà de #%. Pour une vraie réparation, va voir un forgeron.', 'El tendero puede remendar lo que llevas, pero solo hasta cierto punto (#%). Para una reparación de verdad, ve a un herrero.', 'O lojista pode remendar o que usas, mas só até certo ponto (#%). Para uma reparação a sério, vai a um ferreiro.', '店主は身につけている物を応急修理してくれるが、#%までだ。ちゃんと直すなら鍛冶屋へ。', '店主能简单修补你身上的装备，但最多到 #%。要真正修好，得去找铁匠。'],
  ['<b>Potion sickness!</b> Your stomach turns: it works only half as well.', '<b>Mal des potions !</b> Ton estomac se retourne : elle n’agit qu’à moitié.', '<b>¡Empacho de pociones!</b> Se te revuelve el estómago: solo hace la mitad de efecto.', '<b>Enjoo de poções!</b> O estômago dá-te voltas: só faz metade do efeito.', '<b>薬酔い！</b>胃がむかつく。効き目は半分だ。', '<b>药水反胃！</b>你胃里翻江倒海：药效只剩一半。'],
  ['potion sickness: half as strong', 'mal des potions : deux fois moins fort', 'empacho de pociones: la mitad de efecto', 'enjoo de poções: metade do efeito', '薬酔い：効果半分', '药水反胃：效果减半'],
  ['<b>It has learned your {move}!</b> From now on it turns that attack aside. Try something else.', '<b>Il a appris ton {move} !</b> Désormais, il détourne cette attaque. Essaie autre chose.', '<b>¡Ha aprendido tu {move}!</b> A partir de ahora desvía ese ataque. Prueba otra cosa.', '<b>Aprendeu o teu {move}!</b> A partir de agora desvia esse ataque. Tenta outra coisa.', '<b>あなたの{move}を見切られた！</b>以後、その攻撃はいなされる。別の手を試そう。', '<b>它看穿了你的{move}！</b>从现在起它会挡开这一招。换个打法吧。'],
  ['it has learned this', 'il connaît cette attaque', 'ya conoce este ataque', 'já conhece este ataque', '見切られている', '已被看穿'],
];
const IDS = ['fr', 'es', 'pt', 'ja', 'zh'];
IDS.forEach((id, i) => { const d = {}; for (const r of ROWS) if (r[i + 1]) d[r[0]] = r[i + 1]; addLang(id, d); });
})();
