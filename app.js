/* =====================================================================
   THE ELEVEN SEALS COMMUNITY - app.js
   A one-page site with no server. It reads the game's own data
   (game-data/, copied by sync.ps1) and shows:
     #/            news (What's new), share and play
     #/kingdoms    the eleven kingdoms (#/kingdoms/<id> for one)
     #/monsters    the Book of Monsters, with tales and secrets
     #/hero/<code> a hero card shared from the game (Community > Share my hero)
     #/report      a bug report players copy, email or post
     #/links       community links and about
   Hero codes carry a small summary of a save, never the save itself.
   Words: t() for this page's words (lang-page.js), tr() for game texts
   (the game's dictionaries). See i18n.js.
   ===================================================================== */
(function () {
'use strict';
const $ = s => document.querySelector(s);
const app = $('#app');
const ATTRS = ['str', 'vit', 'agi', 'spi'];
const GIFT_NAMES = { str: 'Strength', vit: 'Vitality', agi: 'Agility', spi: 'Spirit' };
const attrName = a => tr(GIFT_NAMES[a]);
const PLAY = (COMMUNITY && COMMUNITY.gameUrl) || '../11_seals/index.html';
const CJK = LANG === 'ja' || LANG === 'zh';

/* ---------- small DOM helper: text is always set as text, never as HTML ---------- */
function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style') el.style.cssText = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(String(c)));
  return el;
}
// What's new lines in the game use <b>..</b> only: keep that, drop anything else
function richText(s) {
  const frag = document.createDocumentFragment();
  String(s).split(/(<b>.*?<\/b>)/).forEach(part => {
    const m = part.match(/^<b>(.*)<\/b>$/);
    frag.append(m ? h('b', null, m[1].replace(/<[^>]*>/g, '')) : part.replace(/<[^>]*>/g, ''));
  });
  return frag;
}
function toast(msg) { const el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), 2200); }
async function copy(text, done) {
  try { await navigator.clipboard.writeText(text); toast(done || t('Copied')); }
  catch (e) { const ta = h('textarea', { style: 'position:fixed;opacity:0' }, text); document.body.append(ta); ta.select(); try { document.execCommand('copy'); toast(done || t('Copied')); } catch (_) { toast(t('Could not copy')); } ta.remove(); }
}
const bg = url => 'background-image:url("' + url + '")';
const kingdom = id => KINGDOMS.find(K => K.id === id);
const creatureName = id => tr((CREATURES[id] && CREATURES[id].name) || id);
const creaturePic = id => 'img/creature/' + id + '.jpg';
// a game pattern such as '{rank} of the Inkless', with its blanks filled
function trPattern(key, vars) {
  const D = (LANG !== 'en' && L10N[LANG]) || {};
  const s = Object.prototype.hasOwnProperty.call(D, key) ? D[key] : key;
  return s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
}
// 'Dagger +2': translate the name, keep the forge level
const gearText = s => { const m = String(s).match(/^(.*?)( \+\d+)?$/); return tr(m[1]) + (m[2] || ''); };
const num = n => Number(n).toLocaleString(LANG);

/* ---------- the monsters of each kingdom (from the game's FAUNA) ---------- */
const MONSTERS = [];
for (const K of KINGDOMS) {
  const F = FAUNA[K.id]; if (!F) continue;
  (F.monsters || []).forEach(id => MONSTERS.push({ id, k: K.id, kind: 'monster' }));
  if (F.giant) MONSTERS.push({ id: F.giant, k: K.id, kind: 'giant' });
  if (F.boss) MONSTERS.push({ id: F.boss, k: K.id, kind: 'boss' });
}
const kindTag = kind => t({ monster: 'Monster', giant: 'Giant', boss: 'Seal guardian' }[kind]);

/* ---------- hero codes ---------- */
function decodeHero(code) {
  try {
    const b = code.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(escape(atob(b + '==='.slice((b.length + 3) % 4))));
    const o = JSON.parse(json);
    if (!o || o.v !== 1 || !kingdom(o.k)) return null;
    const n = (x, max) => Math.max(0, Math.min(max, Math.round(+x || 0)));
    const s = (x, len) => String(x == null ? '' : x).replace(/[\u0000-\u001f]/g, '').slice(0, len);
    return {
      name: s(o.n, 24) || 'Traveller', k: o.k, portrait: n(o.p, 3), hard: o.df === 'hard', lvl: n(o.l, 99) || 1,
      attr: Array.isArray(o.a) ? o.a.slice(0, 4).map(x => n(x, 99)) : [1, 1, 1, 1],
      day: n(o.d, 99999) || 1, seals: Array.isArray(o.s) ? o.s.filter(id => kingdom(id)).slice(0, 11) : [],
      giants: n(o.g, 11), kills: n(o.m, 999999), chapter: n(o.c, 9), weapon: s(o.w, 40), armour: s(o.ar, 40),
      role: Array.isArray(o.r) && (o.r[0] === 'mercenary' || o.r[0] === 'outlaw') ? { path: o.r[0], rank: s(o.r[1], 30), count: n(o.r[2], 9999) } : null,
      beast: CREATURES[o.b] ? o.b : null,
      top: Array.isArray(o.t) ? o.t.filter(x => Array.isArray(x) && CREATURES[x[0]]).slice(0, 3).map(x => [x[0], n(x[1], 99999)]) : [],
      pages: n(o.bk, 999), ver: s(o.gv, 10), won: !!o.w2,
    };
  } catch (e) { return null; }
}
const heroCodeFrom = text => { const m = String(text).match(/#\/hero\/([A-Za-z0-9_-]+)/); return m ? m[1] : String(text).trim().replace(/[^A-Za-z0-9_-]/g, ''); };
// the lines of a hero card, shared by the page and the picture
function heroLines(H) {
  const K = kingdom(H.k);
  return {
    from: t('Hunter of {k}', { k: K.name }) + (H.hard ? ' · ' + tr('Hard') : ''),
    role: H.role ? (H.role.path === 'outlaw' ? trPattern('{rank} of the Inkless', { rank: tr(H.role.rank) }) : t('{rank} (mercenary)', { rank: tr(H.role.rank) })) : '',
    seals: t('Seals broken: {n} / 11', { n: H.seals.length }),
    stats: [[t('Days on the road'), num(H.day)], [t('Monsters slain'), num(H.kills)], [t('Giants felled'), num(H.giants)], [t('Monster pages'), num(H.pages)]],
    extra: [H.weapon && t('Wields {w}', { w: gearText(H.weapon) }), H.beast && t('Companion: {b}', { b: creatureName(H.beast) })].filter(Boolean).join(' · '),
    top: H.top.length ? t('Most hunted: {list}', { list: H.top.map(([id, n]) => creatureName(id) + ' ×' + n).join(CJK ? '、' : ', ') }) : '',
    foot: H.won ? t('Defeated the Unwriter') : (H.ver ? 'v' + H.ver : ''),
  };
}

/* ---------- pages ---------- */
const PAGES = { '': pageHome, kingdoms: pageKingdoms, monsters: pageMonsters, hero: pageHero, report: pageReport, links: pageLinks };
function route() {
  const parts = location.hash.replace(/^#\/?/, '').split('/');
  const page = PAGES[parts[0]] ? parts[0] : '';
  document.querySelectorAll('#nav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#/' + page));
  app.replaceChildren(PAGES[page](parts.slice(1)));
  window.scrollTo(0, 0);
}

function pageHome() {
  const lore = LORE[Math.floor(Math.random() * LORE.length)];
  return h('div', null,
    h('section', { class: 'hero', style: bg('img/title/art.jpg') },
      h('div', { class: 'in' },
        h('img', { class: 'logo', src: 'img/title/logo.png', alt: 'The Eleven Seals' }),
        h('p', null, t('A text adventure across the eleven kingdoms. Pick a people, hunt the monsters of its legends, and break the Seals before the ink swallows the world.')),
        h('div', { class: 'btns' }, h('a', { class: 'btn main', href: PLAY }, t('Play now')), h('a', { class: 'btn', href: '#/hero' }, t('Share your hero'))))),
    h('section', { class: 'sec' },
      h('h2', null, t('What’s new')),
      h('div', { class: 'card news' },
        h('span', { class: 'ver' }, t('Version {v}', { v: GAME_VERSION })),
        h('ul', null, WHATS_NEW.map(line => h('li', null, richText(tr(line))))))),
    h('section', { class: 'sec cta' },
      h('div', { class: 'card' }, h('img', { src: 'img/ui/seal.jpg', alt: '' }), h('div', null,
        h('h3', null, t('Show off your hero')), h('p', null, t('In the game, open Community and tap “Share my hero”. You get a card to save as a picture or send as a link.')),
        h('a', { class: 'btn', href: '#/hero' }, t('Hero cards')))),
      h('div', { class: 'card' }, h('img', { src: 'img/ui/quill.jpg', alt: '' }), h('div', null,
        h('h3', null, t('Found a bug?')), h('p', null, t('Tell us what happened and what you were doing. Every report helps.')),
        h('a', { class: 'btn', href: '#/report' }, t('Report a bug'))))),
    h('section', { class: 'sec' },
      h('h2', null, t('The eleven kingdoms')),
      h('p', { class: 'lead' }, t('Every people meets the monsters of its own stories. Choose where your hunter is born.')),
      kingdomGrid()),
    lore && h('section', { class: 'sec' },
      h('h2', null, t('From a lore stone')),
      h('div', { class: 'card', style: 'padding:22px 24px' }, h('h3', null, tr(lore.title)), h('p', { class: 'quote', style: 'margin-bottom:0' }, tr(lore.text)))),
  );
}

function kingdomGrid() {
  return h('div', { class: 'grid' }, KINGDOMS.map(K => h('a', { class: 'card kcard', href: '#/kingdoms/' + K.id },
    h('div', { class: 'pic', style: bg('img/event/war/' + K.id + '.jpg') }, h('i', { class: 'flag', style: 'background:linear-gradient(' + K.banner[0] + ' 60%,' + K.banner[1] + ' 60%)' })),
    h('div', { class: 'txt' }, h('h3', null, K.name), h('small', null, tr(K.title)))
  )));
}

function pageKingdoms(args) {
  const K = kingdom(args[0]);
  if (!K) return h('div', null, h('h2', null, t('The eleven kingdoms')), h('p', { class: 'lead' }, t('Eleven crowns rose from the ruins of the Quill. Each has its own people, beasts, legends and a Seal deep underground.')), kingdomGrid());
  const F = FAUNA[K.id] || {}, hero = HEROES[K.id];
  const mons = MONSTERS.filter(m => m.k === K.id);
  return h('div', null,
    h('a', { class: 'back', href: '#/kingdoms' }, '← ' + t('All kingdoms')),
    h('div', { class: 'kdetail' },
      h('div', null,
        h('div', { class: 'pic card' }, h('img', { src: 'img/event/war/' + K.id + '.jpg', alt: t('Soldiers of {k}', { k: K.name }) }))),
      h('div', null,
        h('h2', null, K.name), h('div', { class: 'lead', style: 'margin:0' }, tr(K.title)),
        h('dl', { class: 'facts' },
          h('dt', null, t('Capital')), h('dd', null, K.capital),
          h('dt', null, t('Ruler')), h('dd', null, tr(K.ruler.title) + ' ' + K.ruler.name),
          h('dt', null, t('Huntmaster')), h('dd', null, (HUNTMASTERS[K.id] || '').replace(/^Huntmaster /, '')),
          h('dt', null, t('Born with')), h('dd', null, '+1 ' + attrName(KINGDOM_GIFT[K.id])),
          h('dt', null, t('The Seal')), h('dd', null, tr(F.dungeon || '')),
          h('dt', null, t('Its guardian')), h('dd', null, creatureName(F.boss)),
          h('dt', null, t('Villages')), h('dd', null, K.villages.join(CJK ? '、' : ', '))),
        h('p', { class: 'quote' }, (CJK ? '「' : '“') + tr(K.lines[0]) + (CJK ? '」' : '”')),
        hero && h('div', { class: 'card', style: 'padding:14px 16px;display:flex;gap:14px;align-items:center' },
          h('img', { src: 'img/hero/' + K.id + '.jpg', alt: '', style: 'width:72px;height:72px;border-radius:12px;object-fit:cover' }),
          h('div', null, h('b', null, tr(hero.name)), h('div', { class: 'note' }, t('Hero of old, who {how}.', { how: tr(hero.how) })))),
        h('div', { class: 'btns', style: 'margin-top:18px' }, h('a', { class: 'btn main', href: PLAY }, t('Play as {k}', { k: K.name }))))),
    h('section', { class: 'sec', style: 'margin-top:36px' },
      h('h2', null, t('Monsters of {k}', { k: K.name })), monsterGrid(mons)));
}

function monsterGrid(list) {
  if (!list.length) return h('p', { class: 'empty' }, t('No monster matches.'));
  return h('div', { class: 'mgrid' }, list.map(m => h('button', { class: 'card mcard', onclick: () => monsterSheet(m) },
    h('div', { class: 'pic', style: bg(creaturePic(m.id)) }),
    h('div', { class: 'txt' }, h('b', null, creatureName(m.id)), h('small', null, kingdom(m.k).name), h('br'),
      h('span', { class: 'tag ' + m.kind }, kindTag(m.kind))))));
}
function monsterSheet(m) {
  const B = BESTIARY[m.id] || {}, K = kingdom(m.k);
  const d = h('dialog', { onclose: () => d.remove(), onclick: e => { if (e.target === d) d.close(); } },
    h('div', { class: 'sheet' },
      h('div', { class: 'pic', style: bg(creaturePic(m.id)) }),
      h('div', { class: 'txt' },
        h('span', { class: 'tag ' + m.kind }, kindTag(m.kind) + ' · ' + K.name),
        h('h2', { style: 'margin-top:8px' }, creatureName(m.id)),
        B.land && h('p', { class: 'note' }, tr(B.land)),
        h('p', null, B.tale ? tr(B.tale) : t('Its tale is still being written.')),
        B.secret && h('details', { class: 'secret' }, h('summary', null, t('Reveal its secret (spoiler)')), h('p', { style: 'margin:.6em 0 0' }, tr(B.secret))))),
    h('button', { class: 'x', 'aria-label': t('Close'), onclick: () => d.close() }, '×'));
  document.body.append(d); d.showModal();
}

function pageMonsters() {
  const state = { q: '', k: '', kind: '' };
  const out = h('div');
  const draw = () => {
    const q = state.q.toLowerCase();
    const hit = m => [creatureName(m.id), (CREATURES[m.id] || {}).name, tr((BESTIARY[m.id] || {}).land || ''), (BESTIARY[m.id] || {}).land].some(x => x && x.toLowerCase().includes(q));
    out.replaceChildren(monsterGrid(MONSTERS.filter(m => (!state.k || m.k === state.k) && (!state.kind || m.kind === state.kind) && (!q || hit(m)))));
  };
  const kinds = h('div', { class: 'chips' }, [['', 'All'], ['monster', 'Monsters'], ['giant', 'Giants'], ['boss', 'Seal guardians']].map(([v, label]) =>
    h('button', { class: 'chip' + (v === '' ? ' on' : ''), onclick: e => { state.kind = v; kinds.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === e.currentTarget)); draw(); } }, t(label))));
  const page = h('div', null,
    h('h2', null, t('Book of Monsters')),
    h('p', { class: 'lead' }, t('{n} creatures from the legends of the world. Every one is a real story from folklore; tap one to read it.', { n: MONSTERS.length })),
    h('div', { class: 'filters' },
      h('input', { type: 'search', placeholder: t('Search a name or a land…'), 'aria-label': t('Search monsters'), oninput: e => { state.q = e.target.value; draw(); } }),
      h('select', { 'aria-label': t('Kingdom'), onchange: e => { state.k = e.target.value; draw(); } }, h('option', { value: '' }, t('All kingdoms')), KINGDOMS.map(K => h('option', { value: K.id }, K.name))),
      kinds),
    out);
  draw();
  return page;
}

/* ---------- hero cards ---------- */
function pageHero(args) {
  const code = args[0] ? heroCodeFrom(args[0]) : '';
  const H = code && decodeHero(code);
  const paste = h('div', { class: 'paste' },
    h('input', { placeholder: t('Paste a hero link or code'), 'aria-label': t('Hero link or code'), id: 'heroIn', onkeydown: e => { if (e.key === 'Enter') openPasted(); } }),
    h('button', { class: 'btn', onclick: openPasted }, t('Show card')));
  function openPasted() { const c = heroCodeFrom($('#heroIn').value); if (decodeHero(c)) location.hash = '#/hero/' + c; else toast(t('That is not a hero code')); }
  const how = h('div', { class: 'how' },
    h('h3', null, t('Make your own card')),
    h('ol', null, h('li', null, t('Open the game and go to the title screen.')), h('li', null, t('Tap “Community”, then “Share my hero”.')),
      h('li', null, t('Your card opens here: save it as a picture or copy its link.'))),
    h('p', { class: 'note' }, t('The card only carries what it shows (name, kingdom, level, deeds). Your save stays on your device.')),
    paste);
  if (!H) return h('div', null, h('h2', null, t('Hero cards')),
    h('p', { class: 'lead' }, code ? t('This hero link is broken or comes from an older game. Ask for a new one.') : t('Every hunter has a story. Share yours.')),
    h('div', { class: 'card', style: 'padding:22px;max-width:720px' }, how));
  const link = location.href.split('#')[0] + '#/hero/' + code;
  return h('div', null,
    h('h2', null, t('{name} of {k}', { name: H.name, k: kingdom(H.k).name })),
    h('div', { class: 'herowrap' },
      heroCard(H),
      h('div', null,
        h('div', { class: 'btns', style: 'margin-bottom:18px' },
          h('button', { class: 'btn main', onclick: e => saveCard(H, e.currentTarget) }, t('Save as picture')),
          h('button', { class: 'btn', onclick: () => copy(link, t('Link copied')) }, t('Copy link')),
          navigator.share && h('button', { class: 'btn', onclick: () => navigator.share({ title: H.name + ' · The Eleven Seals', url: link }).catch(() => {}) }, t('Share…'))),
        h('div', { class: 'card', style: 'padding:20px' }, how))));
}

function heroCard(H) {
  const K = kingdom(H.k), L = heroLines(H);
  const stat = ([label, v]) => h('div', { class: 'stat' }, h('small', null, label), h('b', null, v));
  return h('div', { class: 'hcard' },
    h('div', { class: 'band', style: 'background:linear-gradient(90deg,' + K.banner[0] + ' 70%,' + K.banner[1] + ' 70%)' }),
    h('div', { class: 'lvl' }, h('div', null, h('b', null, H.lvl), t('level'))),
    h('div', { class: 'top2' },
      h('div', { class: 'face', style: bg('img/portrait/' + K.id + '/' + H.portrait + '.jpg'), role: 'img', 'aria-label': t('Portrait') }),
      h('div', { style: 'padding-right:60px' }, h('div', { class: 'name' }, H.name), h('div', { class: 'from' }, L.from), L.role && h('div', { class: 'from' }, L.role))),
    h('div', { class: 'attrs' }, ATTRS.map((a, i) => h('div', { class: 'attr' }, h('img', { src: 'img/ui/attr_' + a + '.jpg', alt: '' }), h('b', null, H.attr[i] || 0), attrName(a)))),
    h('div', { class: 'line' }, h('b', null, L.seals)),
    h('div', { class: 'seals', 'aria-hidden': 'true' }, KINGDOMS.map(k2 => h('i', { class: H.seals.includes(k2.id) ? 'on' : '', title: k2.name }))),
    h('div', { class: 'stats' }, L.stats.map(stat)),
    L.extra && h('div', { class: 'line' }, L.extra),
    L.top && h('div', { class: 'line', style: 'color:#6b6255' }, L.top),
    H.won && h('div', { class: 'line', style: 'color:#a3392b;font-weight:700' }, t('Defeated the Unwriter')),
    h('div', { class: 'foot2' }, h('img', { src: 'img/title/logo.png', alt: 'The Eleven Seals' }), h('span', null, H.ver ? 'v' + H.ver : '')));
}

// the same card drawn on a canvas, to save as a PNG
function loadImg(src) { return new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; }); }
async function saveCard(H, btn) {
  btn.disabled = true;
  try {
    const K = kingdom(H.k), L = heroLines(H), W = 1080, Hh = 1350, c = document.createElement('canvas');
    const head = ', "Hiragino Mincho ProN", "Noto Serif CJK JP", "Noto Serif SC", "Songti SC", serif', body = ', "Hiragino Sans", "Noto Sans CJK JP", "Microsoft YaHei", "Yu Gothic", sans-serif';
    c.width = W; c.height = Hh;
    const g = c.getContext('2d');
    await document.fonts.ready;
    const [face, logo, ...icons] = await Promise.all([loadImg('img/portrait/' + K.id + '/' + H.portrait + '.jpg'), loadImg('img/title/logo.png'), ...ATTRS.map(a => loadImg('img/ui/attr_' + a + '.jpg'))]);
    const rr = (x, y, w, hh, r) => { g.beginPath(); g.roundRect(x, y, w, hh, r); };
    g.fillStyle = '#f6f0e1'; g.fillRect(0, 0, W, Hh);
    g.fillStyle = K.banner[0]; g.fillRect(0, 0, W * .7, 36); g.fillStyle = K.banner[1]; g.fillRect(W * .7, 0, W * .3, 36);
    // portrait
    g.save(); g.beginPath(); g.arc(190, 240, 130, 0, Math.PI * 2); g.closePath(); g.clip();
    if (face) g.drawImage(face, 60, 110, 260, 260); else { g.fillStyle = '#e9e1cd'; g.fill(); }
    g.restore(); g.lineWidth = 8; g.strokeStyle = '#17140f'; g.beginPath(); g.arc(190, 240, 130, 0, Math.PI * 2); g.stroke();
    // level
    g.fillStyle = '#fff8ec'; g.beginPath(); g.arc(950, 150, 80, 0, Math.PI * 2); g.fill(); g.lineWidth = 5; g.stroke();
    g.fillStyle = '#17140f'; g.textAlign = 'center'; g.font = '900 64px Cinzel' + head; g.fillText(H.lvl, 950, 168); g.font = '700 28px Kalam' + body; g.fillText(t('level'), 950, 206, 130);
    // name
    g.textAlign = 'left'; g.font = '900 ' + (H.name.length > 14 ? 54 : 68) + 'px Cinzel' + head; g.fillText(H.name, 360, 230, 480);
    g.font = '400 34px Literata' + body; g.fillStyle = '#6b6255'; g.fillText(L.from, 360, 285, 600);
    if (L.role) g.fillText(L.role, 360, 330, 600);
    // attributes
    ATTRS.forEach((a, i) => {
      const x = 80 + i * 240;
      if (icons[i]) { g.save(); rr(x + 50, 420, 120, 120, 22); g.clip(); g.drawImage(icons[i], x + 50, 420, 120, 120); g.restore(); }
      g.textAlign = 'center'; g.fillStyle = '#17140f'; g.font = '900 52px Cinzel' + head; g.fillText(H.attr[i] || 0, x + 110, 600);
      g.fillStyle = '#6b6255'; g.font = '400 28px Literata' + body; g.fillText(attrName(a), x + 110, 640, 220);
    });
    // seals
    g.textAlign = 'left'; g.fillStyle = '#17140f'; g.font = '700 36px Literata' + body; g.fillText(L.seals, 80, 720, 920);
    KINGDOMS.forEach((k2, i) => {
      const x = 104 + i * 80, on = H.seals.includes(k2.id);
      g.beginPath(); g.arc(x, 775, 28, 0, Math.PI * 2);
      if (on) { const gr = g.createRadialGradient(x - 8, 767, 4, x, 775, 28); gr.addColorStop(0, '#d25544'); gr.addColorStop(1, '#7f2a1f'); g.fillStyle = gr; g.fill(); }
      g.lineWidth = 5; g.strokeStyle = on ? '#7f2a1f' : '#a3392b'; g.stroke();
    });
    // stats
    L.stats.forEach(([label, v], i) => {
      const x = 80 + (i % 2) * 470, y = 840 + Math.floor(i / 2) * 150;
      g.fillStyle = '#ece4d0'; rr(x, y, 450, 130, 24); g.fill();
      g.fillStyle = '#6b6255'; g.font = '400 28px Literata' + body; g.fillText(label, x + 28, y + 48, 400);
      g.fillStyle = '#17140f'; g.font = '700 46px Literata' + body; g.fillText(String(v), x + 28, y + 104, 400);
    });
    g.font = '400 30px Literata' + body; g.fillStyle = '#17140f';
    if (L.extra) g.fillText(L.extra, 80, 1180, 920);
    if (L.top) { g.fillStyle = '#6b6255'; g.fillText(L.top, 80, 1225, 920); }
    // footer
    g.strokeStyle = 'rgba(23,20,15,.25)'; g.setLineDash([10, 10]); g.lineWidth = 2; g.beginPath(); g.moveTo(60, 1255); g.lineTo(W - 60, 1255); g.stroke(); g.setLineDash([]);
    if (logo) { const lh = 70, lw = logo.width * lh / logo.height; g.drawImage(logo, 70, 1265, lw, lh); }
    g.fillStyle = '#6b6255'; g.textAlign = 'right'; g.font = '400 26px Literata' + body; g.fillText(L.foot, W - 70, 1312, 600);
    const a = h('a', { download: 'eleven-seals-' + (H.name.replace(/[^\w-]+/g, '_') || 'hero') + '.png', href: c.toDataURL('image/png') });
    document.body.append(a); a.click(); a.remove();
    toast(t('Picture saved'));
  } catch (e) { toast(t('Could not make the picture here; try a screenshot')); }
  btn.disabled = false;
}

/* ---------- bug report (written in English, for the developer) ---------- */
function pageReport() {
  const f = {};
  const field = (key, label, el, hint) => { f[key] = el; return h('label', null, h('span', null, label, hint && h('small', null, ' ' + hint)), el); };
  const device = (navigator.userAgentData && navigator.userAgentData.platform ? navigator.userAgentData.platform + ' · ' : '') + navigator.userAgent.replace(/\s*\(KHTML, like Gecko\)/, '') + ' · ' + innerWidth + '×' + innerHeight;
  const OFTEN = ['Every time', 'Sometimes', 'Only once'];
  const build = () => [
    'The Eleven Seals bug report', 'Game version: ' + GAME_VERSION, 'Language: ' + LANG, '',
    'What happened:', f.what.value.trim() || '(empty)', '',
    'What I was doing:', f.steps.value.trim() || '(empty)', '',
    'Where: ' + (f.where.value.trim() || '-'), 'How often: ' + f.often.value,
    f.hero.value.trim() ? 'Hero: ' + f.hero.value.trim() : null, 'Device: ' + f.device.value.trim(),
  ].filter(l => l !== null).join('\n');
  const ok = () => { if (!f.what.value.trim()) { toast(t('Please say what happened')); f.what.focus(); return false; } return true; };
  const title = () => 'Bug: ' + f.what.value.trim().split('\n')[0].slice(0, 70);
  const C = COMMUNITY || {};
  return h('div', null,
    h('h2', null, t('Report a bug')),
    h('p', { class: 'lead' }, t('Something broke, looked wrong or made no sense? Tell us. The clearer the steps, the faster it gets fixed.')),
    h('div', { class: 'card form' },
      field('what', t('What happened?'), h('textarea', { required: true, placeholder: t('e.g. The blacksmith in Belograd sold me a sword but it never showed up in my bag.') })),
      field('steps', t('What were you doing just before?'), h('textarea', { placeholder: t('1. I walked into Belograd\n2. I opened the Blacksmith\n3. ...') })),
      field('where', t('Where in the world?'), h('input', { placeholder: t('kingdom, town, dungeon, fight…') }), t('(optional)')),
      field('often', t('How often?'), h('select', null, OFTEN.map(o => h('option', { value: o }, t(o))))),
      field('hero', t('Your hero link'), h('input', { placeholder: t('paste it from Community > Share my hero') }), t('(optional, helps us see your level and kingdom)')),
      field('device', t('Your device'), h('input', { value: device }), t('(filled in for you; edit if you like)')),
      h('div', { class: 'btns' },
        C.issuesUrl && h('button', { class: 'btn main', onclick: () => { if (ok()) window.open(C.issuesUrl + (C.issuesUrl.includes('?') ? '&' : '?') + 'title=' + encodeURIComponent(title()) + '&body=' + encodeURIComponent(build()), '_blank', 'noopener'); } }, t('Post the report')),
        C.reportEmail && h('button', { class: 'btn' + (C.issuesUrl ? '' : ' main'), onclick: () => { if (ok()) location.href = 'mailto:' + C.reportEmail + '?subject=' + encodeURIComponent(title()) + '&body=' + encodeURIComponent(build()); } }, t('Send by email')),
        h('button', { class: 'btn' + (C.issuesUrl || C.reportEmail ? '' : ' main'), onclick: () => { if (ok()) copy(build(), t('Report copied')); } }, t('Copy the report'))),
      !C.issuesUrl && !C.reportEmail && h('p', { class: 'note', style: 'margin:0' }, t('Copy the report and paste it in our community channel.') + (communityLinks().length ? ' ' + t('Links are on the Community page.') : ''))));
}

/* ---------- links and about ---------- */
function communityLinks() {
  const own = (COMMUNITY && COMMUNITY.links) || [];
  return (own.length ? own : (typeof COMMUNITY_LINKS !== 'undefined' ? COMMUNITY_LINKS : [])).filter(l => l && l.url && /^https?:\/\//.test(l.url));
}
function pageLinks() {
  const links = communityLinks();
  return h('div', null,
    h('h2', null, t('Community')),
    h('p', { class: 'lead' }, links.length ? t('Meet other hunters, follow the news and tell us your stories.') : t('Our community channels open soon. Until then, play, share your hero card and send us your bug reports.')),
    h('div', { class: 'links' },
      h('a', { class: 'card', href: PLAY }, h('b', null, t('Play the game')), h('small', null, t('In your browser, on phone or computer'))),
      links.map(l => h('a', { class: 'card', href: l.url, target: '_blank', rel: 'noopener' }, h('b', null, tr(l.name)), h('small', null, tr(l.note || l.url))))),
    h('section', { class: 'sec about' },
      h('h2', null, t('About the game')),
      ABOUT_TEXT.map(p => h('p', null, tr(p))),
      h('p', { class: 'note' }, t('Version {v}. This page reads the same kingdoms, monsters and news as the game.', { v: GAME_VERSION }))));
}

/* ---------- start ---------- */
function frame() {
  document.title = 'The Eleven Seals · ' + t('Community');
  document.querySelectorAll('[data-t]').forEach(el => { el.textContent = t(el.getAttribute('data-t')); });
  $('#playTop').href = PLAY;
  $('#footVer').textContent = 'The Eleven Seals · ' + t('Version {v}', { v: GAME_VERSION });
  const pick = $('#langPick');
  pick.setAttribute('aria-label', t('Language'));
  pick.replaceChildren(...LANGS.map(l => h('option', { value: l.id, selected: l.id === LANG }, l.name)));
  pick.onchange = () => setLang(pick.value);
}
I18N_READY.then(() => {
  frame();
  window.addEventListener('hashchange', route);
  route();
});
})();
