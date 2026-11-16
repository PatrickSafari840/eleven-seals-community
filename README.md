# The Eleven Seals · Community

The community web page of the game. It is its own small web app: no server, no database, no accounts. Put this folder online anywhere that serves static files (GitHub Pages, Netlify, itch.io, your own host).

## Pages
- **News** (`#/`): What's new in the current version, a link to play, a lore stone.
- **Kingdoms** (`#/kingdoms`, `#/kingdoms/<id>`): the eleven kingdoms with their soldiers, rulers, Huntmasters, Seal, hero of old and monsters.
- **Monsters** (`#/monsters`): the Book of Monsters, with search, filters, the real legend behind every creature, and its secret behind a spoiler.
- **Hero cards** (`#/hero/<code>`): a card of a player's hero. In the game: title screen › Community › **Share my hero**. The card can be saved as a PNG or shared as a link. The code holds only what the card shows (name, kingdom, portrait, level, attributes, seals, deeds), never the save.
- **Report a bug** (`#/report`): a form that builds a clear report. Players copy it, or send it by email or as a GitHub issue if you set that up in `config.js`.
- **Community** (`#/links`): your links and the About text.

## Languages
The page has the game's six languages: English, French, Spanish, Portuguese, Japanese and Chinese.
- **Choosing:** players pick a language from the menu at the top. Their choice is remembered. If they haven't picked one, the page uses the game's language when both share a site, or else the browser's language. A link can also force one, e.g. `index.html?lang=ja#/monsters`.
- **Game texts** (kingdoms, monster legends, What's new, lore) use the game's own translations, copied by `sync.ps1`. They load only for non-English visitors.
- **The page's own words** are in `lang-page.js`, one row per text: `[English, fr, es, pt, ja, zh]`.
- **Bug reports** are always written in English, with the player's language noted, so you can read every one.

## Files
- `config.js`: the only file to edit. Contains:
  - the address of the game
  - your links
  - the bug-report email or issues page
- `index.html`, `style.css`, `app.js`: the page itself.
- `game-data/`, `img/`: copied from the game by `sync.ps1`. Don't edit them here.
- `sync.ps1`: copies the kingdoms, monsters, What's new and pictures from `..\11_seals`. Run it after you change the game:

      powershell -ExecutionPolicy Bypass -File sync.ps1

## Online
The page is live on GitHub Pages: **https://patricksafari840.github.io/eleven-seals-community/**. The repository is github.com/PatrickSafari840/eleven-seals-community, and the game's Community buttons open this address.

After you change the game or the page, publish again with one command. It runs `sync.ps1`, then pushes:

    powershell -ExecutionPolicy Bypass -File publish.ps1

## Going online (first time, for reference)
1. Put the game and this folder online.
2. In the game, set `COMMUNITY_URL` in `data/tales.js` to this page's full address.
3. Here, set `gameUrl` in `config.js` to the game's full address.
