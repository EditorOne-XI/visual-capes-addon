/****************************************************************************************************\
| Visual Capes Add-on Extension Script
| - by EditorOne5312 | EditorOne XI - All rights reserved.
|   $ Youtube: EditorOne XI
|   $ Reddit: u/EditorOneXI
|   $ GitHub: EditorOne-XI
|   $ Modbay: EditorOne XI
|   $ MCPEDL: EditorOne (Legacy Versions)
| > IF DOWNLOADED FROM ANOTHER SITE BESIDES MY SOURCES, REPORT THE SITE IMMEDIATELY! (Indirectly to me)
\****************************************************************************************************/
import { raritySystem } from '../config.js';
import { customCapeTemplates } from '../custom_capes.js';
import { EntityDamageCause, GameMode } from '@minecraft/server';

/**
  * @callback rawtextLang
  * @param {string} string
  * @param {any[]} [values]
  */
/**
  * @callback rawtextString
  * @param {string} string
  */
const rawtext = {
  /** @type {rawtextLang} */
  lang: (string, values) => {
    return {
      translate: string ?? "lang.notfound",
      with: values ?? []
    };
  },
  /** @type {rawtextLang} */
  score: (name, objective) => {
    if (!objective) {
      console.error("No objective passed from arguments in rawtext.score()");
      return { text: "undefined" };
    }
    return { score: {
      name: name ?? "*",
      objective: objective
    }};
  },
  /** @type {rawtextString} */
  text: (string) => {
    return { text: string ?? "nullString" };
  },
  format: (/** @type {(import('@minecraft/server').RawMessage)[]} */ array) => {
    return { rawtext: array ?? [] };
  }
};

/**
 * @typedef {Object} CapeData
 * @property {string} icon - The texture file path for the cape icon.
 * @property {string} name - The display name of the cape.
 * @property {string} type - The asset identifier type.
 * @property {number} rarity_value - The numeric rarity ranking (0-4).
 * @property {'vanilla' | 'custom' | 'apf'} classification - The specific category classification.
 * @property {boolean} [template] - Optional flag designating a base layout preset.
 */
class Cape {
  static #totalCapes = 0;
  static #allList = [];
  /**
   * @param {CapeData} item
   */
  constructor(item) {
    Object.assign(this, item);
    if (item.rarity_value < 5) Cape.#addTotal(item);
  }
  static get totalCapes() {
    return this.#totalCapes;
  }
  static get allList() {
    return this.#allList;
  }
  static get collector() {
    return "vca-clctr";
  }
  static #addTotal(item) {
    this.#allList.push(item);
    this.#totalCapes++;
  }
  static addCollection(items) {
    for (const item of items) {
      if (!(item instanceof Cape)) continue;
      this.#allList.push(item);
    }
  }
}

class VanillaCape extends Cape {
  static #count = 0;
  static #list = [];
  constructor(item) {
    super(item);
  }
  static menuText(count) {
    return rawtext.lang(
      `vcascript.form.capes.vanilla${raritySystem.enabled ? ".rarity" : ''}`,
      [`${count}`]
    );
  }
  static get count() {
    return this.#count;
  }
  static add(item) {
    this.#list.push(item);
    this.#count++;
  }
  static get list() {
    return this.#list;
  }
}

class CustomCape extends Cape {
  static #count = 0;
  static #list = [];
  static #tempList = [];
  constructor(item) {
    super(item);
  }
  static menuText(count, preset) {
    const customDesc = preset ? "Preset" : "Template";
    return rawtext.lang(
      `vcascript.form.capes.custom${customDesc}${raritySystem.enabled ? ".rarity" : ''}`,
      [`${count}`]
    );
  }
  static get count() {
    return this.#count;
  }
  static add(item, isTemplate) {
    if (isTemplate) this.#tempList.push(item);
    else this.#list.push(item);
    this.#count++;
  }
  static get list() {
    return this.#list;
  }
  static get tempList() {
    return this.#tempList;
  }
  static getAllLists() {
    return [...CustomCape.list, ...CustomCape.tempList];
  }
}

class AprilFoolsCape extends Cape {
  static #count = 0;
  static #list = [];
  constructor(item) {
    super(item);
  }
  static menuText(count) {
    return rawtext.lang(
      `vcascript.form.capes.aprilFools${raritySystem.enabled ? ".rarity" : ''}`,
      [`${count}`]
    );
  }
  static get count() {
    return this.#count;
  }
  static add(item) {
    this.#list.push(item);
    this.#count++;
  }
  static get list() {
    return this.#list;
  }
}

class TheImmortalCape extends Cape {
  static #items;
  constructor(item) {
    super(item); 
  }
  static setup() {
    this.#items = {
      turnaround: new this(theImmortals.turnaround),
      eclipse: new this(theImmortals.eclipse),
      thunderstorm: new this(theImmortals.thunderstorm)
    };
    Cape.addCollection([this.#items.turnaround, this.#items.eclipse, this.#items.thunderstorm]);
  }
  static get turnaround() {
    return this.#items.turnaround;
  }
  static get eclipse() {
    return this.#items.eclipse;
  }
  static get thunderstorm() {
    return this.#items.thunderstorm;
  }
}

class CapeRegister {
  constructor(args) {
    if (Array.isArray(args)) {
      for (let arg of args) {
        if (this.isValidCape(arg)) {
          this.#classifyCape(arg);
        } else {
          console.error(`Invalid cape format: ${arg.name}`);
          continue;
        }
      }
    } else if (this.isValidCape(args)) {
      this.#classifyCape(args);
    } else {
      console.error(`Invalid cape format: ${args.name}`);
      return;
    }
  }
  #classifyCape(arg) {
    switch (arg.classification) {
      case 'vanilla':
        VanillaCape.add(new VanillaCape(arg));
        break;
      case 'custom':
        if (arg.template) {
          CustomCape.add(arg, arg.template);
        } else {
          CustomCape.add(new CustomCape(arg), false);
        }
        break;
      case 'apf':
        AprilFoolsCape.add(new AprilFoolsCape(arg));
        break;
      default:
        console.error(`Unknown classification: ${arg.classification}`);
    }
  }
  isValidCape(item) {
    if (item.classification && typeof item.classification === "string") {
      const classification = item.classification.toLowerCase();
      if (classification === 'vanilla') {
        return this.validateVanillaCape(item);
      } else if (classification === 'custom') {
        return this.validateCustomCape(item);
      } else if (classification === 'apf') {
        return this.validateApfCape(item);
      }
    }
    return false;
  }
  validateVanillaCape(cape) {
    const filepathPattern = /^(\/?[^<>:"|?*]+\/?)+$/;
    const typePattern = /^[a-z0-9_\-:]+$/;
    return (
      cape && typeof cape === "object" &&
      cape.icon && typeof cape.icon === "string" && filepathPattern.test(cape.icon) &&
      cape.name && typeof cape.name === "string" &&
      cape.type && typeof cape.type === "string" && typePattern.test(cape.type.toLowerCase()) &&
      cape.rarity_value !== undefined && typeof cape.rarity_value === "number" &&
      cape.rarity_value >= 0 && cape.rarity_value <= 4
    )
  }
  validateCustomCape(cape) {
    return (
      this.validateVanillaCape(cape) &&
      typeof cape.template === "boolean"
    )
  }
  validateApfCape(cape) {
    return this.validateVanillaCape(cape);
  }
}

new CapeRegister(customCapeTemplates ?? []);
new CapeRegister([
  {
    // v2.0.0
    icon: 'textures/capes/+custom/CreeperCape-icon',
    name: 'Creeper Cape',
    type: 'customcapes:creeper15_cape',
    rarity_value: 1,
    classification: 'custom',
    template: false
  },
  {
    // v2.0.0
    icon: 'textures/capes/+custom/RedstoneCape-icon',
    name: 'Redstone Cape',
    type: 'customcapes:redstone15_cape',
    rarity_value: 1,
    classification: 'custom',
    template: false
  },
  {
    // v2.0.0
    icon: 'textures/capes/+custom/EnderdragonCape-icon',
    name: 'Ender Dragon Cape',
    type: 'customcapes:enderdragon15_cape',
    rarity_value: 3,
    classification: 'custom',
    template: false
  },
  {
    // v2.0.0
    icon: 'textures/capes/+custom/EvokerCape-icon',
    name: 'Evoker Cape',
    type: 'customcapes:evoker15_cape',
    rarity_value: 1,
    classification: 'custom',
    template: false
  },
  {
    // v2.0.0
    icon: 'textures/capes/+custom/SheepCape-icon',
    name: 'Sheep Colored-Cape',
    type: 'customcapes:pinksheep15_cape',
    rarity_value: 1,
    classification: 'custom',
    template: false
  },
  {
    // v2.0.0
    icon: 'textures/capes/+custom/DolphinCape-icon',
    name: 'Dolphin Cape',
    type: 'customcapes:dolphin15_cape',
    rarity_value: 1,
    classification: 'custom',
    template: false
  },
  {
    // v2.0.0
    icon: 'textures/capes/+custom/PandaCape-icon',
    name: 'Panda Cape',
    type: 'customcapes:panda15_cape',
    rarity_value: 1,
    classification: 'custom',
    template: false
  },
  {
    // v2.0.0
    icon: 'textures/capes/+custom/VillagerCape-icon',
    name: 'Villager Cape',
    type: 'customcapes:villager15_cape',
    rarity_value: 1,
    classification: 'custom',
    template: false
  },
  {
    // v2.0.0
    icon: 'textures/capes/+custom/BeeCape-icon',
    name: 'Bee Cape',
    type: 'customcapes:bee15_cape',
    rarity_value: 1,
    classification: 'custom',
    template: false
  },
  {
    // v2.0.0
    icon: 'textures/capes/+custom/PiglinBruteCape-icon',
    name: 'Piglin Brute Cape',
    type: 'customcapes:piglinbrute15_cape',
    rarity_value: 1,
    classification: 'custom',
    template: false
  },
  {
    // v2.0.0
    icon: 'textures/capes/+custom/AxolotlCape-icon',
    name: 'Axolotl Cape',
    type: 'customcapes:axolotl15_cape',
    rarity_value: 1,
    classification: 'custom',
    template: false
  },
  {
    // v2.0.0
    icon: 'textures/capes/+custom/DeepslateCape-icon',
    name: 'Deepslate Block Cape',
    type: 'customcapes:deepslate15_cape',
    rarity_value: 1,
    classification: 'custom',
    template: false
  },
  {
    // v2.0.0
    icon: 'textures/capes/+custom/FrogCape-icon',
    name: 'Frog Cape',
    type: 'customcapes:frog15_cape',
    rarity_value: 1,
    classification: 'custom',
    template: false
  },
  {
    // v2.0.0
    icon: 'textures/capes/+custom/CamelCape-icon',
    name: 'Camel Cape',
    type: 'customcapes:camel15_cape',
    rarity_value: 1,
    classification: 'custom',
    template: false
  },
  {
    // v2.0.0
    icon: 'textures/capes/+custom/BreezeCape-icon',
    name: 'Breeze Cape',
    type: 'customcapes:breeze15_cape',
    rarity_value: 1,
    classification: 'custom',
    template: false
  },
  {
    // v2.1.0
    icon: 'textures/capes/+custom/NetherStarCape-icon',
    name: 'Nether Star Withered Cape',
    type: 'customcapes:netherstar_cape',
    rarity_value: 4,
    classification: 'custom',
    template: false
  }
]);
new CapeRegister([
  {
    // v2.0.0
    icon: 'textures/capes/+aprilfools/Awesom',
    name: 'Awesom Caep',
    type: 'aprilfoolscape:awesom',
    rarity_value: 0,
    classification: 'apf'
  },
  {
    // v2.0.0
    icon: 'textures/capes/+aprilfools/Blonk',
    name: 'Blonk Caep',
    type: 'aprilfoolscape:blonk',
    rarity_value: 0,
    classification: 'apf'
  },
  {
    // v2.0.0
    icon: 'textures/capes/+aprilfools/No_circle',
    name: 'No Circle Caep',
    type: 'aprilfoolscape:no_circle',
    rarity_value: 0,
    classification: 'apf'
  },
  {
    // v2.0.0
    icon: 'textures/capes/+aprilfools/Nyan',
    name: 'Nyan Caep',
    type: 'aprilfoolscape:nyan',
    rarity_value: 0,
    classification: 'apf'
  },
  {
    // v2.0.0
    icon: 'textures/capes/+aprilfools/Squid',
    name: 'Squid Caep',
    type: 'aprilfoolscape:squid',
    rarity_value: 0,
    classification: 'apf'
  },
  {
    // v2.0.0
    icon: 'textures/capes/+aprilfools/Veterinarian',
    name: 'Veterinarian Caep',
    type: 'aprilfoolscape:veterinarian',
    rarity_value: 0,
    classification: 'apf'
  }
]);
new CapeRegister([
  {
    icon: 'textures/capes/pan/icon',
    name: 'Pan Cape',
    type: 'capes:pan_cape',
    rarity_value: 0,
    classification: 'vanilla'
  },
  {
    icon: 'textures/capes/microsoft/icon',
    name: 'Migrator Cape',
    type: 'capes:migrator_cape',
    rarity_value: 2,
    classification: 'vanilla'
  },
  {
    // v1.1.0
    icon: 'textures/capes/vanilla/icon',
    name: 'One Vanilla Cape',
    type: 'capes:vanilla_cape',
    rarity_value: 3,
    classification: 'vanilla'
  },
  {
    // v2.1.0
    icon: 'textures/capes/mcCommon/icon',
    name: 'Common Cape',
    type: 'capes:mc_common_cape',
    rarity_value: 0,
    classification: 'vanilla'
  },
  {
    icon: 'textures/capes/founder/icon',
    name: 'Founder\'s Cape',
    type: 'capes:founder_cape',
    rarity_value: 2,
    classification: 'vanilla'
  },
  {
    // v2.0.0
    icon: 'textures/capes/progressPride/icon',
    name: 'Progress Pride Cape',
    type: 'capes:progress_pride_cape',
    rarity_value: 2,
    classification: 'vanilla'
  },
  {
    // v2.0.0
    icon: 'textures/capes/cherry/icon',
    name: 'Cherry Cape',
    type: 'capes:cherry_cape',
    rarity_value: 1,
    classification: 'vanilla'
  },
  {
    // v2.0.0
    icon: 'textures/capes/tiktok/icon',
    name: 'Follower\'s Cape',
    type: 'capes:tiktok_cape',
    rarity_value: 2,
    classification: 'vanilla'
  },
  {
    // v2.0.0
    icon: 'textures/capes/twitch/icon',
    name: 'Purple Heart Cape',
    type: 'capes:twitch_cape',
    rarity_value: 2,
    classification: 'vanilla'
  },
  {
    // v2.0.0
    icon: 'textures/capes/15thYear/icon',
    name: '15-Year Anniversary Cape',
    type: 'capes:fifteenth_year_cape',
    rarity_value: 1,
    classification: 'vanilla'
  },
  {
    // v2.1.0
    icon: 'textures/capes/mcc15/icon',
    name: 'MCC 15th Year Cape',
    type: 'capes:mcc_15th_year_cape',
    rarity_value: 4,
    classification: 'vanilla'
  },
  {
    // v2.1.0
    icon: 'textures/capes/mojangOffice/icon',
    name: 'Mojang Office Cape',
    type: 'capes:mojang_office_cape',
    rarity_value: 3,
    classification: 'vanilla'
  },
  {
    // v2.1.0
    icon: 'textures/capes/home/icon',
    name: 'Home Cape',
    type: 'capes:mcmovie_home_cape',
    rarity_value: 2,
    classification: 'vanilla'
  },
  {
    // v2.1.0
    icon: 'textures/capes/menace/icon',
    name: 'Menace Cape',
    type: 'capes:mcmovie_menace_cape',
    rarity_value: 2,
    classification: 'vanilla'
  },
  {
    // v2.1.0
    icon: 'textures/capes/yearn/icon',
    name: 'Yearn Cape',
    type: 'capes:mcmovie_yearn_cape',
    rarity_value: 3,
    classification: 'vanilla'
  },
  {
    // v2.5.0
    icon: 'textures/capes/copper/icon',
    name: 'Copper Cape',
    type: 'capes:copper_cape',
    rarity_value: 1,
    classification: 'vanilla'
  },
  {
    // v2.5.0
    icon: 'textures/capes/zombieHorse/icon',
    name: 'Zombie Horse Cape',
    type: 'capes:zombie_horse_cape',
    rarity_value: 2,
    classification: 'vanilla'
  },
  {
    // v2.6.0
    icon: 'textures/capes/builder/icon',
    name: 'Builder Cape',
    type: 'capes:builder_cape',
    rarity_value: 2,
    classification: 'vanilla'
  },
  {
    icon: 'textures/capes/minecon2011/icon',
    name: 'MINECON 2011 Cape',
    type: 'capes:minecon2011_cape',
    rarity_value: 2,
    classification: 'vanilla'
  },
  {
    icon: 'textures/capes/minecon2012/icon',
    name: 'MINECON 2012 Cape',
    type: 'capes:minecon2012_cape',
    rarity_value: 2,
    classification: 'vanilla'
  },
  {
    icon: 'textures/capes/minecon2013/icon',
    name: 'MINECON 2013 Cape',
    type: 'capes:minecon2013_cape',
    rarity_value: 2,
    classification: 'vanilla'
  },
  {
    icon: 'textures/capes/minecon2015/icon',
    name: 'MINECON 2015 Cape',
    type: 'capes:minecon2015_cape',
    rarity_value: 2,
    classification: 'vanilla'
  },
  {
    icon: 'textures/capes/minecon2016/icon',
    name: 'MINECON 2016 Cape',
    type: 'capes:minecon2016_cape',
    rarity_value: 2,
    classification: 'vanilla'
  },
  {
    // v2.1.0
    icon: 'textures/capes/mcExperience/icon',
    name: 'Minecraft Experience Cape',
    type: 'capes:mc_experience_cape',
    rarity_value: 4,
    classification: 'vanilla'
  },
  {
    // v2.6.0
    icon: 'textures/capes/moonlightTrail/icon',
    name: 'Moonlight Trail Cape',
    type: 'capes:moonlight_trail_cape',
    rarity_value: 4,
    classification: 'vanilla'
  },
  {
    // v2.6.0
    icon: 'textures/capes/crafter/icon',
    name: 'Crafter Cape',
    type: 'capes:crafter_cape',
    rarity_value: 4,
    classification: 'vanilla'
  },
  {
    icon: 'textures/capes/crowdinTranslator/icon',
    name: 'Translator Cape',
    type: 'capes:translator_cape',
    rarity_value: 3,
    classification: 'vanilla'
  },
  {
    icon: 'textures/capes/chineseTranslator/icon',
    name: 'Chinese Translator Cape',
    type: 'capes:cn_translator_cape',
    rarity_value: 3,
    classification: 'vanilla'
  },
  {
    icon: 'textures/capes/bugTracker/icon',
    name: 'Mojira Moderator Cape',
    type: 'capes:moderator_cape',
    rarity_value: 3,
    classification: 'vanilla'
  },
  {
    icon: 'textures/capes/mapmaker/icon',
    name: 'Realms Mapmaker Cape',
    type: 'capes:mapmaker_cape',
    rarity_value: 3,
    classification: 'vanilla'
  },
  {
    icon: 'textures/capes/scrolls/icon',
    name: 'Scrolls Champion Cape',
    type: 'capes:scrolls_champion_cape',
    rarity_value: 4,
    classification: 'vanilla'
  },
  {
    icon: 'textures/capes/cobalt/icon',
    name: 'Cobalt Cape',
    type: 'capes:cobalt_cape',
    rarity_value: 4,
    classification: 'vanilla'
  },
  {
    icon: 'textures/capes/bacon/icon',
    name: 'Bacon Cape',
    type: 'capes:bacon_cape',
    rarity_value: 4,
    classification: 'vanilla'
  },
  {
    icon: 'textures/capes/millionth/icon',
    name: 'Millionth Customer Cape',
    type: 'capes:millionthsale_cape',
    rarity_value: 4,
    classification: 'vanilla'
  },
  {
    icon: 'textures/capes/dannyBstyle/icon',
    name: 'dannyBstyle\'s Cape',
    type: 'capes:dannybstyle_cape',
    rarity_value: 4,
    classification: 'vanilla'
  },
  {
    icon: 'textures/capes/snowman/icon',
    name: 'Snowman Cape',
    type: 'capes:snowman_cape',
    rarity_value: 3,
    classification: 'vanilla'
  },
  {
    icon: 'textures/capes/cheapsh0t/icon',
    name: 'cheapsh0t\'s Cape',
    type: 'capes:cheapsh0t_cape',
    rarity_value: 3,
    classification: 'vanilla'
  },
  {
    icon: 'textures/capes/spade/icon',
    name: 'Spade Cape',
    type: 'capes:spade_cape',
    rarity_value: 4,
    classification: 'vanilla'
  },
  {
    icon: 'textures/capes/prismarine/icon',
    name: 'Prismarine Cape',
    type: 'capes:prismarine_cape',
    rarity_value: 4,
    classification: 'vanilla'
  },
  {
    icon: 'textures/capes/turtle/icon',
    name: 'Turtle Cape',
    type: 'capes:turtle_cape',
    rarity_value: 3,
    classification: 'vanilla'
  },
  {
    icon: 'textures/capes/party/icon',
    name: 'Birthday Cape',
    type: 'capes:birthday_cape',
    rarity_value: 3,
    classification: 'vanilla'
  },
  {
    icon: 'textures/capes/valentine/icon',
    name: 'Valentine Cape',
    type: 'capes:valentine_cape',
    rarity_value: 4,
    classification: 'vanilla'
  },
  {
    // v2.1.0
    icon: 'textures/capes/oxeye/icon',
    name: 'Oxeye Cape',
    type: 'capes:oxeye_cape',
    rarity_value: 4,
    classification: 'vanilla'
  },
  {
    // v2.5.0
    icon: 'textures/capes/blueprint/icon',
    name: 'Blueprint Cape',
    type: 'capes:blueprint_cape',
    rarity_value: 3,
    classification: 'vanilla'
  },
  {
    icon: 'textures/capes/mojangClassic/icon',
    name: 'Mojang Cape [Classic]',
    type: 'capes:mojang_cape1',
    rarity_value: 4,
    classification: 'vanilla'
  },
  {
    // v1.1.0
    icon: 'textures/capes/microsoftXbox360/icon',
    name: 'Microsoft Xbox 360 Cape',
    type: 'capes:xbox360_cape',
    rarity_value: 4,
    classification: 'vanilla'
  },
  {
    // v2.6.0
    icon: 'textures/capes/fjstudios/icon',
    name: '4J Studios Cape',
    type: 'capes:fj_studios_cape',
    rarity_value: 3,
    classification: 'vanilla'
  },
  {
    icon: 'textures/capes/mojang/icon',
    name: 'Mojang Cape',
    type: 'capes:mojang_cape2',
    rarity_value: 4,
    classification: 'vanilla'
  },
  {
    icon: 'textures/capes/mojangStudios/icon',
    name: 'Mojang Studios Cape',
    type: 'capes:mojang_studios_cape',
    rarity_value: 4,
    classification: 'vanilla'
  },
  {
    // v1.1.0
    icon: 'textures/capes/christmas/icon',
    name: 'Christmas 2010 Cape',
    type: 'capes:christmas2010_cape',
    rarity_value: 3,
    classification: 'vanilla'
  },
  {
    // v1.1.0
    icon: 'textures/capes/newyear/icon',
    name: 'New Year 2011 Cape',
    type: 'capes:ny2011_cape',
    rarity_value: 3,
    classification: 'vanilla'
  },
  {
    // v2.0.0
    icon: 'textures/capes/xbox360FirstBirthday/icon',
    name: '1st Birthday Cape',
    type: 'capes:xbox360_1st_birthday_cape',
    rarity_value: 3,
    classification: 'vanilla'
  }
]);

// v2.1.0 ... v2.6.0
const theImmortals = {
  turnaround: {
    icon: 'textures/capes/turnaround/icon',
    name: 'God Cape',
    type: 'specialvca:deity1',
    rarity_value: 5,
    classification: 'vanilla',
    buffsText: [
      "x256 Resistance",
      "x1 Instant Breaking (Custom Buff)",
      "x1 Crystal Pop (Custom Buff)",
      "x1 Ender Poison (Custom Debuff)"
    ]
  },
  eclipse: {
    icon: 'textures/capes/eclipse/icon',
    name: 'Void Cape',
    type: 'specialvca:deity0',
    rarity_value: 5,
    classification: 'vanilla',
    buffsText: [
      "x256 Strength",
      "x1 Void Terminate (Custom Buff)",
      "x1 Quantum Portal (Custom Buff)",
      "x1 Amputation (Custom Debuff)"
    ]
  },
  thunderstorm: {
    icon: 'textures/capes/thunderstorm/icon',
    name: 'Thunderstorm Cape',
    type: 'specialvca:deity2',
    rarity_value: 5,
    classification: 'vanilla',
    buffsText: [
      "x256 Fire Resistance",
      "x1 Heaven's Beam (Custom Buff)",
      "x1 Thunder Crisis (Custom Buff)",
      "x1 Amputation (Custom Debuff)"
    ]
  }
};

const permissionSwitch = {
  canceledMenu: "vcaCanceled",
  op: "OuSrIuiARAtvoors",
  achievement: {
    starter: "Cape Spirit!",
    first_rarity: "Cape into Cloak",
    first_legendary: "Cape Master?",
    rarity_collector: "Prismatic",
    cape_collector: "Cape Collector!",
    first_buff: "Magic Transcendence",
    all_buffs: "Wizard Material",
    sacrifice: "Sometimes I felt life low.",
    deity_weakness: "Gods are Immortal. We are not.",
    deity_fall: "Impeached"
  },
  achievementRST: [
    "all_buffs",
    "deity_fall",
    "deity_weakness",
    "first_buff",
    "sacrifice"
  ],
  rarity: {
    uncommon: "0sOUAemsElSapCMS",
    rare: "0aSECRaAuScrAsAR",
    epic: "0EpVCcCll0lcPPps",
    legendary: "0SDYDUggEalAelEG",
    deity: "0AJdLuKcNAFPIAAw"
  },
  legendaryTag: "legendaryCape",
  startup: "startup",
  skipStartup: "skip_vcstu"
};

// Used for rarity logic :)
const rarityNames = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Deity"];

const vcaProperties = {
  alwaysThunder: "vca:thc",
  capeCollector: "vca:CCT",
  damageState: "vca:fatal",
  damageStateDays: "vca:ftlDay",
  dayIn: "vca:dayStart",
  scriptCheck: "vca:scrChk",
  settings: "vca:sttngs"
};

const creativeBlocks = [
  "minecraft:allow",
  "minecraft:barrier",
  "minecraft:border_block",
  "minecraft:chain_command_block",
  "minecraft:command_block",
  "minecraft:deny",
  "minecraft:jigsaw",
  "minecraft:light_block_0",
  "minecraft:light_block_1",
  "minecraft:light_block_10",
  "minecraft:light_block_11",
  "minecraft:light_block_12",
  "minecraft:light_block_13",
  "minecraft:light_block_14",
  "minecraft:light_block_15",
  "minecraft:light_block_2",
  "minecraft:light_block_3",
  "minecraft:light_block_4",
  "minecraft:light_block_5",
  "minecraft:light_block_6",
  "minecraft:light_block_7",
  "minecraft:light_block_8",
  "minecraft:light_block_9",
  "minecraft:piston_arm_collision",
  "minecraft:repeating_command_block",
  "minecraft:sticky_piston_arm_collision",
  "minecraft:structure_block",
  "minecraft:structure_void"
];

const damageCauseByTick = [
  EntityDamageCause.campfire,
  EntityDamageCause.contact,
  EntityDamageCause.drowning,
  EntityDamageCause.fireTick,
  EntityDamageCause.lava,
  EntityDamageCause.magic,
  EntityDamageCause.magma,
  EntityDamageCause.selfDestruct,
  EntityDamageCause.soulCampfire,
  EntityDamageCause.suffocation,
  EntityDamageCause.temperature,
  EntityDamageCause.void,
  EntityDamageCause.wither
];

const endEntities = [
  "minecraft:area_effect_cloud",
  "minecraft:dragon_fireball",
  "minecraft:ender_crystal",
  "minecraft:ender_dragon",
  "minecraft:enderman",
  "minecraft:endermite",
  "minecraft:shulker",
  "minecraft:shulker_bullet"
];

const itemsToRarity = [
  "minecraft:experience_bottle",
  "minecraft:golden_apple",
  "minecraft:enchanted_golden_apple"
];

const notGameModes = [
  GameMode.Creative,
  GameMode.Spectator
];

const portalBlocks = [
  "minecraft:end_gateway",
  "minecraft:end_portal",
  "minecraft:portal"
];

const vanillaProjectiles = [
  "minecraft:arrow",
  "minecraft:breeze_wind_charge_projectile",
  "minecraft:dragon_fireball",
  "minecraft:egg",
  "minecraft:ender_pearl",
  "minecraft:eye_of_ender_signal",
  "minecraft:fireworks_rocket",
  "minecraft:ice_bomb",
  "minecraft:large_fireball",
  "minecraft:lingering_potion",
  "minecraft:llama_spit",
  "minecraft:shulker_bullet",
  "minecraft:small_fireball",
  "minecraft:snowball",
  "minecraft:splash_potion",
  "minecraft:thrown_trident",
  "minecraft:wind_charge_projectile",
  "minecraft:wither_skull",
  "minecraft:wither_skull_dangerous",
  "minecraft:xp_bottle"
];

const addonName = "§9Visual Capes §bAdd-on§r";
const formText = {
  addonName: `§f[${addonName}§f]§r`,
  startup: rawtext.format([
    rawtext.lang("vcascript.form.startup1", [addonName]),
    rawtext.text('\n'),
    rawtext.lang("vcascript.form.startup2", ["More Info"])
  ]),
  canceledNote: rawtext.format([
    rawtext.lang("vcascript.form.cancellation1", [`${Cape.totalCapes - CustomCape.tempList.length}`]),
    rawtext.text('\n'),
    rawtext.lang("vcascript.form.cancellation2"),
    rawtext.text(raritySystem.survival_tweaks ? ' ' : ''),
    rawtext.lang(raritySystem.survival_tweaks ? "vcascript.form.cancellation3" : ''),
    rawtext.text("\n\n("),
    rawtext.lang("vcascript.form.cancellation4"),
    rawtext.text(")")
  ]),
  starterCapes: rawtext.format([
    rawtext.lang("vcascript.form.startercapes1"),
    rawtext.text("\n\n"),
    rawtext.lang("vcascript.form.startercapes2", ["None"])
  ]),
  visualCapesMenu: (extend) => rawtext.format([
    rawtext.lang("vcascript.form.menu"),
    ...extend
  ]),
  visualCapesMenuDefault: rawtext.lang("vcascript.form.menudefault", ["Remove Cape"]),
  visualCapesMenuOperator: rawtext.format([
    rawtext.lang("vcascript.form.menuoperator"), rawtext.text("\n\n§aCapes List:§r "),
    rawtext.lang("vcascript.form.menuoperator.capes"), rawtext.text("\n§eRarity Access:§r "),
    rawtext.lang("vcascript.form.menuoperator.rarity")
  ]),
  visualCapesMopCapesList: rawtext.format([
    rawtext.lang("vcascript.form.menuoperator.classification1", ["Remove Cape"]),
    rawtext.text("§7("),
    rawtext.lang("vcascript.form.menuoperator.classification2"),
    rawtext.text(")")
  ]),
  visualCapesMopListSort: rawtext.lang("vcascript.form.menuoperator.sort", ["Default"]),
  capeLockedAll: rawtext.lang("vcascript.form.menuoperator.locked"),
  buffReward: `Buff Indicators:§7
'+' - Legendary Exclusive Buff.
[#] - Amplifier Max Level.
[C] - Custom Buffs.§r`,
  buffAmplifier: rawtext.format([
    rawtext.text('§7'),
    rawtext.lang("vcascript.form.buffamplifier", ["3"]),
    rawtext.text('\n'),
    rawtext.lang("vcascript.form.buffamplifier.custombuffs"),
    rawtext.text('§r')
  ]),
  storedBuff: rawtext.format([
    rawtext.lang("vcascript.form.storedbuffs1"),
    rawtext.text("\n§7"),
    rawtext.lang("vcascript.form.storedbuffs2"),
    rawtext.text(' ')
  ]),
  achievementDescription: rawtext.lang("vcascript.form.achievement.description"),
  settingDescription: rawtext.format([
    rawtext.lang("vcascript.form.config.description1"),
    rawtext.text('\n'),
    rawtext.lang("vcascript.form.config.description2")
  ]),
  settingScriptCheck: rawtext.format([
    rawtext.text('§c'),
    rawtext.lang("vcascript.form.config.scriptCheck1"),
    rawtext.text("§r\n"),
    rawtext.lang("vcascript.form.config.scriptCheck2")
  ]),
  settingCapeCollector: rawtext.lang("vcascript.form.config.capeCollector"),
  settingDamageState: rawtext.format([
    rawtext.lang("vcascript.form.rarityconfig.damage1", ["30"]),
    rawtext.text("§g\n- "),
    rawtext.lang("vcascript.form.rarityconfig.damage2"),
    rawtext.text("\n- "),
    rawtext.lang("vcascript.form.rarityconfig.damage3"),
    rawtext.text("§7\n"),
    rawtext.lang("vcascript.form.rarityconfig.damage4", ["(currentDay / amp)"]),
    rawtext.text('\n'),
    rawtext.lang("vcascript.form.rarityconfig.damage5", ["10"])
  ]),
  settingDamageAmplifier: rawtext.format([
    rawtext.lang("vcascript.form.rarityconfig.damageAmp1"),
    rawtext.text("§7"),
    rawtext.lang("vcascript.form.rarityconfig.damageAmp2", ["amp",`
e.g. currentDay / amp = +# Damage
currentDay = 100
amp = 10
100 / 10 = +10 Damage`
    ])
  ]),
  giftUnlocked: rawtext.lang("vcascript.form.gift.unlocked", [`§l§c${rarityNames[5]}§r`]),
  buffHidden: rawtext.format([
    rawtext.text('('),rawtext.lang("vcascript.form.gift.hiddenbuffs"),rawtext.text(')')
  ]),
};

const buttonText = {
  accept: rawtext.lang("gui.accept"),
  apply: rawtext.lang("options.dev_apply"),
  back: rawtext.lang("gui.back"),
  cancel: rawtext.lang("gui.cancel"),
  decline: rawtext.lang("gui.decline"),
  edit: rawtext.lang("gui.edit"),
  equip: rawtext.lang("action.interact.armorstand.equip"),
  exit: rawtext.lang("gui.exit"),
  goBack: rawtext.lang("gui.goBack"),
  info: rawtext.lang("options.openPage.continue"),
  no: rawtext.lang("gui.no"),
  none: rawtext.lang("gui.none"),
  register: rawtext.lang("vcascript.form.button.register"),
  reject: rawtext.lang("vcascript.form.button.reject"),
  save: rawtext.lang("structure_block.save"),
  skip: rawtext.lang("gui.skip"),
  start: rawtext.lang("menu.start"),
  unequip: rawtext.lang("vcascript.form.button.unequip"),
  yes: rawtext.lang("gui.yes"),

  canceledTitle: rawtext.lang("vcascript.form.cancellation.title"),
  listEmptyTitle: rawtext.lang("vcascript.form.menuoperator.locked.title")
};

const messageText = {
  canceledMessage: rawtext.format([
    rawtext.text('§e'),
    rawtext.lang("vcascript.message.cancellation1"),
    rawtext.text(":\n§f/opcape restart_menu §7Optional: <target:player>§r\n§e"),
    rawtext.lang("vcascript.message.cancellation2"),
    rawtext.text('§r')
  ]),
  /**
   * @param {number | null} [xpb]
   * @param {number | null} [ga]
   * @param {number | null} [ega]
   */
  rewardInsufficient: (xpb, ga, ega) => {
    let formatRewIns = [
      rawtext.text("§c"),
      rawtext.lang("vcascript.message.reward.insufficient"),
      rawtext.text(" \n§6"),
      rawtext.text(`${xpb} `), 
      rawtext.lang("item.experience_bottle.name")
    ];
    if (ga) {
      formatRewIns.push(rawtext.text(`\n${ga} `));
      formatRewIns.push(rawtext.lang("item.golden_apple.name"));
    }
    if (ega) {
      formatRewIns.push(rawtext.text(`\n${ega} `));
      formatRewIns.push(rawtext.lang("item.appleEnchanted.name"));
    }
    formatRewIns.push(rawtext.text("§r"));
    return rawtext.format(formatRewIns);
  },
  rewardMismatch: rawtext.format([
    rawtext.text("§c"),
    rawtext.lang("vcascript.message.reward.mismatch"),
    rawtext.text("§r")
  ]),
  rewardSuccess: rawtext.format([
    rawtext.text("§e"),
    rawtext.lang("vcascript.message.reward.success"),
    rawtext.text("§r")
  ])
};

const cmdPlayerOnly = "This command can be only executed by active players.";
const cmdPermissionDenied = (/** @type {string} */ cmdname) => `Incorrect permission level for command: ${cmdname}.`;

export {
  rawtext, Cape, VanillaCape, CustomCape, AprilFoolsCape, TheImmortalCape, permissionSwitch, rarityNames,
  vcaProperties, endEntities, creativeBlocks, damageCauseByTick, itemsToRarity, notGameModes, portalBlocks, vanillaProjectiles,
  formText, buttonText, messageText, cmdPlayerOnly, cmdPermissionDenied
};
console.log('"constants.js" loaded successfully.');
