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
import { ActionFormData, MessageFormData } from '@minecraft/server-ui';
import { world, system, TicksPerSecond, CustomCommandStatus, EntityComponentTypes, ItemStack, Player, Entity } from '@minecraft/server';
import { raritySystem } from '../config.js';
import { rawtext, Cape, permissionSwitch, rarityNames, vcaProperties, itemsToRarity, formText, buttonText, messageText } from './constants.js';

/**
  * @typedef {import('@minecraft/server').Vector3} Vector3
  */

export class Achievement {
  static #list = permissionSwitch.achievement;
  static #enclosed = "[]";
  static #message = [
    "vcascript.achievement.default",
    "vcascript.achievement.goal",
    "vcascript.achievement.challenge"
  ];
  static get listArr() {
    return Object.entries(Achievement.#list);
  }
  /**
    * @param {string} name
    */
  static tag(name) {
    for (let [key, value] of Achievement.listArr) {
      if (name !== value) continue;
      return "vcaa-" + key.toLowerCase()
      .replace(/([a-z])\1+/g, '$1')
      .replace(/[aeiou\s_]/g, '');
    }
    return null;
  }
  /**
    * @param {string | any[]} name
    * @param {number} level
    * @param {Player} player
    * @param {(achTag: any) => any} callback
    * @param {string} [color]
    */
  static grant(name, level, player, callback, color) {
    if (
      typeof name !== "string" || !name?.length || !Achievement.tag(name) ||
      typeof level !== "number" || !(level >= 1 && level <= 3) ||
      !(player instanceof Player) ||
      typeof callback !== "function" ||
      (color && typeof color !== "string")
    ) return console.error(`Achievement "${name}" not registered.`);
    const useColor = color ?? (level < 3 ? "§a" : "§5");
    const isGranted = callback.call(undefined, Achievement.tag(name));
    if (isGranted !== true) return;
    world.sendMessage(rawtext.lang(
      Achievement.#message[level - 1],
      [`${player.name}`,
       `${useColor}${Achievement.#enclosed[0]}${name}${Achievement.#enclosed[1]}§r`]
    ));
    player.playSound(
      level < 3 ? "visualcapes.levelup_legacy" : "visualcapes.challenge_complete",
      { volume: 0.7, location: player.location }
    );
    player.setDynamicProperty(Achievement.tag(name), true);
    return true;
  }
  /**
    * @param {string} name
    * @param {Player} player
    */
  static apply(name, player) {
    player.setDynamicProperty(Achievement.tag(name), true);
    world.sendMessage(`Achievement [§e${name}§r] added from ${player.name}`);
  }
  /**
    * @param {string} name
    * @param {Player} player
    */
  static revoke(name, player) {
    player.setDynamicProperty(Achievement.tag(name), undefined);
    world.sendMessage(`Achievement [§e${name}§r] removed from ${player.name}`);
  }
  /**
    * @param {Player} player
    */
  static view(player) {
    if (!(player instanceof Player)) return;
    const achievementForm = new ActionFormData()
      .title("Visual Capes Add-on Achievements")
      .body(formText.achievementDescription)
      .divider();
    const icon = (/** @type {string} */ string) => `textures/capes/ui/achievement${string}`;
    for (let [tag, name] of Achievement.listArr) {
      if (
        (!raritySystem.survival_tweaks && containsMatch(tag, permissionSwitch.achievementRST)) ||
        (name === permissionSwitch.achievement.cape_collector && world.getDynamicProperty(vcaProperties.capeCollector) !== true)
      ) continue;
      if (player.getDynamicProperty(Achievement.tag(name)) !== true)
      achievementForm.button(name, icon("Locked"));
      else
      achievementForm.button(name, icon("Unlocked"));
      achievementForm.label(rawtext.lang(`vcascript.achievement.${tag}.description`, [ rarityNames[0], rarityNames[3], rarityNames[5] ])).divider();
    }
    achievementForm.show(player);
  }
}

/**
 * @param {Error} error
 */
export function getErrorMessage(error, gb = true) {
  if (!(error instanceof Error)) return error;
  const lct = error.stack?.match(/\S+\s\(\S+:\d+\)/);
  const stackFilter = lct ? lct[0] : "null";
  const line = error.name +
    (!gb ? ' at ' + stackFilter + " - " : ': ') +
    (error.message ? error.message + '.' : "an unknown error has occured.");
  return line;
}

/**
 * @param {string} mainString
 * @param {string[] | any[]} substrings
 */
export function containsMatch(mainString, substrings) {
  return substrings.some((/** @type {any} */ sub) => mainString.includes(sub));
}

/**
 * @param {any[]} array
 */
export function sortByName(array) {
  return array.sort((/** @type {{ name: string; }} */ a, /** @type {{ name: string; }} */ b) => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    return 0;
  });
}

/**
 * @param {any[]} array
 */
export function sortByRarity(array) {
  return array.sort((/** @type {{ rarity_value: number; }} */ a, /** @type {{ rarity_value: number; }} */ b) => a.rarity_value - b.rarity_value);
}

/**
 * @param {Player} player
 * @param {Function} prevForm
 */
export function visualCapesInfo(player, prevForm) {
  const visualCapesInfoForm = new ActionFormData()
    .title('About Visual Capes Add-on')
    .body(`I${raritySystem.enabled ? `+Rar${raritySystem.survival_tweaks ? '+Sur' : ''}` : ''}${!player.hasTag(btoa(permissionSwitch.startup)) ? '+Str' : ''}`)
    .button(buttonText.goBack);
  visualCapesInfoForm.show(player).then(() => prevForm.call(undefined, player));
}

/**
 * @param {Player} player
 */
export function itemAuxCmd(player) {
  const itemAuxMenu = new ActionFormData().title("Item AUX List");
  itemAuxMenu.show(player).then(() => player.sendMessage("Form executed successfully."));
}

/**
  * @remarks
  * Map Variable Data. Sets a variable from a Map data.
  *
  * @returns
  * Returns the entity's data from specified Map.
  * If an entity does not have data from the Map,
  * then it creates a new Map data with default value
  * from argument value or 0 then return that data.
  *
  * @param {Entity} entity
  * @param {Map<any, any>} mapClass
  * @param {any} [value]
  */
export function mapVarData(entity, mapClass, value) {
  const _pid = entity.id;
  if (!mapClass.has(_pid)) {
    const _value = value ?? 0;
    mapClass.set(_pid, _value);
  };
  return mapClass.get(_pid);
}

/**
  * @returns
  * Returns the distance between the center and position.
  *
  * @param {Vector3} center
  * @param {Vector3} position
  */
export function hypotXYZ(center, position) {
  return Math.sqrt(
    Math.pow(position.x - center.x, 2) +
    Math.pow(position.y - center.y, 2) +
    Math.pow(position.z - center.z, 2)
  );
}

/**
 * @param {Vector3} position
 */
export function centeredXYZ(position) {
  return {
    x: Math.floor(position.x) + 0.5,
    y: Math.floor(position.y) + 0.5,
    z: Math.floor(position.z) + 0.5
  };
}

/**
 * @param {Vector3} position
 * @param {boolean} [fixed]
 */
export function centeredXZ(position, fixed) {
  return {
    x: Math.floor(position.x) + 0.5,
    y: !fixed ? position.y : Math.floor(position.y),
    z: Math.floor(position.z) + 0.5
  };
}

/**
 * @param {string} input
 */
export function btoa(input) {
  let string = input;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let encoded = '';
  let i = 0;
  while (i < string.length) {
    const c1 = string.charCodeAt(i++);
    const c2 = i < string.length ? string.charCodeAt(i++) : NaN;
    const c3 = i < string.length ? string.charCodeAt(i++) : NaN;
    encoded += chars[c1 >> 2];
    encoded += chars[((c1 & 3) << 4) | (c2 >> 4)];
    if (isNaN(c2)) {
      encoded += '==';
    } else {
      encoded += chars[((c2 & 15) << 2) | (c3 >> 6)];
      encoded += isNaN(c3) ? '=' : chars[c3 & 63];
    };
  };
  return encoded.replace(/\+/g, '&').replace(/\//g, '?').replace(/=/g, '.');
}

/**
 * @param {string} input
 */
export function atob(input) {
  let encoded = input.replace(/&/g, '+').replace(/\?/g, '/').replace(/\./g, '=');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let str = '';
  let i = 0;
  encoded = encoded.replace(/=+$/, '');
  while (i < encoded.length) {
    const c1 = chars.indexOf(encoded.charAt(i++));
    const c2 = chars.indexOf(encoded.charAt(i++));
    const c3 = i < encoded.length ? chars.indexOf(encoded.charAt(i++)) : -1;
    const c4 = i < encoded.length ? chars.indexOf(encoded.charAt(i++)) : -1;
    str += String.fromCharCode((c1 << 2) | (c2 >> 4));
    if (c3 !== -1) {
      str += String.fromCharCode(((c2 & 15) << 4) | (c3 >> 2));
    };
    if (c4 !== -1) {
      str += String.fromCharCode(((c3 & 3) << 6) | c4);
    };
  };
  return str;
}

/**
 * @param {number} tick
 */
export function tickCheck(tick) {
  return system.currentTick % tick === 0;
}

/**
 * @param {string} message
 */
export function commandFail(message) {
  let msg = message ?? "Custom Command execution failed.";
  return {
    status: CustomCommandStatus.Failure,
    message: msg
  };
}

/**
  * @remarks
  * Sned script logs if the world property 
  * vcaProperties.scriptCheck is set to true.
  *
  * @param {Function} callback
  */
export function scriptCheck(callback) {
  let chk = world.getDynamicProperty(vcaProperties.scriptCheck);
  if (chk !== true) return;
  callback.call();
}

/**
 * @param {Player} player
 * @param {import('./constants.js').CapeData} cape
 */
export function accessFilter(player, cape) {
  const permissions = [
    btoa(permissionSwitch.rarity.uncommon),
    btoa(permissionSwitch.rarity.rare),
    btoa(permissionSwitch.rarity.epic),
    btoa(permissionSwitch.rarity.legendary)
  ];
  return !permissions.some(permission => {
    if (!player.hasTag(permission)) {
      return cape.rarity_value === permissions.indexOf(permission) + 1;
    };
    return false;
  });
}

/**
 * @param {string} key
 */
export function worldData(key) {
  if (!key) return console.error("No data provided from worldData()");
  return world.getDynamicProperty(key);
}


/**
 * @param {Entity} entity
 */
export function getEntityName(entity) {
  if (entity instanceof Player) return entity.name;
  return entity.nameTag;
}

/**
  * @remarks
  * Checks the player's inventory if the specified arguments
  * able to find the item and reached the required amount.
  *
  * @returns
  * Returns true when item is found and reached specified
  * amount. Returns false otherwise.
  *
  * @param {Player} player
  * @param {string} itemType
  * Identifier of the type of items for the stack. If a
  * namespace is not specified, 'minecraft:' is assumed.
  * Examples include 'wheat' or 'apple'.
  * @param {number} amount
  */
export function inventoryCheckItem(player, itemType, amount) {
  const inv = player.getComponent(EntityComponentTypes.Inventory);
  if (!inv && !inv?.container) return false;
  let container = inv.container;
  let item;
  let itemInSlots = [];
  let itemTotalAmount = 0;

  // Item counter
  for (let i = 0; i < 36; i++) {
    try {
      item = container.getItem(i);
      if (!item) continue;
      if (item.typeId == itemType) {
        itemInSlots.push(i);
        itemTotalAmount += item.amount;
      }
    } catch (e) {}
  }
  if (!this?.take) scriptCheck(() => {
    player.sendMessage(`§3Item Required: ${itemType} x${amount}, ${player.name} has ${itemTotalAmount}.§r`);
  });
  if (itemTotalAmount < amount || itemInSlots.length < 1) return false;

  // Take items if reached amount
  if (this?.take === true) {
    let _amount = amount;
    let queue;
    for (let i = 0; i < itemInSlots.length; i++) {
      queue = container.getSlot(itemInSlots[i]);
      item = queue.getItem();
      scriptCheck(() => console.log(`Item ${item.typeId} in slot ${itemInSlots[i]}`));
      if (_amount >= item.amount) queue.setItem(null);
      else queue.setItem(new ItemStack(item.typeId, item.amount - _amount));
      _amount -= item.amount;
      if (_amount < 1) break;
    }
  }
  return true;
}

/**
  * @remarks
  * Clears the player or the world dynamic properties.
  *
  * @param {Player | import("@minecraft/server").World} target
  */
export function clearDynamicProperties(target) {
  try {
    const allIds = target.getDynamicPropertyIds();
    let status = false;
    for (let id of allIds) {
      target.setDynamicProperty(id, undefined);
      status = true;
    }
    return status;
  } catch (err) {
    if (target.sendMessage) {
      target.sendMessage(formText.addonName + getErrorMessage(err, false));
    } else {
      console.error(err.stack);
    }
    return false;
  }
}

/** 
  * @returns
  * Returns the entity or world dynamic properties.
  *
  * @param {Entity | import("@minecraft/server").World} target
  */
export function getDynamicProperties(target) {
  const allIds = target.getDynamicPropertyIds();
  let record = {};
  for (const id of allIds) {
    const dataID = target.getDynamicProperty(id);
    if (dataID == undefined) continue;
    record[id] = dataID;
  }
  if (!this?.filter) return record;
  let filtRec = {};
  for (const fid of this?.filter) {
    if (record[fid] == null) continue;
    filtRec[fid] = record[fid];
  }
  return filtRec;
}

/**
 * @param {Player} target
 * @param {Function} callback
 */
export function modifyDynamicProperties(target, callback) {
  const allIds = target.getDynamicPropertyIds();
  let record = {};
  let status = false;
  for (let id of allIds) {
    record[id] = target.getDynamicProperty(id);
    status = true;
  }
  return callback.call(undefined, {
    data: status ? record : null,
    status: status
  });
}

/**
 * @callback CapeMethod
 * @param {import('@minecraft/server').Player} player
 * @param {import('./constants.js').CapeData} cape
 */
export const registerCapeEquip = {
  buffSound: (/** @type {import('./constants.js').CapeData} */ cape, /** @type {any} */ collector) => {
    if (collector || (!raritySystem.enabled || !raritySystem.survival_tweaks) || cape.rarity_value === 0) return 'none';
    else {
      if (cape.rarity_value < 3 && cape.rarity_value > 0) return "visualcapes.levelup";
      else if (cape.rarity_value > 2) return "visualcapes.challenge_complete";
    };
  },
  /** @type {CapeMethod} */
  capeCollection: (player, cape) => {
    return Achievement.grant(permissionSwitch.achievement.cape_collector, 3, player, (/** @type {any} */ achTag) => {
      if (world.getDynamicProperty(vcaProperties.capeCollector) !== true) return false;
      let collectorTag = player.getDynamicProperty(achTag);
      if (collectorTag) return false;
      player.addTag(btoa(cape.type));
      // const tags = player.getTags();
      const typ = Cape.allList.map(c => c.type);
      let grantC = true;
      for (const cape_t of typ) {
        if (!grantC) break;
        if (!player.hasTag(btoa(cape_t))) {
          grantC &&= false;
        }
      }
      if (!grantC) return false;
      typ.forEach(t => player.removeTag(btoa(t)));
      player.dimension.spawnParticle("visualcapes:collector_start", player.location);
      return true;
    }, "§4") ?? false;
  },
  /** @type {CapeMethod} */
  achievementRarityAny: (player, cape) => {
    return Achievement.grant(permissionSwitch.achievement.first_rarity, 2, player, (/** @type {any} */ achTag) => {
      if (cape.rarity_value > 0 && player.getDynamicProperty(achTag) !== true) return true;
      return false;
    }) ?? false;
  },
  /** @type {CapeMethod} */
  achievementRarityHighTier: (player, cape) => {
    return Achievement.grant(permissionSwitch.achievement.first_legendary, 2, player, (/** @type {any} */ achTag) => {
      if (cape.rarity_value > 3 && player.getDynamicProperty(achTag) !== true) return true;
      return false;
    }) ?? false;
  },
  /** @type {CapeMethod} */
  achievementRarityAll: (player, cape) => {
    return Achievement.grant(permissionSwitch.achievement.rarity_collector, 3, player, (/** @type {any} */ achTag) => {
      const tags = 5 + ((raritySystem.enabled || raritySystem.survival_tweaks) ? 1 : 0);
      const playerNum = player.getDynamicProperty(achTag);
      if (playerNum === true) return false;
      if (playerNum === undefined) {
        let rarityNum = new Array(tags).fill('0');
        rarityNum[cape.rarity_value] = '1';
        player.setDynamicProperty(achTag, rarityNum.join(''));
        return false;
      }
      let playerRarNum = String(playerNum).split('');
      playerRarNum[cape.rarity_value] = '1';
      if (playerRarNum.join('') == new Array(tags).fill('1').join('')) return true;
      player.setDynamicProperty(achTag, playerRarNum.join(''));
      return false;
    }) ?? false;
  },
  /** @type {CapeMethod} */
  checkHasRarity: (player, cape) => {
    if (!raritySystem.enabled || cape.rarity_value < 1) return true;
    return player.hasTag(btoa(permissionSwitch.rarity[rarityNames[cape.rarity_value].toLowerCase()]));
  },
  checkIsValidCape: (/** @type {any} */ cape) => {
    if (cape instanceof Cape) return true;
    return false;
  },
  consumeRarity: (/** @type {import('./constants.js').CapeData} */ cape) => {
    if (!raritySystem.enabled || (raritySystem.enabled && cape.rarity_value === 0)) return '0';
    else return btoa(permissionSwitch.rarity[rarityNames.slice(1).map(r => r.toLowerCase())[cape.rarity_value - 1]]);
  },
  /** @type {CapeMethod} */
  legendaryTag: (player, cape) => {
    if ((raritySystem.enabled || raritySystem.survival_tweaks) && cape.rarity_value > 3) {
      player.addTag(btoa(permissionSwitch.legendaryTag));
    } else {
      player.removeTag(btoa(permissionSwitch.legendaryTag));
    };
  },
  /** @type {CapeMethod} */
  levelUp: (player, cape) => {
    if (!raritySystem.enabled || !raritySystem.survival_tweaks) return 0;
    else {
      if (cape.rarity_value === 0) return 0;
      else if (cape.rarity_value > 0) {
        const subXp = [16, 8, 4, 2, 1];
        return Math.floor(((2 * cape.rarity_value) ** Math.E) + ((player.level / subXp[cape.rarity_value - 1]) * 0.5));
      }
    };
  },
  rarityDisplay: (/** @type {import('./constants.js').CapeData} */ cape) => {
    if (!raritySystem.enabled) return '';
    else {
      const rarityTextColor = ["§f", "§2", "§9", "§5", "§6", "§c§l"];
      let rv = cape.rarity_value;
      return `§o§7[${rarityTextColor[rv]}${rarityNames[rv]}§r§o§7]§r`;
    };
  },
  rarityParticle: (/** @type {import('./constants.js').CapeData} */ cape) => {
    if (!raritySystem.enabled) return '';
    return `_${rarityNames[cape.rarity_value].toLowerCase()}`;
  },
  subscribe: (/** @type {Player} */ player, /** @type {import('./constants.js').CapeData} */ cape, /** @type {any} */ triggerBuffs) => {
    if (!registerCapeEquip.checkIsValidCape(cape)) return player.sendMessage(`${formText.addonName} §cThis cape is not registered as a valid cape.§r`);
    if (!registerCapeEquip.checkHasRarity(player, cape)) return player.sendMessage(`§cYou do not have the privilege to equip the ${cape.name}.§r`);
    player.triggerEvent(cape.type);
    const prominent = (() => {
      let state = false;
      state ||= registerCapeEquip.capeCollection(player, cape);
      state ||= registerCapeEquip.achievementRarityAny(player, cape);
      state ||= registerCapeEquip.achievementRarityHighTier(player, cape);
      state ||= registerCapeEquip.achievementRarityAll(player, cape);
      return state;
    })();
    player.playSound(registerCapeEquip.buffSound(cape, prominent), { volume: 1, location: player.location });
    if (raritySystem.survival_tweaks) {
      player.addLevels(registerCapeEquip.levelUp(player, cape));
      capeBuff.register(player, cape, triggerBuffs);
    };
    if (raritySystem.enabled) {
      registerCapeEquip.legendaryTag(player, cape);
      player.removeTag(registerCapeEquip.consumeRarity(cape));
      player.dimension.spawnParticle(`visualcapes:rarity_equip${registerCapeEquip.rarityParticle(cape)}`, player.location);
    };
    world.sendMessage(`§e${player.name}§f equipped the §b${cape.name}§r ` + registerCapeEquip.rarityDisplay(cape));
  },
  unsubscribe: (/** @type {Player} */ player) => {
    player.triggerEvent('capes:remove_cape');
    // @ts-ignore
    registerCapeEquip.legendaryTag(player, { rarity_value: -1 });
    world.sendMessage(`§e${player.name}§r removed their cape.`);
    if (raritySystem.survival_tweaks) Achievement.grant(permissionSwitch.achievement.deity_fall, 3, player, (/** @type {any} */ achTag) => {
      let id = player.getComponent(EntityComponentTypes.MarkVariant);
      if (id?.value < -999 && player.getDynamicProperty(achTag) !== true) return true;
      return false;
    }, "§4");
  }
};

export const capeActiveFx = 'infFx';
export const capeBuff = {
  effects: [
    { name: 'Conduit Power+ [10]', type: 'conduit.power', legendarybuff: true },
    { name: 'Curse of Binding+ [C]', type: 'curse.bind', legendarybuff: 'custom', maxLevel: 1 },
    { name: 'Fire Resistance+ [1]', type: 'fire.resistance', legendarybuff: true, maxLevel: 1 },
    { name: 'Haste [10]', type: 'haste', legendarybuff: false },
    { name: 'Health Boost [10]', type: 'health.boost', legendarybuff: false },
    { name: 'Instant Recover+ [C]', type: 'instant.recover', legendarybuff: 'custom', maxLevel: 1 },
    { name: 'Jump Boost [10]', type: 'jump.boost', legendarybuff: false },
    { name: 'Nether Domain+ [C]', type: 'nether.domain', legendarybuff: 'custom', maxLevel: 1 },
    { name: 'Night Vision [1]', type: 'night.vision', legendarybuff: false, maxLevel: 1 },
    { name: 'Regeneration [10]', type: 'regeneration', legendarybuff: false },
    { name: 'Resistance [4]', type: 'resistance', legendarybuff: false, maxLevel: 4 },
    { name: 'Self Destruct+ [C]', type: 'self.ignition', legendarybuff: 'custom', maxLevel: 1 },
    { name: 'Slow Falling [10]', type: 'slow.falling', legendarybuff: false },
    { name: 'Speed [10]', type: 'speed', legendarybuff: false },
    { name: 'Strength [10]', type: 'strength', legendarybuff: false },
    { name: 'Water Breathing+ [1]', type: 'water.breathing', legendarybuff: true, maxLevel: 1 },
    { name: 'Wind Pulse+ [C]', type: 'wind.pulse', legendarybuff: 'custom', maxLevel: 1 }
  ],
  effectNameDisplay: (/** @type {string} */ string) => {
    let strFix = string.replace(/\+|\[\d+\]/g, '').replace(/\s+/g, ' ').trim().replace(/\[C\]/g, '(Custom Buff)');
    return strFix;
  },
  variables: {
    binder: btoa('binderBC'),
    binded: btoa('bindedBC'),
    domain_caster: btoa('domainCaster'),
    domain_tryexit: btoa('domainTryexit'),
    domain_victim: btoa('domainVictim'),
    wind_pulse: btoa(`${capeActiveFx}-wind.pulse-0`)
  },
  saturationBuff: (/** @type {Player} */ player, /** @type {string} */ part) => {
    if (part === '?s' && player.hasTag(btoa(permissionSwitch.rarity.legendary))) {
      player.addEffect('saturation', TicksPerSecond * 256);
    } else if (part === '?s') {
      player.sendMessage('§cCannot apply saturation. Only available if you equipped a Legendary Cape.§r');
    };
  },
  custom: {
    bind_curse: (/** @type {Player} */ player, /** @type {{ name: string; }} */ effect, /** @type {any[]} */ buffCode) => {
      player.dimension.spawnParticle('visualcapes:bind_warp', player.location);
      player.sendMessage(`${capeBuff.effectNameDisplay(effect.name)} Buff applied successfully!`);
      player.removeTag(btoa(buffCode.join('-')));
      capeBuff.saturationBuff(player, buffCode[4]);
      player.playSound('visualcapes.respawn_anchor.charge2', { volume: 1000, pitch: 0.7, location: player.location });
      world.getDimension(player.dimension.id.replace('minecraft:', '')).getEntities({ location: player.location, maxDistance: 32 }).forEach(e => {
        if (e === player) {
          e.addTag(capeBuff.variables.binder);
        } else if (e !== player && !e.hasTag(capeBuff.variables.binder)) {
          e.addTag(capeBuff.variables.binded);
          e.dimension.spawnParticle('visualcapes:bind_effect', e.location);
        };
      });
    },
    instant_recover: (/** @type {Player} */ player, /** @type {{ name: string; }} */ effect, /** @type {any[]} */ buffCode) => {
      player.addEffect('health_boost', TicksPerSecond * 90, { amplifier: 244, showParticles: true });
      player.addEffect('instant_health', TicksPerSecond * 90, { amplifier: 255, showParticles: false });
      player.addEffect('regeneration', TicksPerSecond * 90, { amplifier: 255, showParticles: true });
      player.dimension.spawnParticle('visualcapes:instant_recover_buff', player.location);
      player.sendMessage(`${capeBuff.effectNameDisplay(effect.name)} Buff applied successfully!`);
      player.removeTag(btoa(buffCode.join('-')));
      capeBuff.saturationBuff(player, buffCode[4]);
      player.playSound('visualcapes.respawn_anchor.charge2', { volume: 1000, location: player.location });
    },
    nether_domain: (/** @type {Player} */ player, /** @type {{ name: any; }} */ effect, /** @type {any[]} */ buffCode) => {
      player.sendMessage(`${capeBuff.effectNameDisplay(effect.name)} applied successfully!`);
      player.removeTag(btoa(buffCode.join('-')));
      capeBuff.saturationBuff(player, buffCode[4]);
      const playerPrevDim = player.dimension.id;
      world.getAllPlayers().filter(p => p.dimension.id === playerPrevDim).forEach(p => {
        const distance = hypotXYZ(player.location, p.location);
        if (distance <= 16) {
          p.dimension.spawnParticle('visualcapes:domain_portal', p.location);
          p.teleport({ x: p.location.x, y: 128, z: p.location.z }, {
            dimension: world.getDimension('nether'),
            keepVelocity: false, rotation: p.getRotation()
          });
          void system.runTimeout(() => {
            if (p === player) {
              p.addTag(capeBuff.variables.domain_caster);
            } else {
              p.addTag(capeBuff.variables.domain_victim);
            };
          }, TicksPerSecond * 5);
        };
      });
    },
    self_destruct: (/** @type {Player} */ player, /** @type {{ name: any; }} */ effect, /** @type {any[]} */ buffCode) => {
      player.sendMessage(`${capeBuff.effectNameDisplay(effect.name)} executed successfully!`);
      player.removeTag(btoa(buffCode.join('-')));
      const explodePos = { x: player.location.x, y: player.location.y + 1.1, z: player.location.z };
      player.dimension.spawnParticle('visualcapes:self_destruct', explodePos);
      player.dimension.getEntities({ location: player.location, maxDistance: 25, excludeFamilies: ["inanimate", "player"] }).forEach((/** @type {Entity} */ e) => {
        // @ts-ignore
        e.applyDamage(1500, { cause: 'blockExplosion', damagingEntity: player });
      });
      world.getAllPlayers().filter(p => p.dimension.id === player.dimension.id && hypotXYZ(player.location, p.location) <= 100).forEach(psd => {
        const radius = hypotXYZ(explodePos, psd.location);
        if (radius <= 25) {
          psd.playSound('ambient.weather.lightning.impact', { volume: 1000, pitch: 0.5, location: psd.location });
          if (psd === player) {
            psd.kill();
            Achievement.grant(permissionSwitch.achievement.sacrifice, 3, player, (/** @type {any} */ achTag) => {
              if (player.getDynamicProperty(achTag) !== true) return true;
              return false;
            });
          }
          // @ts-ignore
          else psd.applyDamage(750, { cause: 'entityExplosion', damagingEntity: player });
        };
        psd.playSound('visualcapes.thunder', { volume: 1, pitch: 1.3, location: psd.location });
        void system.runTimeout(() => {
          world.getAllPlayers().filter(p => hypotXYZ(explodePos, p.location) <= 50).forEach(afx => {
            afx.applyKnockback({ x: Math.random() * 2, z: Math.random() * 2 }, 0);
            afx.setOnFire(1800, true);
          });
        }, TicksPerSecond);
      });
    },
    wind_pulse: (/** @type {Player} */ player, /** @type {{ name: any; }} */ effect, /** @type {any[]} */ buffCode) => {
      player.sendMessage(`${capeBuff.effectNameDisplay(effect.name)} Buff applied successfully!`);
      player.removeTag(btoa(buffCode.join('-')));
      player.addTag(capeBuff.variables.wind_pulse);
      capeBuff.saturationBuff(player, buffCode[4]);
    }
  },
  register: (/** @type {Player} */ player, /** @type {import('./constants.js').CapeData} */ cape, /** @type {any} */ triggerBuffs) => {
    if (!raritySystem.survival_tweaks || !triggerBuffs || cape.rarity_value <= 0) return -1;
    const tags = player.getTags();
    const buffTags = tags.filter((/** @type {any} */ tag) => atob(tag).startsWith('buff-')).map((/** @type {any} */ tag) => atob(tag).split('-'));
    const infBuffTags = tags.filter((/** @type {any} */ tag) => atob(tag).startsWith(capeActiveFx + '-')).map((/** @type {any} */ tag) => atob(tag).split('-'));
    for (let buffCode of buffTags) {
      if (cape.rarity_value === parseInt(buffCode[1]) + 1) {
        const effect = capeBuff.effects.find(e => e.type === buffCode[2]);
        if (!effect) continue;
        if (!player.hasTag(btoa(permissionSwitch.rarity.legendary)) && effect.legendarybuff !== false) {
          player.sendMessage(`§cUnable to apply ${capeBuff.effectNameDisplay(effect.name)} [Legendary Buff].§r`);
        } else if (player.hasTag(btoa(permissionSwitch.rarity.legendary)) && effect.legendarybuff === 'custom') {
          if (inventoryCheckItem(player, "minecraft:heavy_core", 1)) {
            inventoryCheckItem.call({ take: true }, player, "minecraft:heavy_core", 1);
            switch (effect.type) {
              case 'curse.bind':
                capeBuff.custom.bind_curse(player, effect, buffCode);
                break;
              case 'instant.recover':
                capeBuff.custom.instant_recover(player, effect, buffCode);
                break;
              case 'nether.domain':
                capeBuff.custom.nether_domain(player, effect, buffCode);
                break;
              case 'self.ignition':
                capeBuff.custom.self_destruct(player, effect, buffCode);
                break;
              case 'wind.pulse':
                capeBuff.custom.wind_pulse(player, effect, buffCode);
                break;
              default:
                player.sendMessage('§cCustom Buff does not exist.§r');
            };
          } else {
            player.sendMessage(`§c${capeBuff.effectNameDisplay(effect.name)} requires Heavy Core to apply its effect.§r`);
          };
        } else {
          player.addEffect(buffCode[2].replace(/\./g, '_'), TicksPerSecond * 60, { amplifier: parseInt(buffCode[3]), showParticles: true });
          player.sendMessage(`x${parseInt(buffCode[3]) + 1} ${capeBuff.effectNameDisplay(effect.name)} Buff applied successfully!`);
          player.removeTag(btoa(buffCode.join('-')));
          player.addTag(btoa(`${capeActiveFx}-${buffCode[2]}-${buffCode[3]}`));
          capeBuff.saturationBuff(player, buffCode[4]);
        };
      };
      Achievement.grant(permissionSwitch.achievement.first_buff, 1, player, (/** @type {any} */ achTag) => {
        if (player.getDynamicProperty(achTag) !== true) return true;
        return false;
      });
      for (let infBuffCode of infBuffTags) {
        if (infBuffCode[1] === buffCode[2] && parseInt(infBuffCode[2]) < parseInt(buffCode[3])) {
          player.removeTag(btoa(infBuffCode.join('-')));
        };
      }
    }
    Achievement.grant(permissionSwitch.achievement.all_buffs, 3, player, (/** @type {any} */ achTag) => {
      if (player.getDynamicProperty(achTag) === true) return false;
      const buffArr = capeBuff.effects.filter(e => e.legendarybuff !== "custom").map(e => e.type);
      for (const buffArrI of buffArr) {
        let pt = player.getTags().filter((/** @type {any} */ t) => atob(t).startsWith(capeActiveFx + '-')).find((/** @type {any} */ t) => atob(t).includes(buffArrI));
        if (!pt) return false;
      }
      return true;
    }, "§d");
  }
};

// returns an array for rawtext values
// rawtext.format([...buffTagsDisplay(instanceof Player, 0|1)]);
/**
 * @param {Player} player
 * @param {number} buffData
 */
export function buffTagsDisplay(player, buffData) {
  if (!raritySystem.survival_tweaks) return [];
  let rawtextValues = [];
  let activeBuffs = ['§eActive Buffs:§r'];
  let buffTagsArray = [['§2Uncommon Rarity:§r'], ['§9Rare Rarity:§r'], ['§5Epic Rarity:§r'], ['§6Legendary Rarity:§r']];
  player.getTags().forEach((/** @type {any} */ tag) => {
    const tagSplit = atob(tag).split('-');
    if (tagSplit[0] === 'buff') {
      let effect = capeBuff.effects.find(e => e.type === tagSplit[2]);
      buffTagsArray[parseInt(tagSplit[1])].push(`- x${parseInt(tagSplit[3]) + 1} ${capeBuff.effectNameDisplay(effect.name)} ${tagSplit[4] === '?s' ? '+ Saturation' : ''}`);
    } else if (tagSplit[0] === capeActiveFx) {
      let effect = capeBuff.effects.find(e => e.type === tagSplit[1]);
      activeBuffs.push(`§7x${parseInt(tagSplit[2]) + 1} ${capeBuff.effectNameDisplay(effect.name)}`);
    };
  });
  let buffTagsList = buffTagsArray.filter(buffTags => buffTags.length > 1).map(buffTags => buffTags.join('\n'));
  if (buffData === 0 && buffTagsList.length > 0)
    rawtextValues.push(
      rawtext.text('\n\n'), formText.storedBuff,
      rawtext.text('\n' + buffTagsList.join('\n\n'))
    );
  if (buffData === 1 && activeBuffs.length > 1)
    rawtextValues.push(rawtext.text('\n\n' + activeBuffs.join('\n')));
  return rawtextValues;
}

/**
 * @param {boolean} removeCape - Whether to remove the cape.
 * @param {Object} options - The event or context object.
 * @param {Player} options.sender - The player sending the confirmation.
 * @param {Player} options.target - The player target.
 * @param {import('./constants.js').CapeData} cape - The cape data and instance properties.
 * @param {string | number | boolean} addBuffs - The buffer triggers or modifications to apply.
 */
export function sendConfirmationCape(removeCape, { sender, target }, cape, addBuffs) {
  const tagName = ['', '§2', '§9', '§5', '§6'];
  const v = cape.rarity_value;
  let formatEquipText = [
    rawtext.lang(`vcascript.form.sendpopup.equip${raritySystem.enabled ? ".rarity" : ''}`, [
      sender.name, cape.name, `[${tagName[v]}${rarityNames[v]}§r] ${cape.name}`
    ])
  ];
  if (addBuffs) {
    formatEquipText.push(
      rawtext.text(' '),
      rawtext.lang("vcascript.form.sendpopup.buff")
    )
  }
  const confirmCapeForm = new MessageFormData();
  if (removeCape) {
    confirmCapeForm
      .title(rawtext.lang("vcascript.form.sendpopup.unequip.title"))
      .body(rawtext.lang("vcascript.form.sendpopup.unequip", [sender.name]))
      .button1(buttonText.unequip)
      .button2(buttonText.reject);
  } else {
    confirmCapeForm
      .title(rawtext.lang("vcascript.form.sendpopup.equip.title", [cape.name]))
      .body(rawtext.format(formatEquipText))
      .button1(buttonText.equip)
      .button2(buttonText.reject);
  }
  confirmCapeForm.show(target).then(res => {
    // let fdbkTxt;
    const fdbkRaw = [
      rawtext.text("["),
      rawtext.lang("options.group.feedback"),
      rawtext.text("] ")
    ];
    if (res.selection === 1 || res.canceled) {
      sender.sendMessage(rawtext.format([
        ...fdbkRaw,
        rawtext.lang(`vcascript.message.${removeCape ? "un" : ''}equip.reject`, [ target.name ])
      ]));
    } else {
      if (removeCape) {
        registerCapeEquip.unsubscribe(target);
      } else {
        target.addTag(registerCapeEquip.consumeRarity(cape));
        registerCapeEquip.subscribe(target, cape, addBuffs);
      }
      sender.sendMessage(rawtext.format([
        ...fdbkRaw,
        rawtext.lang(`vcascript.message.${removeCape ? "un" : ''}equip.accept`, [ target.name, cape.name ])
      ]));
    }
  });
}

/**
 * @param {Player} player
 * @param {typeof import("./constants.js").VanillaCape} capeClass
 * @param {string | any[]} showCapes
 * @param {string} formName
 * @param {{ (player: Player): void; (player: Player): void; (player: Player): void; (player: Player): void; call?: any; }} prevForm
 */
export function capeRarityAccess(player, capeClass, showCapes, formName, prevForm) {
  const vsRarityCapes = new ActionFormData()
    .title('Capes Menu for ' + formName)
    .body(rawtext.format([
      capeClass.menuText(showCapes.length),
      ...buffTagsDisplay(player, 0)
    ]))
    .button(buttonText.back)
    .button(buttonText.unequip);
  for (let showCape of showCapes) {
    vsRarityCapes.button(showCape.name, showCape.icon);
  };
  vsRarityCapes.show(player).then(res => {
    if (res.canceled) return;
    else {
      const selectedCape = showCapes[res.selection - 2];
      if (res.selection === 1) registerCapeEquip.unsubscribe(player);
      else if (res.selection === 0) prevForm.call(undefined, player);
      else registerCapeEquip.subscribe(player, selectedCape, raritySystem.survival_tweaks);
      return;
    }
  });
}

/**
 * @param {Player} player
 * @param {import("@minecraft/server-ui").ModalFormResponse} res
 */
export function registerRewardFn(player, res) {
  if (res.canceled) return;
  const [rarVal, effVal, satr, level] = res.formValues.filter((/** @type {null} */ v) => v != null);
  const rarityCode = () => {
    // @ts-ignore
    return permissionSwitch.rarity[rarityNames.slice(1, -1).map(r => r.toLowerCase())[rarVal]];
  };
  const saturation = satr ? '-?s' : '';
  // @ts-ignore
  const effect = capeBuff.effects[effVal];
  // @ts-ignore
  const buffCode = `buff-${rarVal}-${effect.type}-${effect.maxLevel ? Math.floor((effect.maxLevel - 1) * (level * 0.1)) : level - 1}${saturation}`;
  /**
   * @param {number | null} [expBottles]
   * @param {number | null} [goldenApples]
   * @param {number | null} [enchantedApples]
   */
  const itemConvert = (expBottles, goldenApples, enchantedApples) => {
    let itemVariable = [expBottles ?? 0, goldenApples ?? 0, enchantedApples ?? 0];
    let state = true;
    for (let r = 0; r < 3; r++) {
      if (!itemVariable[r]) continue;
      state &&= inventoryCheckItem(player, itemsToRarity[r], itemVariable[r]);
    }
    if (state) {
      const takeItem = { take: true };
      inventoryCheckItem.call(takeItem, player, itemsToRarity[0], expBottles);
      if (goldenApples) inventoryCheckItem.call(takeItem, player, itemsToRarity[1], goldenApples);
      if (enchantedApples) inventoryCheckItem.call(takeItem, player, itemsToRarity[2], enchantedApples);
      player.addTag(btoa(rarityCode()));
      player.addTag(btoa(buffCode));
      player.sendMessage(messageText.rewardSuccess);
    } else {
      player.sendMessage(messageText.rewardInsufficient(expBottles, goldenApples, enchantedApples));
    }
  };
  if (level === 1 && rarVal === 0 && !satr && effect.legendarybuff === false) {
    itemConvert(16);
  } else if (+level <= 4 && rarVal === 1 && !satr && effect.legendarybuff === false) {
    itemConvert(32, 16);
  } else if (+level <= 7 && rarVal === 2 && !satr && effect.legendarybuff === false) {
    itemConvert(48, 64);
  } else if (+level <= 10 && rarVal === 3) {
    itemConvert(64, null, 16);
  } else {
    player.sendMessage(messageText.rewardMismatch);
  };
}

/**
 * @param {string} sortName
 * @param {any[]} showCapesList
 */
// @ts-ignore
export function operatorVisualCapesSortedForm({ player, selectedPlayer }, { _target, _addBuffs, _targetList }, sortName, showCapesList) {
  const buffTagsDisplaySelf = (/** @type {number} */ target, /** @type {any} */ player, /** @type {any} */ triggerBuffs) => {
    if (target > 0 || !triggerBuffs || !raritySystem.enabled || !raritySystem.survival_tweaks) return [];
    else return [
      rawtext.text("§f"), ...buffTagsDisplay(player, 1),
      rawtext.text("§f"), ...buffTagsDisplay(player, 0)
    ];
  };
  const vsCapesSortedMenu = new ActionFormData()
    .title('Capes List by ' + sortName)
    .body(rawtext.format([
      rawtext.lang("vcascript.form.menuoperator.target", [`\n> §e${_targetList[_target]}§r`]),
      ...buffTagsDisplaySelf(_target, player, _addBuffs)
    ]));
  showCapesList.forEach((/** @type {{ name: string | import("@minecraft/server").RawMessage; icon: string; }} */ cape) => {
    vsCapesSortedMenu.button(cape.name, cape.icon);
  });
  vsCapesSortedMenu.show(player).then(res => {
    if (res.canceled) return; // operatorVisualCapesMenu(player);
    const selectedCape = showCapesList[res.selection];
    if (_target === 0) {
      player.addTag(registerCapeEquip.consumeRarity(selectedCape));
      registerCapeEquip.subscribe(player, selectedCape, _addBuffs);
    } else sendConfirmationCape(false, { sender: player, target: selectedPlayer }, selectedCape, _addBuffs);
  });
}

console.log('"static.js" loaded successfully.');
