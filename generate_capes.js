/************************************************************\
| Visual Capes Add-on Developer Script
| - First Version: v2.5.0
|
| NodeJS IS REQUIRED TO RUN THIS SCRIPT
| - Autocomplete Internal JSON Codes.
| - by EditorOne XI | EditorOne5312 * All rights reserved.
|   $ GitHub: EditorOne-XI
| > IF YOU HAVE THIS FILE, DELETE IMMEDIATELY :)
| > FOR DEVELOPMENT USE ONLY.
|
| Sequential Capes Update:
| 1) Added/Remove capes from:
|    > generate_capes.js (capes[])
|    > Constants.js (capes[])
|
| 2) Implement Game Textures:
|    > Blockbench Icon Screenshot and Edit
|    > Modify filepaths and place textures
|
| 3) Apply Textures' Code:
|    > generate_capes.js (br-vca)
|    > capes.ui (Capes Section)
|
| 4) Game Tests :D
|    > Run LOL
|
\************************************************************/
import { mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { dirname } from 'path';

// Later Versions should be v2 because v3 will
// only exist if something revolutionary changed
const version = "v2.6.0";

const savefiles = {
  BP:     "./bundle/VisualCapesBP/entities/player.json",
  BP_mcf: "./bundle/VisualCapesBP/functions",
  RP_p:   "./bundle/VisualCapesRP/subpacks/default/entity/player.entity.json",
  RP_e:   "./bundle/VisualCapesRP/attachables/elytra.json",
  RP_c:   "./bundle/VisualCapesRP/render_controllers/cape.render_controllers.json",
  RP_ce:  "./bundle/VisualCapesRP/render_controllers/elytra.render_controllers.json",
  BP_js:  "./bundle/VisualCapesBP/scripts/offset.js",
  Ext_js: "./bundle/VisualCapesExt/scripts/offset.js"
}


// -----------------------------------------------
//      BEHAVIOR PACK
// -----------------------------------------------

// Constants.js List Inputs

// Custom Template Capes (ctTp)
let customCapesList1 = [];
for (let i = 1; i <= 20; i++) {
  customCapesList1.push({
    icon: `textures/capes/+custom/_custom`,
    name: `Custom #${i}`,
    type: `customcapes:custom${i}`,
    rarity_value: 0,
    classification: 'custom',
    template: true
  });
}

// Custom Preset Capes (ctPr)
const customCapesList2 = [
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
  },
  {
    // v2.6.0
    icon: 'textures/capes/+custom/SulfurCubeCape-icon',
    name: 'Sulfur Cube Cape',
    type: 'customcapes:sulfurcube_cape',
    rarity_value: 2,
    classification: 'custom',
    template: false
  },
  {
    // v2.6.0
    icon: 'textures/capes/+custom/BedrockSulfurCubeCape-icon',
    name: 'Bedrock Sulfur Cube Cape',
    type: 'customcapes:brsulfurcube_cape',
    rarity_value: 3,
    classification: 'custom',
    template: false
  }
];

// April Fools Capes (apF)
const aprilFoolsCapeList = [
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
];

// Minecraft's Official Capes (vc)
const vanillaCapesList = [
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
];

// All Capes List
const capes = [
  ...customCapesList1,
  ...customCapesList2,
  ...aprilFoolsCapeList,
  ...vanillaCapesList
];

////// CAPES MARK VARIANT VALUES //////
// Global Calculation for MVs too
function capeMarkValues(increment) {
  let componentGroups = {};
  let eventNames = {};
  let rpArr = {
    vanillaT: [],
    aprilfoolsT: [],
    custom2T: [],
    custom1T: []
  };
  let _incr = increment ?? 0;
  let i = 0;
  let total = 0;
  let vc = 1 + _incr;
  let ctPr = 101 + _incr;
  let ctTp = -1 - _incr;
  let apF = 1001 + _incr;
  const nsRegExp = /capes:|aprilfoolscape:|customcapes:/g;
  for (let bp of capes) {
    let name = bp.type;
    let cstmCp;
    total++;
    let capeKey = name
      .replace(nsRegExp, '')
      .replace("custom", "custom_cape_slot");
    let textureKey = name.replace(nsRegExp, "Texture.");
    switch (bp.classification) {
      case 'vanilla':
        componentGroups[capeKey] = {
          "minecraft:mark_variant": {
            value: vc
          }
        }
        eventNames[name] = {
          add: {
            component_groups: [ capeKey ]
          }
        }
        rpArr.vanillaT.push(textureKey);
        vc++;
        break;
      case 'apf':
        componentGroups[capeKey] = {
          "minecraft:mark_variant": {
            value: apF
          }
        }
        eventNames[name] = {
          add: {
            component_groups: [ capeKey ]
          }
        }
        rpArr.aprilfoolsT.push(textureKey + "_cape");
        apF++;
        break;
      case 'custom':
        cstmCp = bp.template ? ctTp : ctPr;
        componentGroups[capeKey] = {
          "minecraft:mark_variant": {
            value: cstmCp
          }
        }
        eventNames[name] = {
          add: {
            component_groups: [ capeKey ]
          }
        }
        if (bp.template) {
          ctTp--;
          total--;
          rpArr.custom1T.push(textureKey.replace("custom", "custom_cape"));
        }
        else {
          ctPr++;
          rpArr.custom2T.push(textureKey);
        }
        break;
      default:
        console.error(`${name} is not registered.`);
        total--;
    }
    i++;
  }
  Object.assign(componentGroups, {
    idaho_cape: {
      "minecraft:mark_variant": {
        value: -999 - _incr
      }
    },
    god_cape: {
      "minecraft:mark_variant": {
        value: -1001 - _incr
      }
    },
    void_cape: {
      "minecraft:mark_variant": {
        value: -1000 - _incr
      }
    },
    thunderstorm_cape: {
      "minecraft:mark_variant": {
        value: -1002 - _incr
      }
    },
    remove_cape: {
      "minecraft:mark_variant": {
        value: 0
      }
    }
  });
  total += 4;
  Object.assign(eventNames, {
    "capes:idaho_cape": {
      "add": {
        "component_groups": [ "idaho_cape" ]
      }
    },
    "specialvca:deity1": {
      "add": {
        "component_groups": [ "god_cape" ]
      }
    },
    "specialvca:deity0": {
      "add": {
        "component_groups": [ "void_cape" ]
      }
    },
    "specialvca:deity2": {
      "add": {
        "component_groups": [ "thunderstorm_cape" ]
      }
    },
    "capes:remove_cape": {
      "add": {
        "component_groups": [ "remove_cape" ]
      }
    }
  });
  return {
    values: [ vc, apF, ctPr, ctTp ],
    components: componentGroups,
    events: eventNames,
    counts: [
      (vc - 1 - _incr),
      (apF - 1001 - _incr),
      (ctPr - 101 - _incr),
      Math.abs(ctTp + 1 + _incr)
    ],
    differences: [
      [(vc - (vc - 1 - _incr)), (vc - 1)],
      [(apF - (apF - 1001 - _incr)), (apF - 1)],
      [(ctPr - (ctPr - 101 - _incr)), (ctPr - 1)],
      [(ctTp + Math.abs(ctTp + 1 + _incr)), (ctTp + 1)]
    ],
    total,
    rpArr
  };
}

function playerBPMerge(increment) {
  const mainJSON = JSON.parse(readFileSync("./player.json", { encoding: 'utf8' }));
  if (!mainJSON) {
    console.error("File 'player.json' not found.");
    return false;
  }
  // Mojang is using beta as vanilla format_version?? 
  mainJSON["format_version"] = "1.26.30";
  let playerJSON = mainJSON["minecraft:entity"];
  let { components, events } = capeMarkValues(increment);
  Object.assign(playerJSON["component_groups"], components);
  Object.assign(playerJSON["events"], events);
  Object.assign(mainJSON["minecraft:entity"], playerJSON);
  try {
    mkdirSync(dirname(savefiles.BP), { recursive: true });
    writeFileSync(savefiles.BP, JSON.stringify(mainJSON, null, 2));
    console.log("Success! Saved as", savefiles.BP);
    return true;
  } catch (err) {
    console.error("Failed to write player.json to VisualCapesBP.");
    return false;
  }
}

function capeMCF() {
  let capeType;
  let fnCmd;
  try {
    for (let ncp of capes) {
      capeType = ncp.type;
      fnCmd = `event entity @s ${capeType}`;
      mkdirSync(`${savefiles.BP_mcf}/${capeType.replace(/:\S+/g, '')}`, { recursive: true });
      writeFileSync(`${savefiles.BP_mcf}/${capeType.replace(/:/g, '/')}.mcfunction`, fnCmd);
    }
    console.log("Created .mcfunction for all capes successfully! Saved in", savefiles.BP_mcf);
    return true;
  } catch (err) {
    console.error("An error encountered writing .mcfunction files:", err);
    return false;
  }
}


// -----------------------------------------------
//      Resource Pack
// -----------------------------------------------

function containsMatch(mainString, substrings) {
    return substrings.some(sub => mainString.includes(sub));
};

const capeNoElytra = [
  'default_elytra',
  'creeper15_cape',
  'redstone15_cape',
  'evoker15_cape',
  'pinksheep15_cape',
  'dolphin15_cape',
  'panda15_cape',
  'villager15_cape',
  'bee15_cape',
  'piglinbrute15_cape',
  'axolotl15_cape',
  'deepslate15_cape',
  'frog15_cape',
  'camel15_cape',
  'breeze15_cape',
  'awesom_cape',
  'blonk_cape',
  'no_circle_cape',
  'nyan_cape',
  'squid_cape',
  'veterinarian_cape',
  'bacon_cape',
  'xbox360_cape',
  'fj_studios_cape',
  'christmas2010_cape',
  'ny2011_cape',
  'xbox360_1st_birthday_cape'
];
// the padding is use as reference from the
// player.entity.json
const TEXTURES = {
        "default": "textures/entity/steve",
        "cape": "textures/entity/cape_invisible",

        "pan_cape": "textures/capes/pan/texture",
        "migrator_cape": "textures/capes/microsoft/texture",
        "vanilla_cape": "textures/capes/vanilla/texture",
        "mc_common_cape": "textures/capes/mcCommon/texture",
        "founder_cape": "textures/capes/founder/texture",
        "progress_pride_cape": "textures/capes/progressPride/texture",
        "cherry_cape": "textures/capes/cherry/texture",
        "tiktok_cape": "textures/capes/tiktok/texture",
        "twitch_cape": "textures/capes/twitch/texture",
        "fifteenth_year_cape": "textures/capes/15thYear/texture",
        "mcc_15th_year_cape": "textures/capes/mcc15/texture",
        "mojang_office_cape": "textures/capes/mojangOffice/texture",
        "mcmovie_home_cape": "textures/capes/home/texture",
        "mcmovie_menace_cape": "textures/capes/menace/texture",
        "mcmovie_yearn_cape": "textures/capes/yearn/texture",
        "copper_cape": "textures/capes/copper/texture",
        "zombie_horse_cape": "textures/capes/zombieHorse/texture",
        "builder_cape": "textures/capes/builder/texture",
        "minecon2011_cape": "textures/capes/minecon2011/texture",
        "minecon2012_cape": "textures/capes/minecon2012/texture",
        "minecon2013_cape": "textures/capes/minecon2013/texture",
        "minecon2015_cape": "textures/capes/minecon2015/texture",
        "minecon2016_cape": "textures/capes/minecon2016/texture",
        "mc_experience_cape": "textures/capes/mcExperience/texture",
        "moonlight_trail_cape": "textures/capes/moonlightTrail/texture",
        "crafter_cape": "textures/capes/crafter/texture",
        "translator_cape": "textures/capes/crowdinTranslator/texture",
        "cn_translator_cape": "textures/capes/chineseTranslator/texture",
        "moderator_cape": "textures/capes/bugTracker/texture",
        "mapmaker_cape": "textures/capes/mapmaker/texture",
        "scrolls_champion_cape": "textures/capes/scrolls/texture",
        "cobalt_cape": "textures/capes/cobalt/texture",
        "bacon_cape": "textures/capes/bacon/texture",
        "millionthsale_cape": "textures/capes/millionth/texture",
        "dannybstyle_cape": "textures/capes/dannyBstyle/texture",
        "snowman_cape": "textures/capes/snowman/texture",
        "cheapsh0t_cape": "textures/capes/cheapsh0t/texture",
        "spade_cape": "textures/capes/spade/texture",
        "prismarine_cape": "textures/capes/prismarine/texture",
        "turtle_cape": "textures/capes/turtle/texture",
        "birthday_cape": "textures/capes/party/texture",
        "valentine_cape": "textures/capes/valentine/texture",
        "oxeye_cape": "textures/capes/oxeye/texture",
        "blueprint_cape": "textures/capes/blueprint/texture",
        "mojang_cape1": "textures/capes/mojangClassic/texture",
        "xbox360_cape": "textures/capes/microsoftXbox360/texture",
        "fj_studios_cape": "textures/capes/fjstudios/texture",
        "mojang_cape2": "textures/capes/mojang/texture",
        "mojang_studios_cape": "textures/capes/mojangStudios/texture",
        "christmas2010_cape": "textures/capes/christmas/texture",
        "ny2011_cape": "textures/capes/newyear/texture",
        "xbox360_1st_birthday_cape": "textures/capes/xbox360FirstBirthday/texture",
        "idaho_cape": "textures/capes/idaho/texture",
        "god_cape": "textures/capes/turnaround/texture",
        "void_cape_f1": "textures/capes/eclipse/texture1",
        "void_cape_f2": "textures/capes/eclipse/texture2",
        "void_cape_f3": "textures/capes/eclipse/texture3",
        "void_cape_f4": "textures/capes/eclipse/texture4",
        "void_cape_f5": "textures/capes/eclipse/texture5",
        "void_cape_f6": "textures/capes/eclipse/texture6",
        "void_cape_f7": "textures/capes/eclipse/texture7",
        "void_cape_f8": "textures/capes/eclipse/texture8",
        "void_cape_f9": "textures/capes/eclipse/texture9",
        "void_cape_f10": "textures/capes/eclipse/texture10",
        "void_cape_f11": "textures/capes/eclipse/texture11",
        "void_cape_f12": "textures/capes/eclipse/texture12",
        "void_cape_f13": "textures/capes/eclipse/texture13",
        "void_cape_f14": "textures/capes/eclipse/texture14",
        "void_cape_f15": "textures/capes/eclipse/texture15",
        "void_cape_f16": "textures/capes/eclipse/texture16",
        "void_cape_f17": "textures/capes/eclipse/texture17",
        "void_cape_f18": "textures/capes/eclipse/texture18",
        "void_cape_f19": "textures/capes/eclipse/texture19",
        "void_cape_f20": "textures/capes/eclipse/texture20",
        "void_cape_f21": "textures/capes/eclipse/texture21",
        "void_cape_f22": "textures/capes/eclipse/texture22",
        "void_cape_f23": "textures/capes/eclipse/texture23",
        "void_cape_f24": "textures/capes/eclipse/texture24",
        "void_cape_f25": "textures/capes/eclipse/texture25",
        "void_cape_f26": "textures/capes/eclipse/texture26",
        "void_cape_f27": "textures/capes/eclipse/texture27",
        "void_cape_f28": "textures/capes/eclipse/texture28",
        "void_cape_f29": "textures/capes/eclipse/texture29",
        "void_cape_f30": "textures/capes/eclipse/texture30",
        "void_cape_f31": "textures/capes/eclipse/texture31",
        "void_cape_f32": "textures/capes/eclipse/texture32",
        "void_cape_f33": "textures/capes/eclipse/texture33",
        "void_cape_f34": "textures/capes/eclipse/texture34",
        "void_cape_f35": "textures/capes/eclipse/texture35",
        "void_cape_f36": "textures/capes/eclipse/texture36",
        "void_cape_f37": "textures/capes/eclipse/texture37",
        "void_cape_f38": "textures/capes/eclipse/texture38",
        "void_cape_f39": "textures/capes/eclipse/texture39",
        "void_cape_f40": "textures/capes/eclipse/texture40",
        "void_cape_f41": "textures/capes/eclipse/texture41",
        "void_cape_f42": "textures/capes/eclipse/texture42",
        "void_cape_f43": "textures/capes/eclipse/texture43",
        "void_cape_f44": "textures/capes/eclipse/texture44",
        "void_cape_f45": "textures/capes/eclipse/texture45",
        "void_cape_f46": "textures/capes/eclipse/texture46",
        "thunderstorm_cape_f1": "textures/capes/thunderstorm/texture1",
        "thunderstorm_cape_f2": "textures/capes/thunderstorm/texture2",
        "thunderstorm_cape_f3": "textures/capes/thunderstorm/texture3",
        "thunderstorm_cape_f4": "textures/capes/thunderstorm/texture4",
        "thunderstorm_cape_f5": "textures/capes/thunderstorm/texture5",
        "thunderstorm_cape_f6": "textures/capes/thunderstorm/texture6",
        "thunderstorm_cape_f7": "textures/capes/thunderstorm/texture7",
        "thunderstorm_cape_f8": "textures/capes/thunderstorm/texture8",
        "thunderstorm_cape_f9": "textures/capes/thunderstorm/texture9",
        "thunderstorm_cape_f10": "textures/capes/thunderstorm/texture10",
        "thunderstorm_cape_f11": "textures/capes/thunderstorm/texture11",
        "thunderstorm_cape_f12": "textures/capes/thunderstorm/texture12",
        "thunderstorm_cape_f13": "textures/capes/thunderstorm/texture13",
        "thunderstorm_cape_f14": "textures/capes/thunderstorm/texture14",
        "awesom_cape": "textures/capes/+aprilfools/Awesom_Cape",
        "blonk_cape": "textures/capes/+aprilfools/Blonk_Cape",
        "no_circle_cape": "textures/capes/+aprilfools/No_circle_Cape",
        "nyan_cape": "textures/capes/+aprilfools/Nyan_Cape",
        "squid_cape": "textures/capes/+aprilfools/Squid_Cape",
        "veterinarian_cape": "textures/capes/+aprilfools/Veterinarian_Cape",

        "creeper15_cape": "textures/capes/+custom/CreeperCape",
        "redstone15_cape": "textures/capes/+custom/RedstoneCape",
        "enderdragon15_cape": "textures/capes/+custom/EnderdragonCape",
        "evoker15_cape": "textures/capes/+custom/EvokerCape",
        "pinksheep15_cape": "textures/capes/+custom/SheepCape",
        "dolphin15_cape": "textures/capes/+custom/DolphinCape",
        "panda15_cape": "textures/capes/+custom/PandaCape",
        "villager15_cape": "textures/capes/+custom/VillagerCape",
        "bee15_cape": "textures/capes/+custom/BeeCape",
        "piglinbrute15_cape": "textures/capes/+custom/PiglinBruteCape",
        "axolotl15_cape": "textures/capes/+custom/AxolotlCape",
        "deepslate15_cape": "textures/capes/+custom/DeepslateCape",
        "frog15_cape": "textures/capes/+custom/FrogCape",
        "camel15_cape": "textures/capes/+custom/CamelCape",
        "breeze15_cape": "textures/capes/+custom/BreezeCape",
        "netherstar_cape": "textures/capes/+custom/NetherStarCape",
        "sulfurcube_cape": "textures/capes/+custom/SulfurCubeCape",
        "brsulfurcube_cape": "textures/capes/+custom/BedrockSulfurCubeCape",
        "custom_cape1": "textures/capes/+custom/custom/custom1",
        "custom_cape2": "textures/capes/+custom/custom/custom2",
        "custom_cape3": "textures/capes/+custom/custom/custom3",
        "custom_cape4": "textures/capes/+custom/custom/custom4",
        "custom_cape5": "textures/capes/+custom/custom/custom5",
        "custom_cape6": "textures/capes/+custom/custom/custom6",
        "custom_cape7": "textures/capes/+custom/custom/custom7",
        "custom_cape8": "textures/capes/+custom/custom/custom8",
        "custom_cape9": "textures/capes/+custom/custom/custom9",
        "custom_cape10": "textures/capes/+custom/custom/custom10",
        "custom_cape11": "textures/capes/+custom/custom/custom11",
        "custom_cape12": "textures/capes/+custom/custom/custom12",
        "custom_cape13": "textures/capes/+custom/custom/custom13",
        "custom_cape14": "textures/capes/+custom/custom/custom14",
        "custom_cape15": "textures/capes/+custom/custom/custom15",
        "custom_cape16": "textures/capes/+custom/custom/custom16",
        "custom_cape17": "textures/capes/+custom/custom/custom17",
        "custom_cape18": "textures/capes/+custom/custom/custom18",
        "custom_cape19": "textures/capes/+custom/custom/custom19",
        "custom_cape20": "textures/capes/+custom/custom/custom20"
      };

function textureChecks(increment) {
  let { rpArr } = capeMarkValues(increment);
  let { vanillaT, aprilfoolsT, custom2T, custom1T } = rpArr;
  let search = [ ...vanillaT, ...aprilfoolsT, ...custom2T, ...custom1T ];
  Object.entries(TEXTURES).forEach(([key, _]) => {
    console.log(key, " => ", containsMatch(`Texture.${key}`, search));
  });
}

function playerRPMerge(increment) {
  const mainJSON = JSON.parse(readFileSync("./player.entity.json", { encoding: 'utf8' }));
  if (!mainJSON) {
    console.error("File 'player.entity.json' not found.");
    return false;
  }
  let playerJSON_R = mainJSON["minecraft:client_entity"]["description"];
  let i = 0;
  Object.assign(playerJSON_R["textures"], TEXTURES);
  let { differences } = capeMarkValues(increment);
  let highId = -999 - increment;
  let renderControls = [
    "vanilla_capes",
    "april_fools_capes",
    "custom_cape_presets",
    "custom_cape_templates",
    "idaho_cape",
    "void_cape",
    "god_cape",
    "thunderstorm_cape"
  ];
  for (let rc of renderControls) {
    let setf = `controller.render.player.${rc}`;
    if (i > 3) {
      playerJSON_R["render_controllers"].push({
        [setf]: `!variable.is_first_person && !variable.map_face_icon && !query.is_spectator && query.mark_variant == ${highId--}`
      });
      i++;
      continue;
    }
    if (rc == "custom_cape_templates") {
      playerJSON_R["render_controllers"].push({
        [setf]: `!variable.is_first_person && !variable.map_face_icon && !query.is_spectator && (query.mark_variant <= ${differences[i][0]} && query.mark_variant >= ${differences[i][1]})`
      });
      i++;
      continue;
    }
    playerJSON_R["render_controllers"].push({
      [setf]: `!variable.is_first_person && !variable.map_face_icon && !query.is_spectator && (query.mark_variant >= ${differences[i][0]} && query.mark_variant <= ${differences[i][1]})`
    });
    i++;
  }
  Object.assign(mainJSON["minecraft:client_entity"]["description"], playerJSON_R);
  try {
    mkdirSync(dirname(savefiles.RP_p), { recursive: true });
    writeFileSync(savefiles.RP_p, JSON.stringify(mainJSON, null, 2));
    console.log("Success! Saved as", savefiles.RP_p);
    return true;
  } catch (err) {
    console.error("Failed to write player.entity.json to VisualCapesRP.");
    return false;
  }
}

function capeRenders(increment) {
  const mainJSON = JSON.parse(readFileSync("./cape.render_controllers.json", { encoding: 'utf8' }));
  if (!mainJSON) {
    console.error("File 'cape.render_controllers.json' not found.");
    return false;
  }
  let renderJSON = mainJSON["render_controllers"];
  let _incr = increment ?? 0;
  const { differences, rpArr } = capeMarkValues(_incr);
  let combined = Object.entries(rpArr).map(([_, value]) => value);
  const controls = ["vanilla_capes", "april_fools_capes", "custom_cape_presets", "custom_cape_templates"];
  const specials = ["idaho_cape", "void_cape", "god_cape", "thunderstorm_cape"];
  let highId = -999;
  for (let i = 0; i < 4; i++) {
    let controllerName = `controller.render.player.${controls[i]}`;
    renderJSON[controllerName]["arrays"]["textures"][`Array.capes${i + 1}`] = combined[i];
    if (i == 3) {
      renderJSON[controllerName]["textures"] = [`Array.capes${i + 1}[((query.mark_variant * -1) - ${Math.abs(differences[i][0]) - 2})]`];
      renderJSON[controllerName]["part_visibility"][0]["cape"] = `(query.mark_variant <= ${differences[i][0]} && query.mark_variant >= ${differences[i][1]}) && (query.armor_texture_slot(1) != 5) && (!variable.is_first_person || variable.is_paperdoll)  && !variable.map_face_icon && !query.is_spectator`;
    } else {
      renderJSON[controllerName]["textures"] = [`Array.capes${i + 1}[(query.mark_variant - ${differences[i][0]})]`];
      renderJSON[controllerName]["part_visibility"][0]["cape"] = `(query.mark_variant >= ${differences[i][0]} && query.mark_variant <= ${differences[i][1]}) && (query.armor_texture_slot(1) != 5) && (!variable.is_first_person || variable.is_paperdoll)  && !variable.map_face_icon && !query.is_spectator`;
    }
  }
  for (let sp of specials) {
    let setf = `controller.render.player.${sp}`;
    renderJSON[setf]["part_visibility"][0]["cape"] = `(query.mark_variant == ${-_incr + highId--}) && (query.armor_texture_slot(1) != 5) && (!variable.is_first_person || variable.is_paperdoll)  && !variable.map_face_icon && !query.is_spectator`;
    if (sp !== "god_cape") continue;
    const shufcapes = [...combined[0], "Texture.idaho_cape"];
    renderJSON[setf]["arrays"]["textures"]["Array.cape_shuffle"] = shufcapes;
  }
  Object.assign(mainJSON["render_controllers"], renderJSON)
  try {
    mkdirSync(dirname(savefiles.RP_c), { recursive: true });
    writeFileSync(savefiles.RP_c, JSON.stringify(mainJSON, null, 2));
    console.log("Success! Saved as", savefiles.RP_c);
    return true;
  } catch (err) {
    console.error("Failed to write cape.render_controllers.json to VisualCapesRP.");
    return false;
  }
}

function elytraSubstitute(capeName) {
  if (!containsMatch(capeName, capeNoElytra))
    return `!query.has_cape ? Texture.${capeName} : Texture.default`;
  else return 'Texture.default';
}

function elytraRenders(list, data) {
  let elytraRCArr = [
    "controller.render.default_elytra"
  ];
  let root = {
    ["format_version"]: "1.8.0",
    ["render_controllers"]: {
      ["controller.render.default_elytra"]: {
        geometry: "query.mark_variant == 0 ? Geometry.default : Geometry.none",
        materials: [
          { "*": "variable.is_enchanted ? Material.enchanted : Material.default" }
        ],
        textures: [
          "Texture.default",
          "Texture.enchanted"
        ]
      }
    }
  };
  let controlName;
  Object.entries(list).forEach(([name, num]) => {
    let value = num["minecraft:mark_variant"]["value"];
    name = name.replace(/custom_cape_slot/g, "custom_cape");
    if (!name.includes("_cape")) {
      name += "_cape";
    }
    controlName = "controller.render." + name + ".elytra";
    if (name == "remove_cape") return;
    root["render_controllers"][controlName] = {
      ["geometry"]: `query.mark_variant == ${value} ? Geometry.default : Geometry.none`,
      ["materials"]: [ { ["*"]: "variable.is_enchanted ? Material.enchanted : Material.default" } ],
      ["textures"]: [
        elytraSubstitute(name),
        "Texture.enchanted"
      ]
    };
    elytraRCArr.push(controlName);
  });
  if (data) return elytraRCArr;
  try {
    mkdirSync(dirname(savefiles.RP_ce), { recursive: true });
    writeFileSync(savefiles.RP_ce, JSON.stringify(root, null, 2));
    console.log("Success! Saved as", savefiles.RP_ce);
    return true;
  } catch (err) {
    console.error("Failed to write elytra.render_controllers.json to VisualCapesRP.");
    return false;
  }
}

function capeElytra(list) {
  const mainJSON = JSON.parse(readFileSync("./elytra.json", { encoding: 'utf8' }));
  if (!mainJSON) {
    console.error("File 'elytra.json' not found.");
    return false;
  }
  let elytraJSON = mainJSON["minecraft:attachable"]["description"];
  let textureSet = {};
  Object.entries(TEXTURES).forEach(([name, filepath]) => {
    if (containsMatch(name, capeNoElytra) || name == "cape" || name == "default") return;
    name = name
      .replace(/void_cape_f\d+/g, "void_cape")
      .replace(/thunderstorm_cape_f\d+/g, "thunderstorm_cape");
    filepath = filepath.replace(/texture\d+/g, "texture");
    textureSet[name] = filepath;
  })
  Object.assign(elytraJSON["textures"], textureSet);
  Object.assign(elytraJSON["geometry"], {
    ["none"]: "geometry.no_elytra"
  });
  elytraJSON["render_controllers"] = elytraRenders(list, true);
  Object.assign(mainJSON["minecraft:attachable"]["description"], elytraJSON);
  try {
    mkdirSync(dirname(savefiles.RP_e), { recursive: true });
    writeFileSync(savefiles.RP_e, JSON.stringify(mainJSON, null, 2));
    console.log("Success! Saved as", savefiles.RP_e);
    return true;
  } catch (err) {
    console.error("Failed to write elytra.json to VisualCapesRP.");
    return false;
  }
}

////// CAPE COUNTER //////
// Current: 93 - 20 - 3 = 70
function capesTotals(increment) {
  let { values, counts, differences, total } = capeMarkValues(increment);
  console.log("Cape Values:", JSON.stringify(values, null, 2));
  console.log("Cape Counts:", JSON.stringify(counts, null, 2))
  console.log("Cape Register between:", JSON.stringify(differences, null, 2))
  console.log("Total Capes:", JSON.stringify(total, null, 2))
  let c1 = vanillaCapesList.length;
  let c2 = aprilFoolsCapeList.length;
  let c3 = customCapesList2.length;
  let c4 = customCapesList1.length;
  console.log("\nVanilla Capes", c1);
  console.log("April Fools Capes", c2);
  console.log("Custom Preset Capes", c3);
  console.log("Custom Template Capes", c4);
  let total2 = c1 + c2 + c3;
  console.log("Total", total2);
}

////// DIAGNOSTIC DECODER //////
function readDiagn(fileNum, lineNum) {
  if (typeof fileNum !== "number" && typeof lineNum !== "number")
    return console.error(new TypeError("Invalid arguments passed"));
  const fs = require('fs');
  const zlib = require('zlib');
  fs.readFile(`./diagnostics/dn_${fileNum.toString().padStart(2, "0")}.mcstats`, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    if (lineNum < 2) {
      console.error("Invalid Data Line Read.");
      return;
    }
    const dataArr = data.split('\n');
    base64Data = dataArr[lineNum - 1];
    const buffer = Buffer.from(base64Data, 'base64');
    zlib.gunzip(buffer, (err, decompressed) => {
      if (err) {
        console.error("Failed to decompress:", err);
        return;
      }
      const jsonText = decompressed.toString('utf-8');
      const json = JSON.parse(jsonText);
      const jsonSave = JSON.stringify(json, undefined, 2);
      fs.writeFile(`./dn_data.json`, jsonSave, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("'dn_data.json' created successfully.");
      });
    });
  });
}


// -----------------------------------------------
//   CAPE AND ELYTRA RESOURCES PACK LEGACY CODE
// -----------------------------------------------
const capeFormat = (name, int) => `
    "controller.render.player.` + name + `": {
      "rebuild_animation_matrices": true,
      "geometry": "Geometry.cape",
      "materials": [ { "*": "Material.cape" } ],
      "textures": [ "!query.has_cape ? Texture.` + name + ` : Texture.cape" ],
      "part_visibility": [
        { "cape": "(query.mark_variant == ` + int + `) && (query.armor_texture_slot(1) != 5) && (!variable.is_first_person || variable.is_paperdoll)  && !variable.map_face_icon && !query.is_spectator" }
      ],
      "is_hurt_color": {
        "r": 0.0,
        "g": 0.0,
        "b": 0.0,
        "a": 0.0
      }
    },`;

const defElytra = `
    "controller.render.default_elytra": {
      "geometry": "query.mark_variant == 0 ? Geometry.default : Geometry.none",
      "materials": [ { "*": "variable.is_enchanted ? Material.enchanted : Material.default" } ],
      "textures": [
        "Texture.default",
        "Texture.enchanted"
      ]
    },
`;
// const defElytra_RC = "controller.render.default_elytra";

const capeFormatE = (name, int) => {
  if (name == "remove_cape") return defElytra;
  return `
    "controller.render.` + name + `.elytra": {
      "geometry": "query.mark_variant == ` + int + ` ? Geometry.default : Geometry.none",
      "materials": [ { "*": "variable.is_enchanted ? Material.enchanted : Material.default" } ],
      "textures": [
        ${elytraSubstitute(name)},
        "Texture.enchanted"
      ]
    },`;
};

const playerRC = (name, int) => `        { "controller.render.player.` + name + `": "!variable.is_first_person && !variable.map_face_icon && !query.is_spectator && query.mark_variant == ` + int + `" },`;
const elytraRC = (name) => `        "controller.render.` + name + `.elytra",`;

// CONSOLE FOR capeFormat, capeFormatE, playerRC, elytraRC */
function legacyGenCapes(list, number, increment) {
  if (typeof number !== "number" || typeof increment !== "number") throw new Error("Register Entered Incomplete");
  Object.entries(list).forEach(([name, num]) => {
    let value = num["minecraft:mark_variant"]["value"] + (num < 0 ? increment * -1 : increment);
    switch (number) {
      case 0:
        console.log(capeFormat(name.replace(/custom_cape_slot/g, 'custom_cape'), value));
        break;
      case 1:
        console.log(capeFormatE(name.replace(/custom_cape_slot/g, 'custom_cape'), value));
        break;
      case 2:
        console.log(playerRC(name.replace(/custom_cape_slot/g, 'custom_cape'), value));
        break;
      case 3:
        console.log(elytraRC(name.replace(/custom_cape_slot/g, 'custom_cape'), value));
        break;
      default: throw new Error("Invalid Register");
    }
  });
}


// -----------------------------------------------
//      OTHERS
// -----------------------------------------------

////// CAPES RARITY IDs (Constants.js) //////
function capeRarityIdentifier() {
  for (let cape of capes) {
    let rarity = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Deity'];
    console.log(`${cape.name} (${rarity[cape.rarity_value]})`);
  };
};

////// CAPES UI (Constants.js) //////
function capeUI() {
  const capes = customCapesList2;
  const capeID = capes[0].type.replace(/:\S+/g, ':');
  function elytraSubstitute(cape) {
    if (!containsMatch(cape.type.replace(capeID, ''), capeNoElytra))
      return `,\n          "$elytra_texture": "${cape.icon.replace('textures/capes/', '')}-elytra"`;
    else return '';
  };
  for (let cape of capes) {
    console.log(`      {
        "${cape.type.replace(capeID, '')}@capes_common_ui.cape_display_template": {
          "$cape_toggle": "${cape.type.replace(capeID, '')}_toggle",
          "$cape_name": "${cape.name}",
          "$cape_namespace": "${cape.type}",
          "$cape_texture": "${cape.icon.replace('textures/capes/', '')}"${elytraSubstitute(cape)}
        }
      },`);
  };
};

function capeOffsetJS(increment) {
  try {
    const data = `export const offset = ${increment};`;
    mkdirSync(dirname(savefiles.BP_js), { recursive: true });
    mkdirSync(dirname(savefiles.Ext_js), { recursive: true });
    writeFileSync(savefiles.BP_js, data);
    writeFileSync(savefiles.Ext_js, data);
    return true;
  } catch (err) {
    console.error("Failed to write offset.js");
    return false;
  }
}

////// MINECRAFT SERVER FORM UI //////

// ActionFormData UI bindings.
const formTitles = [
  "About Visual Capes Add-on",
  "Visual Capes Add-on Achievements",
  "Item AUX List"
];
function serverFormBindings() {
  let condition = [];
  formTitles.forEach(title => {
    condition.push(`((#title_text - '${title}') = #title_text)`);
  });
  console.log('(' + condition.join(' and ') + ')');
}


// -----------------------------------------------
//      Utilities
// -----------------------------------------------

////// ITEM IDs //////
function itemIDs() {
  for (let i = 1; i <= 1000; i++) {
    console.log(`      { "item_${i}@capes_common_ui.item_id_panel": { "$item_id": ${i}, "$row": "${i}" } },`);
  };
}

////// JSON ONE LINE FORMATTER //////
const json1 = readFileSync("./vanilla.player.json", { encoding: 'utf8' });
function jsonFormatter() {
  let json2 = JSON.parse(json1);
  console.log(JSON.stringify(json2, null, 2));
}

////// CAPE ANIMATION //////
// Used for animating vanilla capes
const capeTextures = `{}`;
function capeTextureArray() {
  const vanilla_capes = JSON.parse(capeTextures);
  Object.entries(vanilla_capes).forEach(([name, _]) => {
    console.log('            "Texture.' + name + '",');
  });
};

// -----------------------------------------------
//      MAIN PROCESS
// -----------------------------------------------
const consoleArgs = process.argv.slice(2);
const [ prefix, cmd, incr, sel ] = consoleArgs;
if (prefix == "br-vca") {
  const argInc = Math.abs(parseInt(incr ?? 0));
  const capesList = capeMarkValues(argInc).components;
  switch (cmd) {
    case 'BP':
      playerBPMerge(argInc);
      break;
    case 'RP-p':
      playerRPMerge(argInc);
      break;
    case 'RP-e':
      capeElytra(capesList);
      break;
    case 'RP-c':
      capeRenders(argInc);
      break;
    case 'RP-ce':
      elytraRenders(capesList, argInc);
      break;
    case 'T':
      capesTotals(argInc);
      break;
    case 'mcf':
      capeMCF();
      break;
    case 'incrjs':
      capeOffsetJS(argInc);
      break;
    case 'dn':
      readDiagn(parseInt(consoleArgs[2] ?? 1), parseInt(consoleArgs[3] ?? 2));
      break;
    case 'legacy':
      legacyGenCapes(capesList, parseInt(sel ?? -1), argInc);
      break;
    default:
      const fnErr = new ReferenceError("Function does not exist.");
      console.error(fnErr.name + ": " + fnErr.message);
  }
  process.exit(0);
}
else if (prefix == "rsf") {
  try {
    Object.entries(savefiles).forEach(([key, path]) => {
      if (key == "BP_mcf") return;
      unlinkSync(path);
      console.log("removed " + path);
    });
    console.log("Success!");
    process.exit(0);
  } catch (err) {
    console.error("Failed to remove path:", err.message);
    process.exit(1);
  }
}
else if (prefix == ".") {
  switch (cmd) {
    case 'anim':
      capeTextureArray();
      break;
    // Custom Template Capes output test in JS Object[]
    case 'ctTp':
      console.log(customCapesList1);
      break;
    case 'forms':
      serverFormBindings();
      break;
    case 'identify':
      capeRarityIdentifier();
      break;
    case 'itemIDs':
      itemIDs();
      break;
    case 'json':
      jsonFormatter();
      break;
    case 'txtr':
      textureChecks();
      // console.log(JSON.stringify(rpArr, null, 2));
      break;
    case 'ui':
      capeUI();
      break;
    default:
console.error(`Methods available:
anim
ctTp
forms
identify
itemIDs
json
txtr
ui
********************`);
      process.exit(1);
  }
  process.exit(0);
}
else {
  console.log(`Usage:
generate_capes.js br-vca <FETCH> [increment]
generate_capes.js br-vca mcf
generate_capes.js br-vca dn [dn:fileNum] [dn:lineNum]
generate_capes.js br-vca legacy <increment> <legacy:selection>

<FETCH> string
- Visual Capes Add-on tool for generating capes' JSON code without any struggle.
  Functions:
    BP      = Player Entity (Behavior Pack)
    RP-p    = Player Entity (Resource Pack)
    RP-e    = Elytra Attachable
    RP-c    = Cape Render Controllers
    RP-ce   = Cape Elytra Render Controllers
    T       = Capes' number with calculations
    mcf     = Auto generate .mcfunction for capes
    incrjs  = Set offset.js increment
    dn      = Diagnostic Decoder
    legacy  = Legacy Functions

[increment] integer
- Adjust Capes' ID for add-on compatibility. Visual Capes addon uses static "mark_variant" component which many add-on uses.
  (Default = 0)

[dn:fileNum] integer
- Number for diagnostics/dn_##.mcstats.
  (Default = 1)

[dn:lineNum] integer
- Number for dn_##.mcstats line number.
  (Default = 2)

<legacy:selection> integer
- [Deprecated - Legacy (Semi-Automatic)] Used to copy/paste old render controllers code then place them to JSON files manually.
  (0 to 3)

Visual Capes Add-on Dev ${version}`);
  process.exit(1);
}
