/* =====================================================================
   THE ELEVEN SEALS COMMUNITY - i18n.js
   The same six languages as the game. Game texts (kingdoms, monsters,
   legends, What's new, lore) use the game's own dictionaries, copied into
   game-data/lang/ by sync.ps1. The page's own words are in lang-page.js.
   Load order: game-data/lang/files.js, this file, lang-page.js; the
   game's dictionaries load after (I18N_READY) and only for non-English.
   ===================================================================== */
const LANGS = [
  { id: 'en', name: 'English' }, { id: 'fr', name: 'Français' }, { id: 'es', name: 'Español' },
  { id: 'pt', name: 'Português' }, { id: 'ja', name: '日本語' }, { id: 'zh', name: '中文' },
];
const L10N = {};
const PAGE_L10N = {};
const LANG_KEY = 'eleven-seals-community.lang';
let LANG = (function () {
  let id = '';
  try { id = new URLSearchParams(location.search).get('lang') || localStorage.getItem(LANG_KEY) || ''; } catch (e) {}
  if (!id) { try { id = JSON.parse(localStorage.getItem('inkwild.tales.settings') || '{}').lang || ''; } catch (e) {} }   // the game's choice, when both share a site
  if (!id) id = ((navigator.languages && navigator.languages[0]) || navigator.language || 'en').slice(0, 2).toLowerCase();
  return LANGS.some(l => l.id === id) ? id : 'en';
})();
document.documentElement.lang = LANG;

// called by the game's lang/*.js files
function addLang(id, dict) { L10N[id] = Object.assign(L10N[id] || {}, dict); }
// called by lang-page.js
function addPageLang(id, dict) { PAGE_L10N[id] = Object.assign(PAGE_L10N[id] || {}, dict); }

// a game text: kingdom title, monster name, legend, What's new line...
function tr(s) {
  if (LANG === 'en' || typeof s !== 'string' || !s.trim()) return s;
  const D = L10N[LANG] || {};
  if (Object.prototype.hasOwnProperty.call(D, s)) return D[s];
  const m = s.match(/^(\s*)([\s\S]*?)([\s.:!?…]*)$/);
  if (m && m[2] !== s && Object.prototype.hasOwnProperty.call(D, m[2])) return m[1] + D[m[2]] + m[3];
  const the = s.match(/^the (.+)$/i);
  if (the && Object.prototype.hasOwnProperty.call(D, the[1])) return D[the[1]];
  return s;
}
// a word of this page; {name} blanks are filled from vars (after translation)
function t(s, vars) {
  const D = PAGE_L10N[LANG] || {};
  let out = LANG !== 'en' && Object.prototype.hasOwnProperty.call(D, s) ? D[s] : s;
  if (vars) out = out.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  return out;
}
// loads the game's dictionaries (in order) only when the page is not in English
const I18N_READY = LANG === 'en' || typeof GAME_LANG_FILES === 'undefined' ? Promise.resolve() : GAME_LANG_FILES.reduce((p, f) => p.then(() => new Promise(res => {
  const s = document.createElement('script'); s.src = 'game-data/lang/' + f + '.js'; s.onload = s.onerror = () => res(); document.head.append(s);
})), Promise.resolve());
function setLang(id) {
  if (!LANGS.some(l => l.id === id)) return;
  try { localStorage.setItem(LANG_KEY, id); } catch (e) {}
  location.reload();
}
