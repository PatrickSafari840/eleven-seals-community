/* =====================================================================
   THE ELEVEN SEALS COMMUNITY - online.js
   The pages that need the online database (Supabase, same project as the
   game: 11_seals/supabase/schema.sql). Settings: config.js.
     #/account       sign in / create an account, your hero names, your badges
     #/ranks         the Open Dungeon bosses: time left, rankings, winners
     #/badge/<no>    one badge, with a check that the game really signed it
     #/admin         admins only: income, drop a new boss, rewards, players
   Pages are added to app.js through window.EXTRA_PAGES.
   ===================================================================== */
(function () {
'use strict';
const C = (typeof COMMUNITY !== 'undefined' && COMMUNITY) || {};   // config.js (a top-level const, not on window)
const ready = () => !!(C.supabaseUrl && C.anonKey);
const $ = s => document.querySelector(s);
const tt = (s, v) => (typeof t === 'function' ? t(s, v) : s);
function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v; else if (k === 'style') el.style.cssText = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v); else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(String(c)));
  return el;
}
function toast(msg) { const el = $('#toast'); if (!el) return; el.textContent = msg; el.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), 2600); }
const when = iso => new Date(iso).toLocaleString(typeof LANG === 'string' ? LANG : undefined, { dateStyle: 'medium', timeStyle: 'short' });
const day = iso => new Date(iso).toLocaleDateString(typeof LANG === 'string' ? LANG : undefined, { dateStyle: 'medium' });
const artUrl = a => !a ? 'img/icons/icon-192.png' : /^https?:/.test(a) ? a : 'img/' + a + '.jpg';
const MONSTERS_ = () => (typeof CREATURES !== 'undefined' ? CREATURES : {});   // the game's monsters (game-data/base.js, a top-level const)
const creatureName = id => (MONSTERS_()[id] && (typeof tr === 'function' ? tr(MONSTERS_()[id].name) : MONSTERS_()[id].name)) || id;
const left = iso => { const ms = new Date(iso) - Date.now(); if (ms <= 0) return tt('ended');
  const d = Math.floor(ms / 864e5), hh = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60;
  return tt('{t} left', { t: d ? d + 'd ' + hh + 'h' : hh ? hh + 'h ' + m + 'm' : m + 'm' }); };
const KIND = { weekly: 'Weekly boss', monthly: 'Monthly boss', special: 'Special boss' };
const MEDAL = ['', 'gold', 'silver', 'bronze'];

let client = null;
function sb() {
  if (client) return client;
  client = new Promise((ok, bad) => {
    const make = () => ok(window.supabase.createClient(C.supabaseUrl, C.anonKey, { auth: { persistSession: true, autoRefreshToken: true } }));
    if (window.supabase && window.supabase.createClient) return make();
    const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';
    s.onload = make; s.onerror = () => { client = null; bad(new Error('offline')); }; document.head.append(s);
  });
  return client;
}
async function session() { const c = await sb(); const { data } = await c.auth.getSession(); return data.session; }
async function isAdmin(c, user) { const { data } = await c.from('profiles').select('is_admin').eq('id', user.id).maybeSingle(); return !!(data && data.is_admin); }

// a page that fills itself in when the data arrives
function later(build) {
  const box = h('div', null, h('p', { class: 'muted' }, tt('Loading…')));
  if (!ready()) { box.replaceChildren(h('h2', null, tt('Online')), h('div', { class: 'card pad' }, h('p', null, tt('The online part is not switched on yet. Come back soon.')))); return box; }
  Promise.resolve().then(build).then(el => box.replaceChildren(el)).catch(e => box.replaceChildren(h('div', { class: 'card pad' }, h('p', null, tt('Could not reach the online part. Check your connection and try again.')), h('p', { class: 'muted' }, e && e.message || ''))));
  return box;
}
const again = () => window.dispatchEvent(new HashChangeEvent('hashchange'));

/* ---------------- a badge as a medal ---------------- */
function medal(b, small) {
  return h('a', { class: 'medal ' + (MEDAL[b.rank] || '') + (small ? ' small' : '') + (b.revoked ? ' revoked' : ''), href: '#/badge/' + b.serial, title: b.title },
    h('span', { class: 'ring' }, h('img', { src: artUrl(b.art), alt: '' })),
    h('b', null, b.title), h('small', null, '#' + String(b.serial).padStart(6, '0') + (b.rank ? ' · ' + tt('rank {n}', { n: b.rank }) : '')));
}

/* ---------------- #/account ---------------- */
function pageAccount() {
  return later(async () => {
    const c = await sb(), s = await session();
    if (!s) return signInForm(c);
    const user = s.user;
    const [{ data: names }, { data: badges }, admin] = await Promise.all([
      c.from('hero_names').select('name, created_at').eq('owner', user.id).order('created_at'),
      c.from('badges').select('*').eq('user_id', user.id).order('serial', { ascending: false }),
      isAdmin(c, user)]);
    return h('div', null,
      h('h2', null, tt('Your account')),
      h('p', { class: 'lead' }, tt('Signed in as {e}', { e: user.email })),
      h('div', { class: 'card pad' },
        h('h3', null, tt('Your hero names')),
        h('p', { class: 'muted' }, tt('No other player can use these names. An account can hold 4. Your heroes take their names when you sign in inside the game.')),
        (names || []).length ? h('ul', { class: 'plain' }, names.map(n => h('li', null, h('b', null, n.name), ' ',
          h('button', { class: 'btn ghost small', onclick: async () => { if (!confirm(tt('Free the name “{n}”? Anyone could then take it.', { n: n.name }))) return; await c.rpc('release_name', { p_name: n.name }); toast(tt('Name freed')); again(); } }, tt('Free this name')))))
          : h('p', null, tt('No names yet. Sign in inside the game (Menu › Online account) to claim your hero’s name.'))),
      h('div', { class: 'card pad' },
        h('h3', null, tt('Your badges')),
        (badges || []).length ? h('div', { class: 'medals' }, badges.map(b => medal(b))) : h('p', null, tt('No badges yet. Finish the game, enter the Open Dungeon, and be in the top 3 when a boss’s time runs out.'))),
      h('div', { class: 'btns' },
        admin && h('a', { class: 'btn main', href: '#/admin' }, tt('Admin')),
        h('a', { class: 'btn', href: '#/ranks' }, tt('Rankings')),
        h('button', { class: 'btn ghost', onclick: async () => { await c.auth.signOut(); toast(tt('Signed out')); again(); } }, tt('Sign out'))));
  });
}
function signInForm(c) {
  const email = h('input', { type: 'email', autocomplete: 'email', maxlength: 80 });
  const pass = h('input', { type: 'password', autocomplete: 'current-password', maxlength: 72 });
  const go = async mode => {
    const v = { email: email.value.trim(), password: pass.value };
    if (!v.email) return toast(tt('Enter your email'));
    if (mode === 'reset') { const { error } = await c.auth.resetPasswordForEmail(v.email, { redirectTo: location.href.split('#')[0] + '#/account' }); return toast(error ? error.message : tt('We sent you a link to choose a new password.')); }
    if (v.password.length < 8) return toast(tt('Passwords have at least 8 letters'));
    const { data, error } = mode === 'up' ? await c.auth.signUp(v) : await c.auth.signInWithPassword(v);
    if (error) return toast(error.message);
    if (mode === 'up' && !data.session) return toast(tt('Check your email and open the link to confirm your account.'));
    toast(tt('Signed in')); again();
  };
  return h('div', null,
    h('h2', null, tt('Account')),
    h('p', { class: 'lead' }, tt('One account for the game and this page: it keeps your hero’s name yours, opens the Open Dungeon, and holds your badges.')),
    h('div', { class: 'card form' },
      h('label', null, h('span', null, tt('Email')), email),
      h('label', null, h('span', null, tt('Password')), pass),
      h('div', { class: 'btns' },
        h('button', { class: 'btn main', onclick: () => go('in') }, tt('Sign in')),
        h('button', { class: 'btn', onclick: () => go('up') }, tt('Create an account')),
        h('button', { class: 'btn ghost', onclick: () => go('reset') }, tt('Forgot your password?')))));
}

/* ---------------- #/ranks ---------------- */
function pageRanks() {
  return later(async () => {
    const c = await sb();
    const since = new Date(Date.now() - 35 * 864e5).toISOString();
    const { data: bosses, error } = await c.from('bosses').select('*').gt('ends_at', since).lte('starts_at', new Date().toISOString()).order('ends_at', { ascending: false });
    if (error) throw error;
    const cards = [];
    for (const b of bosses || []) {
      const live = new Date(b.ends_at) > Date.now();
      const [{ data: top }, { data: won }] = await Promise.all([c.rpc('boss_ranking', { p_boss: b.id, p_n: 10 }),
        b.awarded ? c.from('badges').select('*').eq('boss_id', b.id).order('rank') : Promise.resolve({ data: [] })]);
      cards.push(h('div', { class: 'card pad boss' },
        h('div', { class: 'bossHead' }, h('img', { src: 'img/creature/' + b.creature + '.jpg', alt: '' }),
          h('div', null, h('h3', null, b.title), h('div', { class: 'muted' }, tt(KIND[b.kind]) + ' · ' + creatureName(b.creature) + ' · ' + (live ? left(b.ends_at) : tt('ended {d}', { d: day(b.ends_at) }))),
            h('div', null, tt('Top 3 win: {b}', { b: b.badge_title })))),
        (top || []).length ? h('div', { class: 'ranking' }, top.map(r => h('div', { class: MEDAL[r.rank] || '' }, h('b', null, r.rank + '. ' + r.hero_name), h('span', null, r.score + ' ' + tt('points')))))
          : h('p', { class: 'muted' }, tt('No one has fought it yet.')),
        (won || []).length ? h('div', { class: 'medals' }, won.map(x => medal(x, true))) : null));
    }
    return h('div', null, h('h2', null, tt('The Open Dungeon')),
      h('p', { class: 'lead' }, tt('Once a hero defeats the Unwriter, the heart of the Margin opens. Each week and each month a great boss waits there, in rooms of up to 21 heroes who fight it, fight each other, or make allies. When its time runs out, the three best get a numbered badge signed by the game.')),
      cards.length ? h('div', { class: 'stack' }, cards) : h('div', { class: 'card pad' }, h('p', null, tt('No boss yet. Come back soon.'))));
  });
}

/* ---------------- #/badge/<serial> ---------------- */
const unb64 = s => Uint8Array.from(atob(s), ch => ch.charCodeAt(0));
async function verifyBadge(b) {
  if (!C.badgePublicKey || !b.signature || b.signature === '-') return null;
  try {
    const key = await crypto.subtle.importKey('raw', unb64(C.badgePublicKey), { name: 'Ed25519' }, false, ['verify']);
    const okSig = await crypto.subtle.verify('Ed25519', key, unb64(b.signature), new TextEncoder().encode(b.payload));
    const p = b.payload.split('|');   // ElevenSeals|badge|serial|boss|rank|hero|user|title|issued
    return okSig && p[0] === 'ElevenSeals' && +p[2] === +b.serial && p[5] === b.hero_name;
  } catch (e) { return null; }   // this browser cannot check Ed25519
}
function pageBadge(args) {
  const serial = parseInt(args[0], 10);
  return later(async () => {
    const c = await sb();
    const { data: b } = await c.from('badges').select('*').eq('serial', serial).maybeSingle();
    if (!b) return h('div', { class: 'card pad' }, h('p', null, tt('There is no badge with this number.')));
    const boss = b.boss_id ? (await c.from('bosses').select('title, kind, creature').eq('id', b.boss_id).maybeSingle()).data : null;
    const v = await verifyBadge(b);
    const status = b.revoked ? ['bad', tt('This badge was taken back by the game.')]
      : v === true ? ['good', tt('Verified: signed by The Eleven Seals.')] : v === false ? ['bad', tt('Not verified: this badge was not signed by the game.')] : ['', tt('This browser cannot check the signature.')];
    return h('div', { class: 'badgePage' },
      h('a', { class: 'back', href: '#/ranks' }, '← ' + tt('Rankings')),
      h('div', { class: 'card pad center' }, medal(b),
        h('h2', null, b.title),
        h('p', { class: 'lead' }, tt('Won by {h}', { h: b.hero_name }) + (b.rank ? ' · ' + tt('rank {n}', { n: b.rank }) : '')),
        boss && h('p', null, tt(KIND[boss.kind]) + ': ' + boss.title),
        h('p', { class: 'muted' }, tt('Badge No. {n} · given on {d}', { n: String(b.serial).padStart(6, '0'), d: day(b.issued_at) })),
        h('p', { class: 'verify ' + status[0] }, status[1]),
        h('details', null, h('summary', null, tt('Signature')), h('code', { class: 'sig' }, b.payload), h('code', { class: 'sig' }, b.signature))));
  });
}

/* ---------------- #/admin ---------------- */
function pageAdmin() {
  return later(async () => {
    const c = await sb(), s = await session();
    if (!s) return h('div', { class: 'card pad' }, h('p', null, tt('Sign in first.')), h('a', { class: 'btn main', href: '#/account' }, tt('Account')));
    if (!(await isAdmin(c, s.user))) return h('div', { class: 'card pad' }, h('p', null, tt('This page is for admins only.')));
    return h('div', { class: 'admin' }, h('h2', null, tt('Admin')),
      await adminIncome(c), adminDrop(c), await adminBosses(c), await adminRewards(c), adminPlayers(c));
  });
}
async function adminIncome(c) {
  const { data: pays, error } = await c.from('payments').select('*').order('paid_at', { ascending: false }).limit(1000);
  if (error) throw error;
  const sum = days => { const from = days ? Date.now() - days * 864e5 : 0, out = {};
    for (const p of pays || []) if (new Date(p.paid_at) >= from) out[p.currency] = (out[p.currency] || 0) + +p.amount;
    return Object.entries(out).map(([cur, v]) => v.toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' ' + cur).join(' + ') || '0'; };
  return h('section', { class: 'card pad' }, h('h3', null, tt('Income')),
    h('div', { class: 'stats' }, [[tt('Today'), 1], [tt('7 days'), 7], [tt('30 days'), 30], [tt('All (last 1000)'), 0]].map(([l, d]) => h('div', null, h('small', null, l), h('b', null, sum(d))))),
    h('p', { class: 'muted' }, tt('Card payments are in USD and Mobile Money in UGX. Flutterwave takes its fee before paying out.')),
    h('table', { class: 'tbl' }, h('tr', null, ['When', 'Item', 'Amount', 'Way'].map(x => h('th', null, tt(x)))),
      (pays || []).slice(0, 30).map(p => h('tr', null, h('td', null, when(p.paid_at)), h('td', null, p.item), h('td', null, p.amount + ' ' + p.currency), h('td', null, p.method === 'momo' ? 'Mobile Money' : tt('card'))))));
}
function adminDrop(c) {
  const iso = d => new Date(d - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
  const f = {
    title: h('input', { placeholder: tt('e.g. The Ink Leviathan') }),
    creature: h('select', null, Object.keys(MONSTERS_()).sort((a, b) => creatureName(a).localeCompare(creatureName(b))).map(id => h('option', { value: id }, creatureName(id) + ' (' + id + ')'))),
    kind: h('select', null, ['weekly', 'monthly', 'special'].map(k => h('option', { value: k }, tt(KIND[k])))),
    level: h('input', { type: 'number', value: 30, min: 1, max: 99 }),
    hp: h('input', { type: 'number', value: 60000, min: 1 }), atk: h('input', { type: 'number', value: 90, min: 0 }), def: h('input', { type: 'number', value: 12, min: 0 }),
    starts: h('input', { type: 'datetime-local', value: iso(Date.now()) }), ends: h('input', { type: 'datetime-local', value: iso(Date.now() + 7 * 864e5) }),
    badge: h('input', { placeholder: tt('e.g. Leviathan Slayer · Week 12') }), art: h('input', { placeholder: tt('picture: empty = the creature, or a link') }),
  };
  f.kind.onchange = () => { const d = f.kind.value === 'monthly' ? 30 : f.kind.value === 'weekly' ? 7 : 3; f.ends.value = iso(new Date(f.starts.value).getTime() + d * 864e5);
    if (f.kind.value === 'monthly' && +f.hp.value === 60000) f.hp.value = 250000; };
  f.creature.value = 'hydra' in MONSTERS_() ? 'hydra' : f.creature.value;
  const row = (label, el) => h('label', null, h('span', null, label), el);
  const drop = async () => {
    if (!f.title.value.trim() || !f.badge.value.trim()) return toast(tt('Give the boss and its badge a name'));
    const { error } = await c.rpc('admin_drop_boss', { p_title: f.title.value.trim(), p_creature: f.creature.value, p_kind: f.kind.value, p_level: +f.level.value,
      p_hp: +f.hp.value, p_atk: +f.atk.value, p_def: +f.def.value, p_starts: new Date(f.starts.value).toISOString(), p_ends: new Date(f.ends.value).toISOString(),
      p_badge_title: f.badge.value.trim(), p_badge_art: f.art.value.trim() });
    if (error) return toast(error.message);
    toast(tt('The boss is in the dungeon')); again();
  };
  return h('section', { class: 'card form' }, h('h3', null, tt('Drop a new boss')),
    h('p', { class: 'muted' }, tt('Health is for each room of up to 21 heroes. A level-27 hero strikes for about 60–100. Weekly: about 60 000 health; monthly: about 250 000.')),
    h('div', { class: 'formGrid' }, row(tt('Name'), f.title), row(tt('Creature (picture)'), f.creature), row(tt('Kind'), f.kind), row(tt('Level'), f.level),
      row(tt('Health per room'), f.hp), row(tt('Attack'), f.atk), row(tt('Defence'), f.def), row(tt('Starts'), f.starts), row(tt('Ends'), f.ends),
      row(tt('Badge name'), f.badge), row(tt('Badge picture'), f.art)),
    h('div', { class: 'btns' }, h('button', { class: 'btn main', onclick: drop }, tt('Drop the boss'))));
}
async function adminBosses(c) {
  const { data: bosses } = await c.from('bosses').select('*').order('ends_at', { ascending: false }).limit(30);
  const now = Date.now();
  return h('section', { class: 'card pad' }, h('h3', null, tt('Bosses')),
    h('table', { class: 'tbl' }, h('tr', null, ['Boss', 'Kind', 'Time', 'Rewards', ''].map(x => h('th', null, tt(x)))),
      (bosses || []).map(b => { const live = new Date(b.starts_at) <= now && new Date(b.ends_at) > now, soon = new Date(b.starts_at) > now;
        return h('tr', null, h('td', null, h('b', null, b.title), h('br'), h('small', null, creatureName(b.creature) + ' · ' + b.hp + ' / ' + b.atk + ' / ' + b.def)),
          h('td', null, tt(KIND[b.kind])), h('td', null, soon ? tt('starts {d}', { d: when(b.starts_at) }) : live ? left(b.ends_at) : tt('ended {d}', { d: day(b.ends_at) })),
          h('td', null, b.awarded ? tt('given') : live || soon ? '—' : tt('waiting')),
          h('td', null, (live || soon) && h('button', { class: 'btn small', onclick: async () => { if (!confirm(tt('End “{b}” now? Its ranking is then final.', { b: b.title }))) return; const { error } = await c.rpc('admin_end_boss', { p_boss: b.id }); toast(error ? error.message : tt('Ended')); again(); } }, tt('End now')),
            !b.awarded && h('button', { class: 'btn ghost small', onclick: async () => { if (!confirm(tt('Delete “{b}” and all its rooms and scores?', { b: b.title }))) return; const { error } = await c.rpc('admin_delete_boss', { p_boss: b.id }); toast(error ? error.message : tt('Deleted')); again(); } }, tt('Delete')))); })));
}
async function adminRewards(c) {
  const { data: badges } = await c.from('badges').select('*').order('serial', { ascending: false }).limit(50);
  const give = async btn => {
    btn.disabled = true;
    const { data, error } = await c.functions.invoke('award-badges', { body: {} });
    btn.disabled = false;
    if (error) return toast(error.message);
    toast(tt('{n} badges given', { n: (data && data.given || []).length })); again();
  };
  return h('section', { class: 'card pad' }, h('h3', null, tt('Rewards (badges)')),
    h('p', { class: 'muted' }, tt('When a boss’s time is over, give its top 3 their numbered, signed badge. It can also run by itself every hour (see the README).')),
    h('div', { class: 'btns' }, h('button', { class: 'btn main', onclick: e => give(e.currentTarget) }, tt('Give rewards for ended bosses'))),
    h('table', { class: 'tbl' }, h('tr', null, ['No.', 'Badge', 'Hero', 'Rank', ''].map(x => h('th', null, tt(x)))),
      (badges || []).map(b => h('tr', { class: b.revoked ? 'revoked' : '' }, h('td', null, h('a', { href: '#/badge/' + b.serial }, '#' + String(b.serial).padStart(6, '0'))), h('td', null, b.title),
        h('td', null, b.hero_name), h('td', null, b.rank || ''),
        h('td', null, h('button', { class: 'btn ghost small', onclick: async () => { const { error } = await c.rpc('admin_revoke_badge', { p_serial: b.serial, p_revoked: !b.revoked }); toast(error ? error.message : tt('Saved')); again(); } }, b.revoked ? tt('Give back') : tt('Take back')))))));
}
function adminPlayers(c) {
  const q = h('input', { placeholder: tt('a hero name') }), out = h('div');
  const find = async () => {
    const { data, error } = await c.rpc('admin_player', { p_name: q.value.trim() });
    if (error) return toast(error.message);
    if (!data || !data.length) return out.replaceChildren(h('p', { class: 'muted' }, tt('No player has that name.')));
    const banned = data[0].banned;
    out.replaceChildren(h('p', null, tt('Names: {n}', { n: data.map(d => d.name).join(', ') }) + ' · ' + tt('badges: {n}', { n: data[0].badges }) + ' · ' + tt('since {d}', { d: day(data[0].joined) }) + (banned ? ' · ' + tt('banned') : '')),
      h('div', { class: 'btns' },
        h('button', { class: 'btn', onclick: async () => { const { error } = await c.rpc('admin_set_banned', { p_name: q.value.trim(), p_banned: !banned }); toast(error ? error.message : tt('Saved')); find(); } }, banned ? tt('Unban') : tt('Ban from the online part')),
        h('button', { class: 'btn ghost', onclick: async () => { if (!confirm(tt('Free the name “{n}”?', { n: q.value.trim() }))) return; await c.rpc('release_name', { p_name: q.value.trim() }); toast(tt('Name freed')); find(); } }, tt('Free this name'))));
  };
  return h('section', { class: 'card form' }, h('h3', null, tt('Players')), h('label', null, h('span', null, tt('Find a player')), q),
    h('div', { class: 'btns' }, h('button', { class: 'btn main', onclick: find }, tt('Find'))), out);
}

window.EXTRA_PAGES = { account: pageAccount, ranks: pageRanks, badge: pageBadge, admin: pageAdmin };
})();
