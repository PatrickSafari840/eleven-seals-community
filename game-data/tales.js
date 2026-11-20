/* =====================================================================
   INKWILD TALES - data/tales.js
   Everything written for the text game: land descriptions, weapons,
   armour, the heroes of old, random events, the main quest and the
   numbers that balance the game. Edit freely.
   ===================================================================== */

/* ---------------- Game balance ---------------- */
const BAL = {
  mapRadius: 70,          // hexes from the centre to the edge of the ocean (three continents, see src/world.js)
  startGold: 25,          // you start with bare hands: enough for one tool (enemies are gentler until level 5: BAL.beginner)
  startFood: 6,
  get foodEvery() { return diff().food; },   // one food is eaten every this many steps (set by the difficulty)
  hungerDmg: 3,           // health lost per hungry turn in the Open Dungeon
  starve: { every: 4, pct: .1 },   // with no food at all: lose 10% of your health every 4 steps (src/game.js step)
  encounter: { plains: .16, forest: .24, hills: .22, water: .12, road: .06, margin: .35 },
  eventChance: .10,       // chance of a random event on a quiet step
  swimStamina: 18,        // stamina lost per water hex
  levelCap: 27,                  // the highest level a hero can reach (src/game.js gainXP)
  hpAtCap: 875,                  // a hero's maximum health at the top level, and the most it can ever be (src/game.js maxHp)
  // a beginner's advantage: until the hero reaches level 5, roaming animals, monsters and bandits are weaker
  // (less and less each level, then normal from level 5)
  // (health and damage multiplied) and never more than one level above the hero. Giants and Seal guardians are not.
  beginner: { 1: { hp: .6, dmg: .6 }, 2: { hp: .7, dmg: .7 }, 3: { hp: .8, dmg: .8 }, 4: { hp: .9, dmg: .9 }, untilLevel: 5 },
  // fishing: after this many catches the fish grow wary of your hook, for this many days (src/events.js)
  fishing: { catches: 25, restDays: 4 },
  monsterCap: 35,                // the highest level any enemy can have (src/combat.js makeEnemy), above levelCap
  areaLevel: d => Math.min(35, 1 + Math.floor(d / 4)),   // monster level by distance (in hexes) from where you start (was up to 45)
};
/* ---------------- Difficulty (the player picks Normal or Hard for each new hero) ----------------
   hp / dmg: enemy health and damage · gold: gold won in fights · food: steps per ration eaten
   enc: how often you meet enemies · camp: how much a camp heals.
   mends: how many times an enemy can restore its health in one fight (see ENEMY_AI in src/combat.js).
   Only these two can be chosen. */
const DIFFICULTY = {
  normal: { name: 'Normal', hp: 1.2,  dmg: 1.2,  gold: .85, food: 7, enc: 1.15, camp: .9,  mends: 2 },
  hard:   { name: 'Hard',   hp: 1.45, dmg: 1.45, gold: .7,  food: 6, enc: 1.3,  camp: .75, mends: 3 },
};
const DEFAULT_DIFFICULTY = 'hard';   // used for heroes saved before the choice existed
const diff = () => DIFFICULTY[(typeof S !== 'undefined' && S && S.difficulty)] || DIFFICULTY[DEFAULT_DIFFICULTY];
const XP_FOR = level => Math.round(70 * Math.pow(level, 1.6));   // 70 XP for level 2 (doubled from 35)   // XP needed to go from this level to the next (was 25 * level^1.5: too fast)

/* ---------------- Economy (taps, drains, converters, traders) ----------------
   Built on the "How Video Game Economies are Designed" model (Game Maker's Toolkit):
   TAPS make gold (fights, bounties, events), DRAINS remove it (food, inn, death, bandits, forge),
   CONVERTERS turn it into power (shops, forge, brewing), TRADERS buy and sell by their own rules.
   The numbers below are the main knobs for keeping gold scarce enough that choices matter. */
const ECON = {
  fightGold: L => 3 + 1.5 * L,   // coins a monster of level L drops before kind/difficulty (was 3 + 2 * L)
  // Negative feedback (no "cow farming"): monsters far below your level pay less gold.
  gapFree: 3,                    // up to this many levels below you: full gold
  gapStep: .15,                  // -15% gold for each level below that...
  gapFloor: .1,                  // ...down to 10%
  // Supply and demand: each unit of the same thing sold in the same town on the same day
  // pays less than the last one. It resets each morning.
  sellDrop: .04,                 // -4% per unit already sold there today...
  sellFloor: .5,                 // ...never below 50% of the normal price
};
const econGap = lvl => { const g = (S ? S.lvl : 1) - lvl - ECON.gapFree; return g <= 0 ? 1 : Math.max(ECON.gapFloor, 1 - ECON.gapStep * g); };

/* ---------------- Land colours and descriptions, per land type ---------------- */
// plains / forest / hills are the walkable land; water can be swum.
const LANDS = {
  tundra:   { plains: '#e3e8ea', forest: '#9fb1a8', hills: '#c3cacd', water: '#8fb6c8', mount: '#8d979c', names: ['snowfield', 'pine forest', 'frozen hills', 'ice lake'],
              text: { plains: ['Snow creaks under your boots. The wind has no wall to stop it here.', 'A white plain, flat as a page. Somewhere far off, a wolf calls.'],
                      forest: ['Black pines heavy with snow. Every branch could hide something.', 'The pines stand so close that the daylight turns blue.'],
                      hills: ['Frozen hills. You climb with care: the ice hides holes.', 'From the hilltop you see the sea of white roll away north.'],
                      water: ['The lake is half frozen. The cold bites through to the bone.', 'Grey water under thin ice. You do not stay long.'] } },
  taiga:    { plains: '#b8c48f', forest: '#5f7f50', hills: '#a3a58f', water: '#7fa9b9', mount: '#7d7d70', names: ['meadow', 'birch forest', 'mossy hills', 'forest lake'],
              text: { plains: ['A meadow of tall grass and wild flowers, with birch woods all around.', 'An old wooden cross leans by the trail. Someone left bread at its foot.'],
                      forest: ['White birches, dark firs. The forest is very quiet. Too quiet.', 'Mushrooms in a perfect ring. You step around it.'],
                      hills: ['Mossy hills, soft underfoot. A crow follows you from rock to rock.', 'You find an empty hut on chicken legs. It turns its back on you.'],
                      water: ['Still forest water. Long green hair seems to float just below.', 'Water lilies, reeds, and a cold that pulls at your legs.'] } },
  steppe:   { plains: '#d2c788', forest: '#9aa266', hills: '#b3a586', water: '#86b0c0', mount: '#8f8268', names: ['steppe', 'grove', 'stony hills', 'steppe lake'],
              text: { plains: ['Grass to the end of the world. The sky is enormous.', 'You pass a stone cairn hung with blue scarves. Riders pray here.'],
                      forest: ['A rare grove of poplars, loud with birds.', 'Twisted trees bent by the wind. Horses rest in their shade.'],
                      hills: ['Stony hills where eagles circle. Old graves lie under the cairns.', 'From the ridge you can see a camp of round tents far below.'],
                      water: ['A salt lake, bright as a mirror.', 'Cold, clear water. Wild horses drink on the far shore.'] } },
  bamboo:   { plains: '#b0cb8e', forest: '#5e8f4c', hills: '#a9ab9a', water: '#80b2c2', mount: '#7f8287', names: ['rice terraces', 'bamboo forest', 'misty peaks', 'jade river'],
              text: { plains: ['Rice terraces climb the slope like stairs for giants.', 'A farmer bows to you from his field, then goes back to work.'],
                      forest: ['Bamboo creaks in the wind like a thousand doors.', 'Green light, tall stalks, and the soft sound of something hopping.'],
                      hills: ['The peaks wear the mist like a scarf. A small shrine sits on the cliff.', 'Stone stairs cut into the mountain, worn smooth by pilgrims.'],
                      water: ['A wide jade river. Golden carp turn below the surface.', 'Lotus leaves, slow water, and a stone bridge long fallen.'] } },
  sakura:   { plains: '#b2cf94', forest: '#6f9d5c', hills: '#aeada4', water: '#7cb0c2', mount: '#83807c', names: ['blossom fields', 'cedar woods', 'mountain path', 'river'],
              text: { plains: ['Cherry blossoms drift across the path like warm snow.', 'A small torii gate stands alone in the field, leading nowhere.'],
                      forest: ['Old cedars, wide as houses, tied with straw ropes.', 'Lanterns hang in the trees. None of them are lit, but they glow anyway.'],
                      hills: ['A narrow mountain path. Long-nosed shadows watch from the rocks.', 'Hot springs steam between the stones.'],
                      water: ['A quick river. Someone left a cucumber on the bank, as an offering.', 'Clear water over smooth stones. Something with a bowl on its head ducks under.'] } },
  tropic:   { plains: '#a2cd80', forest: '#4f8c3c', hills: '#a3a383', water: '#6cc0c8', mount: '#86866a', names: ['island meadow', 'jungle', 'volcanic hills', 'lagoon'],
              text: { plains: ['Warm grass, coconut palms and the smell of the sea.', 'A village dog follows you for a while, then trots home.'],
                      forest: ['Thick jungle. A huge balete tree smokes a cigar-shaped shadow.', 'Vines, bright birds, and a heat that sits on your shoulders.'],
                      hills: ['Black volcanic stone, warm under your hand.', 'From the hill you can count a dozen green islands.'],
                      water: ['A turquoise lagoon. Bright fish dart around your legs.', 'Warm, shallow sea over white sand.'] } },
  monsoon:  { plains: '#93ba6c', forest: '#4f8538', hills: '#a6a385', water: '#7cb0b9', mount: '#8a876c', names: ['green plains', 'banyan woods', 'temple hills', 'monsoon river'],
              text: { plains: ['Green fields after the rain. Peacocks call from the hedges.', 'A roadside shrine with fresh marigolds and a little oil lamp.'],
                      forest: ['Banyan trees, their roots hanging like curtains. Monkeys watch you.', 'The air is thick and sweet. A bell rings somewhere deep in the woods.'],
                      hills: ['Ruined temple steps covered in vines.', 'Carved elephants guard the hill path, faces worn away by rain.'],
                      water: ['A brown, wide river, swollen by the monsoon.', 'Bathing steps lead down into slow water.'] } },
  savanna:  { plains: '#b5c47c', forest: '#7a9a50', hills: '#c0b093', water: '#86b8c6', mount: '#97856a', names: ['savanna', 'acacia woods', 'kopjes', 'waterhole'],
              text: { plains: ['Golden grass to the horizon, and one lonely acacia.', 'A herd of zebra moves away from you, unhurried.'],
                      forest: ['Acacia and thorn bush. Weaver nests hang like lanterns.', 'A baobab as wide as a house. Its hollow trunk has been used as a shelter.'],
                      hills: ['Granite kopjes, round and warm. A leopard could be lying on any of them.', 'From the rocks you can see the whole plain breathe.'],
                      water: ['A muddy waterhole. Everything comes here to drink, sooner or later.', 'A slow brown river. You watch the water for long, still shapes.'] } },
  desert:   { plains: '#ead6a0', forest: '#b9b57a', hills: '#d2b484', water: '#82bcc6', mount: '#a98b62', names: ['dunes', 'oasis palms', 'rocky mesas', 'oasis pool'],
              text: { plains: ['Dunes like frozen waves. Your footprints vanish behind you.', 'The heat shimmers. For a moment you see a city that is not there.'],
                      forest: ['Date palms around a well. Shade, at last.', 'A ring of palms and a tent where a merchant sleeps.'],
                      hills: ['Red mesas carved by the wind. Old symbols are cut into the rock.', 'A ruined watchtower on the cliff, half buried in sand.'],
                      water: ['A clear oasis pool, cool and green.', 'Precious water. Camels kneel along the edge.'] } },
  olive:    { plains: '#d3cb98', forest: '#9aa36c', hills: '#d3cbb8', water: '#6faccc', mount: '#9b9381', names: ['olive groves', 'cypress woods', 'white hills', 'blue bay'],
              text: { plains: ['Olive groves, silver-green, and the hum of bees.', 'A stone wall, a goat, and a view of the sea.'],
                      forest: ['Dark cypress trees stand like guards on the slope.', 'Pine resin and cicadas. A broken statue lies in the grass.'],
                      hills: ['White limestone hills. A shepherd counts his flock twice.', 'An old temple with half its columns standing.'],
                      water: ['A blue bay so clear you can see the bottom.', 'Warm water and the cry of gulls.'] } },
  highland: { plains: '#d0a070', forest: '#8f9a5c', hills: '#b07a58', water: '#86b2c0', mount: '#8a5a44', names: ['terraces', 'cloud forest', 'red highlands', 'mountain lake'],
              text: { plains: ['Stone terraces of maize and potatoes climb the valley.', 'Llamas watch you pass, chewing slowly.'],
                      forest: ['Cloud forest. Moss drips from every branch.', 'Bright orchids, and somewhere a woman weeping by water.'],
                      hills: ['Red highlands under a sky close enough to touch.', 'A condor glides over you, its shadow huge on the rocks.'],
                      water: ['A high lake, cold and dark blue.', 'Reed boats are pulled up on the shore.'] } },
};
const MARGIN_TEXT = ['The ground here has no colour. Your own outline looks too dark against it.', 'Bare page. No grass, no stone, no sound. Only white.', 'You find a table set for a family no one remembers.'];
const SEA_COLOR = '#5c8fa8', DEEP_COLOR = '#4a7c96', MARGIN_COLOR = '#f7f5ef', PAPER = '#efe7d6', INK = '#17140f';

/* ---------------- Weapons and armour ---------------- */
const WEAPONS = {
  fists:     { name: 'Bare hands',  dmg: 1,  price: 0 },
  club:      { name: 'Club',        dmg: 3,  price: 65 },     // sold at every general store (the only weapon under WEAPON_MIN_PRICE)
  dagger:    { name: 'Dagger',      dmg: 4,  price: 95,  crit: .12 },
  spear:     { name: 'Spear',       dmg: 5,  price: 105 },
  sword:     { name: 'Sword',       dmg: 6,  price: 120 },
  mace:      { name: 'Mace',        dmg: 7,  price: 130 },
  bow:       { name: 'Bow',         dmg: 6,  price: 115, first: true },
  scimitar:  { name: 'Scimitar',    dmg: 8,  price: 180, crit: .08 },
  trident:   { name: 'Trident',     dmg: 8,  price: 190 },
  katana:    { name: 'Katana',      dmg: 10, price: 300, crit: .12 },
  halberd:   { name: 'Halberd',     dmg: 11, price: 380 },
  warhammer: { name: 'Warhammer',   dmg: 13, price: 500 },
  greatsword:{ name: 'Greatsword',  dmg: 15, price: 700 },
};
const ARMOURS = {
  none:      { name: 'Traveller’s clothes', def: 0, price: 0 },
  leather:   { name: 'Leather armour', def: 2, price: 40 },
  iron:      { name: 'Iron armour',    def: 4, price: 150 },
  lamellar:  { name: 'Lamellar armour',def: 6, price: 320 },
  plate:     { name: 'Steel plate',    def: 8, price: 650 },
};
const WEAPON_LEVEL_REQ = { dagger: 1, spear: 2, sword: 3, mace: 5, bow: 4, scimitar: 8, trident: 9, katana: 12, halberd: 14, warhammer: 17, greatsword: 20, boneclub: 1, fangknife: 3, inkblade: 12, pearlspear: 16, jarlaxe: 22, kladenets: 22, khanbow: 22, goldstaff: 22, kusanagi: 24, seakris: 20, urumi: 20, kpinga: 22, djinnblade: 22, harpe: 22, macuahuitl: 24 };
const ARMOUR_LEVEL_REQ = { leather: 1, iron: 5, lamellar: 10, plate: 16, hidecoat: 3, scalemail: 12, inkplate: 20 };
const SMITH_STOCK = {
  common: ['dagger', 'spear', 'sword', 'mace', 'bow'],
  hrimvald: ['greatsword', 'warhammer'], volkmark: ['warhammer', 'halberd'], temurai: ['scimitar', 'halberd'],
  shenlan: ['halberd', 'katana'], yamakai: ['katana'], laut: ['trident'], varnapur: ['scimitar', 'trident'],
  ndaru: ['trident', 'warhammer'], azhar: ['scimitar'], thalassa: ['trident', 'greatsword'], tlalqui: ['warhammer', 'katana'],
};
const GOODS = { hide: { name: 'Hide', sell: 3 }, essence: { name: 'Ink essence', sell: 9 }, fish: { name: 'Fish', sell: 2 }, pearl: { name: 'Pearl', sell: 20 }, fang: { name: 'Monster fang', sell: 6 } };
const FOOD_PRICE = 4, ROD_PRICE = 65, INN_PRICE = 8, PICK_PRICE = 65;
const WEAPON_MIN_PRICE = 95;   // no weapon is ever sold for less than this (town discounts included), except the club

/* ---------------- Techniques you can learn (spend technique points) ---------------- */
// Uses POWERS from base.js. In turn-based combat: cost is ink (mana), wait is turns before reuse.
// Every Huntmaster teaches Second Wind, plus the four techniques of their own people.
// To learn another people's techniques, travel to their capital's Hunters' Lodge.
const COMMON_TECHS = ['heal'];
const KINGDOM_TECHS = {
  hrimvald: ['berserk', 'frostrune', 'ironwill', 'blizzard'],
  volkmark: ['witchhex', 'iceshard', 'wolf', 'deathless'],
  temurai:  ['whirl', 'battlecry', 'volley', 'eaglestrike'],
  shenlan:  ['jadepalm', 'lightning', 'regen', 'dragonbreath'],
  yamakai:  ['iaido', 'foxfire', 'flashstep', 'bladestorm'],
  laut:     ['kris', 'cloak', 'venom', 'riptide'],
  varnapur: ['trishula', 'monsoon', 'leech', 'phoenix'],
  ndaru:    ['spearthrow', 'thunder', 'lionroar', 'warsong'],
  azhar:    ['fireball', 'djinnveil', 'meteor', 'sandstorm'],
  thalassa: ['seaspear', 'aegis', 'phalanx', 'starfall'],
  tlalqui:  ['jaguar', 'sunblessing', 'earthspike', 'obsidian'],
};
const LEARNABLE = [...COMMON_TECHS, ...Object.values(KINGDOM_TECHS).flat()];
const techKingdom = id => Object.keys(KINGDOM_TECHS).find(k => KINGDOM_TECHS[k].includes(id));

/* ---------------- Heroes of old (each sealed a greater blot-born) ---------------- */
const HEROES = {
  hrimvald: { name: 'Sigrid Halfhand', how: 'lit her own longship and sailed it into the Jotun’s hall, and lost her left hand to the frost' },
  volkmark: { name: 'Vasilisa the Wise', how: 'found the needle that held Koschei’s death, inside an egg, inside a duck, inside a hare, inside an iron chest' },
  temurai:  { name: 'Erdene the Archer', how: 'shot one arrow per head over eleven nights, singing each head’s name so it could not grow back' },
  shenlan:  { name: 'the Lantern Bearers', how: 'were a hundred children with red lanterns and drums, and made the last Seal of all' },
  yamakai:  { name: 'Hayato the Storm-Blade', how: 'brewed eight barrels of strong sake and waited until all eight heads were drunk' },
  laut:     { name: 'Malaya of the Tides', how: 'swam into its mouth and sang the old sea-chants until it slept, and never came out' },
  varnapur: { name: 'Princess Anjali of the Lotus Gate', how: 'saw through every face it wore by asking questions only the real person could answer' },
  ndaru:    { name: 'Nandi the Spear', how: 'refused the diamonds it offered, and made the very first Seal' },
  azhar:    { name: 'Layla the Lamp-Bearer', how: 'tricked it into a brass lamp by daring it to prove it could fit' },
  thalassa: { name: 'Odessa the Wanderer', how: 'told it her name was “No One”, then blinded it with a burning olive stake' },
  tlalqui:  { name: 'Tezca the Twin-Born', how: 'tore away its jaw with her brother, so it could only sink and never rise' },
};

/* ---------------- The main quest ---------------- */
// Each chapter: a goal shown in the journal, and a check that tells when it is done.
// Words in {braces} are filled in from the kingdom you chose: {kingdom}, {capital}, {master}, {seal}, {boss}, {hero}, {village}.
const CHAPTERS = [
  { title: 'A House No One Built',
    goal: 'Find {master} at the Hunters’ Lodge in {capital}, capital of {kingdom}.',
    intro: 'You wake in a small house at the edge of {village}. The bed is warm, the door is new, and nobody remembers the house being built—or remembers you. On the table lies a hunter’s token and a note in an unknown hand: “Go to {capital}. Find the Huntmaster. Say their names.” Outside, a bell rings once though the village has no bell tower. In the dust beneath the table, eleven tiny crowns have been drawn around a white circle.' },
  { title: 'The First Seal',
    goal: 'Break {boss}’s Seal in the {seal}, in {kingdom}.',
    intro: '{master} turns your token over. Its back bears eleven marks, one for each crown, and a twelfth mark scratched out. “The Ashen Century did not end with a victory,” the Huntmaster says. “The eleven Sealers bound the Blot beneath their lands, then made a pact never to let one crown rule the whole page. Now the bindings are thinning. {hero} sealed the danger beneath {kingdom}. You must go below, learn what is waking, and return alive.”' },
  { title: 'The Names That Remain',
    goal: 'Read four lore stones in the ruins of the old world.',
    intro: 'When {boss} breaks apart, the ink runs up your arms and writes a city you have never seen across the inside of your eyelids. At its centre stands the Unwriter. The Huntmaster recognizes the name from a forbidden line in the Lodge archive: “It can only erase what no one remembers.” Four old stones still hold the truth of the Ashen Century. Find them. The kings have kept different pieces of that truth, and none will trust a stranger with the whole story.' },
  { title: 'Missions of the Eleven Crowns',
    goal: 'In every kingdom, accept the ruler’s mission, break its Seal, and return to the castle for its oath. Do this for all eleven crowns.',
    intro: 'The four stones reveal why the rulers stopped speaking to one another. The last Quill Emperor tried to write every people into one law and every land into one shape. The eleven Sealers saved the world, but their heirs inherited only fragments of the pact—and centuries of suspicion. The Unwriter feeds on those old divisions. No lone hero can mend them. Travel to all eleven capitals. Hear each ruler’s account, carry out their mission at the local Seal, and return with proof. Each crown must choose to stand beside the others.' },
  { title: 'The Council at the Edge',
    goal: 'Sail to the Grey Pier after earning all eleven oaths, then face Corvin, the Hungry Child.',
    intro: 'One by one, the rulers set their marks beside yours: Eirik Frostborn, Mstislav, Batu, Lian, Hideaki, Makalaya, Vikram, Jabari, Amira, Leandros, and Inti. The old rivalries do not vanish, but the eleven crowns speak with one voice for the first time in generations. Their oath opens the way to the Margin. At its edge waits Corvin, the child-shaped hunger that guards the last road to Scriptoria. The rulers have entrusted you with their names. Carry them through.' },
  { title: 'The Last Page',
    goal: 'Reach the heart of the Margin and defeat the Unwriter.',
    intro: 'Corvin falls, and the white ground shudders. The rulers’ marks burn on your token, joining the four histories you recovered from the ruins. The way to the heart is open. The Unwriter waits where Scriptoria once stood, with a blank page spread beneath its feet. It has spent three centuries making the world forget itself. This time, the eleven kingdoms remember together.' },
];
const CROWN_MISSIONS = {
  hrimvald: 'The High Jarl asks you to break Hrimvald’s Seal and return to the castle with news of the guardian’s defeat. The winter watch needs to know the old danger has passed.',
  volkmark: 'The Tsar asks you to break Volkmark’s Seal and report what you discover in its prison. The court fears the forest has begun repeating the old imperial command.',
  temurai: 'The Great Khan asks you to break Temurai’s Seal and report to the capital. The riders say the storms have started blowing from underground.',
  shenlan: 'The Empress asks you to break Shenlan’s Seal and report when the mountain falls silent again. The bells above Longjing ring whenever the guardian stirs.',
  yamakai: 'The Shogun asks you to break Yamakai’s Seal and report to Hoshimura. The islands must know the old pact still holds.',
  laut: 'The Datu asks you to break Laut’s Seal and report what moves beneath the channels. No more ships should vanish without a name.',
  varnapur: 'The Maharaja asks you to break Varnapur’s Seal and report to Suryagarh. The monsoon has begun to carry a voice from below.',
  ndaru: 'The King asks you to break Ndaru’s Seal and return with news for the villages. They hear a drumbeat beneath the savanna and will answer it together.',
  azhar: 'The Sultana asks you to break Azhar’s Seal and report when the darkness has lifted. The caravans need proof the desert road can be opened again.',
  thalassa: 'The Archon asks you to break Thalassa’s Seal and report what lies beneath it. The council will not send its fleet until it knows the old warning.',
  tlalqui: 'The High Chief asks you to break Tlalqui’s Seal and report to the council. They will decide how the highlands should stand with the other crowns.'
};
// Each people gives its children one gift: +1 to this attribute at the start
const KINGDOM_GIFT = { hrimvald: 'vit', volkmark: 'str', temurai: 'agi', shenlan: 'spi', yamakai: 'agi', laut: 'agi', varnapur: 'spi', ndaru: 'str', azhar: 'spi', thalassa: 'str', tlalqui: 'vit' };
const ATTR_NAMES = { str: 'Strength', vit: 'Vitality', agi: 'Agility', spi: 'Spirit' };
// The Huntmaster of each kingdom's Lodge
const HUNTMASTERS = { ndaru: 'Huntmaster Kofi Mbeki', hrimvald: 'Huntmaster Astrid Ulfsdottir', volkmark: 'Huntmaster Bogdan Volkov', temurai: 'Huntmaster Khulan', shenlan: 'Huntmaster Wei Lan',
  yamakai: 'Huntmaster Kenji Mori', laut: 'Huntmaster Bayani', varnapur: 'Huntmaster Meera Rao', azhar: 'Huntmaster Layth', thalassa: 'Huntmaster Ariadne', tlalqui: 'Huntmaster Amaru' };
const ENDING = 'The Unwriter has no blood to spill. When your last blow lands, it simply… hesitates. Around you the white ground fills with lines: grass, stone, roads, the outline of a great city. Scriptoria is being drawn again, by every name you said and every stone you read. Somewhere, a quill touches a blank page. The story is not over. But now, for the first time in three hundred years, it is yours to write.';

/* ---------------- Random events on quiet steps ---------------- */
// Each event: text, and choices. A choice's effect is a small function in src/events.js, picked by its id.
const EVENTS = [
  { id: 'traveller', title: 'A traveller', text: 'A tired traveller shares your path for a while and offers to trade news for a bite of food.',
    choices: [{ t: 'Share 1 food', fx: 'rumour' }, { t: 'Walk on', fx: 'none' }] },
  { id: 'shrine', title: 'A wayside shrine', text: 'A little shrine with a carved figure and a bowl of offerings. The air feels lighter here.',
    choices: [{ t: 'Leave 5 gold and pray', fx: 'pray' }, { t: 'Rest a moment', fx: 'restsmall' }] },
  { id: 'camp', title: 'An abandoned camp', text: 'A cold fire, a torn tent, and a pack someone left behind in a hurry.',
    choices: [{ t: 'Search the pack', fx: 'loot' }, { t: 'Leave it alone', fx: 'none' }] },
  { id: 'bandits', title: 'The Inkless', text: 'Three figures with soot-blackened faces step out onto the path. “Bandits of the Inkless. Your purse, or your blood.”',
    choices: [{ t: 'Fight', fx: 'banditfight' }, { t: 'Outwit their lookouts', fx: 'banditwits' }, { t: 'Pay a third of your gold', fx: 'paybandits' }] },
  { id: 'herbs', title: 'Healing herbs', text: 'You spot a patch of bitter healing herbs, the kind every grandmother knows.',
    choices: [{ t: 'Gather them', fx: 'herbs' }] },
  { id: 'erased', title: 'An empty house', text: 'A house with the door open. A cradle by the fire, a pot still warm, and no one inside. On the wall, a black circle has been drawn.',
    choices: [{ t: 'Say a name aloud, any name', fx: 'sayname' }, { t: 'Back away', fx: 'none' }] },
  { id: 'merchant', title: 'A wandering merchant', text: 'A merchant with a mule loaded with jars. “Potions, friend? Fair prices, far from any town.”',
    choices: [{ t: 'Buy a healing draught (18 gold)', fx: 'buyheal' }, { t: 'No thanks', fx: 'none' }] },
  { id: 'wounded', title: 'A wounded hunter', text: 'A hunter of the Lodge lies by the path, bleeding. “Blot-born… took me by surprise.”',
    choices: [{ t: 'Give a potion', fx: 'helphunter' }, { t: 'Bandage him (lose 1 food)', fx: 'bandage' }, { t: 'Leave him', fx: 'leavehunter' }] },
  { id: 'cache', title: 'A Wayfarer’s cache', text: 'A stone marked with the Wayfarers’ sign. Under it, a small tin box.',
    choices: [{ t: 'Open it', fx: 'cache' }] },
  { id: 'storm', title: 'A sudden storm', text: 'The sky turns black. Rain comes down in sheets and you lose the path for a while.',
    choices: [{ t: 'Push through', fx: 'storm' }, { t: 'Shelter and wait (eat 1 food)', fx: 'shelter' }] },
  { id: 'child', title: 'A child-shaped shadow', text: 'At the edge of your sight, a small shadow is eating something. When you turn, it is gone. Your pack feels lighter.',
    choices: [{ t: 'Check your pack', fx: 'corvin' }] },
  { id: 'storyteller', title: 'An old storyteller', text: 'An old woman by a fire beckons you over. “Sit. Every story told is one more line the Pale Hand cannot erase.”',
    choices: [{ t: 'Listen to her tale', fx: 'tale' }] },
];
const RUMOURS = [
  'They say the Seals are cracking. Every war feeds the ink more fear.',
  'A whole village in the east was erased last spring. The houses are still there. The people are not.',
  'Giants walk the wild again. Not as strong as the great blot-born, but strong enough to flatten a hunter.',
  'The Hunters’ Lodge pays well for every blot-born killed. Check the board in any town.',
  'Ruins hold lore stones. Read them. My grandmother said the Pale Hand hates to be remembered.',
  'Fish bite best at dawn, but the rare ones only come to patient hands.',
  'In Laut they say a song can be heard under the sea, near the Taniwha’s grotto.',
  'Do not swim far from shore. The water tires you, and the deep takes the tired.',
  'Every blacksmith sells the weapons of their own people. Travel to find the best steel.',
  'The centre of the world is white and empty. Whatever is there, it is not a city any more.',
];
const TALES = [
  'She tells of Oduya the Listener, the emperor who never once used the ink to settle a quarrel, and made both sides talk until they agreed.',
  'She tells of Saya the Ferry-Woman, who carried refugees of every kingdom across the sea for free while the fleets burned.',
  'She tells of Grandmother Inti, who walked unarmed into an enemy camp to heal its wounded.',
  'She tells of Brother Ansel the Copyist, who copied lore stones by hand while the libraries were being erased.',
  'She tells of Kofi the First Hunter, who founded the Lodge in a burned village with nine survivors.',
];

/* ---------------- Opening menu: about and community ----------------
   Put your links here and they appear under "Community" in the opening menu.
   Example: { name: 'Discord', note: 'Chat with other hunters', url: 'https://discord.gg/xxxx' } */
const GAME_VERSION = '0.6.9';
// shown once after an update (and from "What’s new" on the title screen): src/title.js
const WHATS_NEW = [
  '<b>Missed hunts are no longer bosses.</b> A monster you do not find in time grows Enraged: stronger than before, and it still hunts you, but it is not Boss-rank any more.',
  '<b>An easier start.</b> Roaming animals, monsters and bandits are gentler until level 5 (it was level 3), a little less each level.',
  '<b>Scout animals.</b> Every kingdom’s general store sells its own scout animal (95 gold). Press Scout on the bottom bar: it reveals the land around you, marks danger, plants and ore, and points the way to your goal. It rests 1½ minutes between flights.',
  '<b>Catch any animal.</b> With a capture net, weaken an animal to a quarter of its health and throw the net. Tame it, sell it at a general store, or keep it in the stable of a capital’s inn. The pack donkey is now sold with the bags at the general store.',
  '<b>Show on map.</b> The world map zooms and drags, and marks your goal with a gold star. The Journal has a “Show on map” button.',
  '<b>Quests every 7 days.</b> Notice boards keep their quests for 7 days. Finish one, and that board posts new notices 7 days later.',
  '<b>Groups fight as one.</b> A pack or a band is one tougher enemy with more health. A hired sellsword (3, 7 or 10 days) gives you one more move each turn.',
  '<b>Teleport further.</b> Each trip now costs 15 to 25 gold, and you can teleport to visited towns of kingdoms allied or at peace with the one you are in.',
  '<b>Companions in battle.</b> A fighting beast and a hired sellsword each give you one more move every turn.',
  '<b>The fox scouts.</b> Once it trusts you, a fox marks danger in red, plants in green and ore in grey on the tiles around you. With it, creatures only attack on the red tiles.',
  '<b>Heavy bags and hunger.</b> An overloaded bag stops you moving and takes nothing more (drop things from the Bag), and with no food you lose health every 4 steps.',
  'New paintings for the mining stones, the sellsword and the Beast Friend badge. A new search game for poster scraps, and hunt marks that are easier to see, also on the world map.',
  'Soldiers of every kingdom now have their own paintings, and many buttons have new icons.',
  '<b>People remember you.</b> Innkeepers, shopkeepers, alchemists, smiths and Huntmasters have names and quiet feelings about you: be kind, bring gifts, or be rude, and watch their prices and favours change. Tap “Talk to…” in any shop or inn.',
  '<b>Clue games.</b> Poster scraps are guarded by traps and messes to search, Seal carvings hide rune puzzles, and you can outwit bandit lookouts at checkers.',
  '<b>Quests from the world.</b> Defend borders in wartime, escort caravans, fill shortages, and take on royal requests in castles.',
  '<b>Harder fights.</b> Gear wears down (repair it at a blacksmith), too many potions make you sick, and great foes learn your favourite attack.',
  '<b>Carry weight.</b> Bigger bags, a pack mule, and a storage chest at the inn where you sleep.',
  '<b>A beast companion.</b> Buy a capture net, weaken a wolf, boar, warthog, bear or fox, and tame it.',
  '<b>Group battles.</b> Wolf packs, bandit gangs and squads of soldiers; hire a sellsword in a capital to fight beside you.',
  '<b>Choose a path.</b> Sign on as a mercenary at a castle at war, or join the Inkless outlaws.',
];
// The community page (the 11_seals_community folder next to the game). When both are online,
// put its full address here, e.g. 'https://your-site.example/community/index.html'. Empty hides its buttons.
const COMMUNITY_URL = 'https://eleven-seals-community.pages.dev/index.html';   // on Cloudflare Pages (copy on GitHub Pages: patricksafari840.github.io/eleven-seals-community; local: '../11_seals_community/index.html')
const COMMUNITY_LINKS = [
  { name: 'Discord', note: 'Chat with other hunters', url: 'https://discord.gg/tUsbmrkng' },
  // { name: 'YouTube', note: 'Trailers and devlogs', url: 'https://youtube.com/@...' },
  // { name: 'Website', note: 'News and updates', url: 'https://...' },
];
// Your tip page (Ko-fi, Patreon...), e.g. 'https://ko-fi.com/yourname'. Shows "Support the game" on the
// title screen, in About the game and on the community page. Empty hides it.
const SUPPORT_URL = 'https://patricksafari840.itch.io/eleven-seals';
const ABOUT_TEXT = [
  'The Eleven Seals is a text adventure on a hand-drawn hex map. Pick one of eleven kingdoms, each with its own people, monsters and legends, and travel a world where the ink of an old empire spilled and brought every people’s fears to life.',
  'Fight in turn-based battles, trade in cities, read the lore stones, break the cracking Seals, and find out what waits in the white heart of the map.',
  'Made by Patrick Safari. Pictures painted with GPT Image 2.5 on Higgsfield and Gemini; game written in plain JavaScript.',
];
