/* =====================================================================
   THE ELEVEN SEALS COMMUNITY - config.js
   The only file you need to edit to put the page online.
   ===================================================================== */
const COMMUNITY = {
  // where the "Play" buttons go. Relative works when the game and this page
  // sit side by side; put the full address once the game is online.
  // the web game on Cloudflare Pages (Play buttons)
  gameUrl: 'https://eleven-seals.pages.dev/',

  // the Android download (Download page, #/download). The APKs sit on the
  // GitHub release named by `tag`; files are eleven-seals-<version>-en-<lang>.apk.
  // Set playStoreUrl once the game is on Google Play: the page then shows that first.
  android: {
    version: '0.7.1',
    tag: 'v0.7.1',
    releaseBase: 'https://github.com/PatrickSafari840/eleven-seals-community/releases/download/',
    releasePage: 'https://github.com/PatrickSafari840/eleven-seals-community/releases/latest',
    // one APK per language pair (English + one), size in MB
    builds: [
      { lang: 'fr', name: 'English + Français', mb: 308 },
      { lang: 'es', name: 'English + Español', mb: 308 },
      { lang: 'pt', name: 'English + Português', mb: 304 },
      { lang: 'ja', name: 'English + 日本語', mb: 329 },
      { lang: 'zh', name: 'English + 中文', mb: 307 },
      { lang: 'ar', name: 'English + العربية', mb: 314 },
      { lang: 'ru', name: 'English + Русский', mb: 301 },
    ],
    playStoreUrl: '',
  },

  // your community links (Discord, YouTube, website, store pages...).
  // Empty: the page uses COMMUNITY_LINKS from the game (data/tales.js).
  links: [
    // { name: 'Discord', note: 'Chat with other hunters', url: 'https://discord.gg/...' },
  ],

  // bug reports: fill one or both, or leave both empty and players copy
  // the report to paste wherever you ask them to.
  reportEmail: '',            // e.g. 'bugs@your-studio.example'
  issuesUrl: '',              // e.g. 'https://github.com/you/eleven-seals/issues/new'

  // accounts, rankings, badges and the admin page (online.js): the same two values as
  // ONLINE in the game's data/online.js. Empty: those pages say they are not switched on.
  supabaseUrl: '',            // 'https://xxxx.supabase.co'
  anonKey: '',                // the anon public key (never the service_role key)
  // the PUBLIC key from 11_seals/tools/badge-keys.html: lets anyone check a badge is real
  badgePublicKey: '',
};
