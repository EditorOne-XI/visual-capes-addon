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
import { rawtext, TheImmortalCape, permissionSwitch, endEntities, creativeBlocks, portalBlocks, formText, buttonText } from './constants.js';
import { Achievement, containsMatch, mapVarData, hypotXYZ, centeredXYZ, centeredXZ, btoa, tickCheck, scriptCheck, getDynamicProperties, registerCapeEquip } from './static.js';
import { ActionFormData, ModalFormData } from '@minecraft/server-ui';
import {
  world, system, TicksPerSecond,
  BlockPermutation, BlockVolume, ItemStack, MolangVariableMap, Player,
  EntityComponentTypes, EquipmentSlot, GameMode, ItemComponentTypes,
  EntityDieAfterEvent, EntityHurtAfterEvent, ItemUseAfterEvent, PlayerDimensionChangeAfterEvent, PlayerSpawnAfterEvent,
  EntityDamageCause
} from '@minecraft/server';
import { offset } from '../offset.js';

/**************************************************************************
 * I know you're sneaking to the source code o_0
 * This is our secret. Must gatekeep ;)
 * [This took me months to update this add-on, be kind]
 * 
 * NEW FEATURES:
 * 
 * God Cape (v2.1.0)
 * - Exclusive Deity Rarity Cape granted by killing players with Legendary Cape equipped.
 *   > If singleplayer, killing withers count...
 *   > Chance getting the reward between 45th to 300th kill.
 *   > Gives absolute invulnerability from any source of non-fatal damage.
 *   > Very sensitive to End related matter including Area Effect Cloud.
 * 
 * Void Cape (v2.5.0)
 * - Exclusive Deity Rarity Cape granted by surviving at the void's damage for 60 seconds.
 *   > If failed, it will be unobtainable.
 *   > Success grants the reward.
 *   > Gives absolute strength that can eliminate every entities.
 *   > Cuts your health entirely.
 * 
 * Thunderstorm Cape (v2.6.0)
 * - Exclusive Deity Rarity Cape granted by getting struck by lightning with 42 Lightning Rod in your inventory random slot.
 *   > Success grants the reward.
 *   > Gives Thunder Chaos to eliminate entities.
 *   > Cuts your health entirely.
 * 
 * All Deity Rarity Cape can cast "The Second Coming" that disables 
 * all positive abilities mentioned above during the event. Kills all entities
 * in the Overworld during this phase and stops after time reset.
 * 
 * NOTE: Buffs of these capes only works if you are equipping them.
 **************************************************************************/
let date;
const turnaroundByChance = new Map();
const voidPlayerMap = new Map();
const thunderstormPlayerMap = new Map();
const taMapValue = {
  animate: false, credit: 1, disabled: false
};
const elMapValue = {
  animate: false,
  isValid: true,
  portals: [ { x: 0.5, y: 70, z: 0.5 }, false, false ],
  voidSec: 0
};
const tsMapValue = {
  animate: false, disabled: false
};
const taDPvalues = ["vca:ta","vca:tas"];
const elDPvalues = [
  "vca:el", "vca:els",
  "vca:elp1", "vca:elp2", "vca:elp3"
];
const tsDPvalues = ["vca:ts"];

// Do not add or modify unless granted
const deityLocale = {
  transferCape: (/** @type {number} */ seconds) => {
    return rawtext.format([
      rawtext.lang("vcascript.message.gift.transfer", [`${seconds}`]),
      rawtext.text("...")
    ]);
  },
  noTarget: rawtext.lang("vcascript.message.gift.notarget"),
  tpNoLocation: rawtext.lang("vcascript.message.gift.teleport.nolocation"),
  settingsCancelled: rawtext.format([
    rawtext.text("§e"),
    rawtext.lang("vcascript.message.gift.settings.cancel"),
    rawtext.text("§r")
  ]),
  commandBadAxis: (/** @type {string} */ axis, /** @type {string} */ input) => {
    return rawtext.format([
      rawtext.text("§c"),
      rawtext.lang("vcascript.message.gift.command.badaxis", [`${axis}`, `${input}`]),
      rawtext.text("§r")
    ]);
  },
  voidTimeUp: (/** @type {string} */ seconds) => {
    return rawtext.lang("vcascript.message.gift.voidtimer", [`${seconds}`])
  },
  instantBreakFail: rawtext.format([
    rawtext.text("§c"),
    rawtext.lang("vcascript.message.gift.instantbreak.fail"),
    rawtext.text("...§r")
  ])
}

/**
 * @param {Player} player
 * @param {string | PlayerSpawnAfterEvent} eventData
 */
function theImmortalDataSync(player, eventData) {
  if (!(player instanceof Player) && eventData !== "sync") return;
  if (eventData instanceof PlayerSpawnAfterEvent || eventData === "reload") {
    // if (!eventData?.initialSpawn && eventData !== "reload") return;
    if (eventData instanceof PlayerSpawnAfterEvent && !eventData?.initialSpawn) return;
    const taData = getDynamicProperties.call({ filter: taDPvalues }, player);
    const elData = getDynamicProperties.call({ filter: elDPvalues }, player);
    const tsData = getDynamicProperties.call({ filter: tsDPvalues }, player);
    const taArr = Object.entries(taData);
    const elArr = Object.entries(elData);
    const tsArr = Object.entries(tsData);
    let dataBackup = false;
    if (taArr.length == 2) {
      turnaroundByChance.set(player.id, {
        animate: false,
        credit: taArr[1][1],
        disabled: taArr[0][1]
      });
      dataBackup = true;
    }
    if (elArr.length == 5) {
      voidPlayerMap.set(player.id, {
        animate: false,
        isValid: elArr[0][1],
        portals: [ elArr[2][1], elArr[3][1], elArr[4][1] ],
        voidSec: elArr[1][1]
      });
      dataBackup = true;
    }
    if (tsArr.length == 1) {
      thunderstormPlayerMap.set(player.id, {
        animate: false,
        disabled: tsArr[0]
      });
      dataBackup = true;
    }
    if (dataBackup) {
      date = new Date();
      console.log("Players' Data Restored at " + date.toDateString().replace(/\s/g, '-'));
    }
  }
  if (eventData === "sync") {
    let data;
    for (const iplyr of world.getAllPlayers()) {
      if (player && player !== iplyr) continue;
      data = mapVarData(iplyr, turnaroundByChance, taMapValue);
      iplyr.setDynamicProperties({
        [taDPvalues[0]]: data.disabled,
        [taDPvalues[1]]: data.credit
      });
      data = mapVarData(iplyr, voidPlayerMap, elMapValue);
      iplyr.setDynamicProperties({
        [elDPvalues[0]]: data.isValid,
        [elDPvalues[1]]: data.voidSec,
        [elDPvalues[2]]: data.portals[0],
        [elDPvalues[3]]: data.portals[1],
        [elDPvalues[4]]: data.portals[2]
      });
      data = mapVarData(iplyr, thunderstormPlayerMap, tsMapValue);
      iplyr.setDynamicProperties({
        [tsDPvalues[0]]: data.disabled
      });
    }
    scriptCheck(() => console.log("Players' Data Saved. (Sync data every 30 seconds)"));
  }
}

// function capeGiftWorldLoad(player) {
//   const tag1 = player.getDynamicProperty("");
// }

// God Cape - Killing Spree
/**
 * @param {Player} player
 */
async function grantTa(player) {
  let randChance = Math.floor(Math.random() * 255 + 44);
  let cTc = mapVarData(player, turnaroundByChance, taMapValue);
  let chanceRate = cTc.credit === 299 ? 299 : randChance;
  if (cTc.credit === chanceRate && !cTc.disabled) {
    cTc.disabled = true;
    player.sendMessage(deityLocale.transferCape(10));
    await system.waitTicks(200);
    player.addTag(btoa(permissionSwitch.rarity.deity));
    userReceiveCapeGift(player, 'turnaround');
  } else if (!cTc.disabled) {
    cTc.credit++;
  };
  scriptCheck(() => player.sendMessage(`§3[!] God Cape Credit: ${cTc.credit} && ${randChance} = ${cTc.credit === chanceRate}§r`));
};

// Void Cape - Resiliency
/**
  * @param {Player} player
  */
const voidEnterParticle = (player) => {
  let molang = new MolangVariableMap();
  molang.setFloat('variable.size', 0.3);
  molang.setFloat('variable.pull', 2.0);
  molang.setFloat('variable.invert', 1.0);
  molang.setFloat('variable.drag', 0.0);
  player.dimension.spawnParticle('visualcapes:void_terminate', player.location, molang);
};
/**
  * @param {Player} player
  */
const voidAttackParticle = (player) => {
  let molang = new MolangVariableMap();
  let waveMol = new MolangVariableMap();
  molang.setFloat('variable.size', 3.0);
  molang.setFloat('variable.pull', 0.1);
  molang.setFloat('variable.invert', -125.0);
  molang.setFloat('variable.drag', 1.0);
  waveMol.setFloat('variable.y_offset', 1.0);
  player.dimension.spawnParticle('visualcapes:void_terminate', player.location, molang);
  player.dimension.spawnParticle('visualcapes:explosion_wave', player.location, waveMol);
};
/**
  * @param {Player} player 
  */
async function voidTerminateFn(player) {
  if (player.getGameMode() === GameMode.Creative) return;
  voidEnterParticle(player);
  player.playSound("visualcapes.void_entrance", { volume: 3, location: player.location });
  player.setGameMode(GameMode.Spectator);
  const trail = system.runInterval(() => {
    player.dimension.spawnParticle("minecraft:basic_smoke_particle", {
      x: player.location.x,
      y: player.location.y + 1,
      z: player.location.z
    });
  }, 2);
  await system.waitTicks(200);
  // const duration = new Date();
  // duration.setSeconds(10);
  // while (Date.now() < duration.getTime());
  system.clearRun(trail);
  const targets = player.dimension.getEntities({
    excludeFamilies: ["inanimate"],
    location: player.location,
    maxDistance: 10
  });
  if (targets.length > 1) {
    targets.forEach(e => {
      if (e !== player) e.kill();
    });
    voidAttackParticle(player);
    world.getAllPlayers().filter(p => p.dimension.id === player.dimension.id && hypotXYZ(player.location, p.location) <= 30).forEach(p1 => {
      p1.camera.fade({
        fadeColor: { red: 1.0, green: 1.0, blue: 1.0 },
        fadeTime: { fadeInTime: 0, fadeOutTime: 10, holdTime: 1 }
      });
      p1.playSound("visualcapes.void_explosion.near", { volume: 1, location: p1.location });
    });
    world.getAllPlayers().filter(p => p !== player && p.dimension.id === player.dimension.id && hypotXYZ(player.location, p.location) > 30).forEach(p2 => {
      p2.playSound("visualcapes.void_explosion", { volume: 1, location: p2.location });
    });
    player.sendMessage("§dVoid Termination...§r");
  } else player.sendMessage(deityLocale.noTarget);
  player.setGameMode(GameMode.Survival);
  player.dimension.spawnParticle("visualcapes:quantum_smoke", player.location);
}
/**
  * @param {Player} player
  * @param {import("@minecraft/server").Dimension} setDimension
  * @param {import("@minecraft/server").Vector3} coordinates
  */
const quantumTeleport = (player, setDimension, coordinates) => {
  if (!coordinates) {
    player.sendMessage(deityLocale.tpNoLocation);
    return;
  };
  player.dimension.spawnParticle("visualcapes:quantum_smoke", player.location);
  player.teleport(coordinates, {
    checkForBlocks: true, dimension: setDimension, rotation: player.getRotation()
  });
};
/**
  * @param {Player} player
  */
const voidCastOption = (player) => {
  const voidBuffForm = new ActionFormData()
    .title("Cast a Void Ability?")
    .body("Choose an action to cast. Note that you need to specify a coordinate to each dimension first before using Quantum Portal.")
    .divider()
    .label(`Morph
§7Cast instantly by renaming the Nether Star as "Morph" then "use" it.`)
    .button("Void Terminate")
    .divider()
    .label(`Quantum Portal
§7Cast instantly by sneaking then \"use\" the Nether Star. This will instantly teleports you to the next dimension.`)
    .button("Overworld")
    .button("Nether")
    .button("The End")
    .button(buttonText.edit)
    .divider()
    .button(buttonText.exit);
  voidBuffForm.show(player).then(res => {
    if (res.canceled || res.selection == 5) return;
    let elData = mapVarData(player, voidPlayerMap, elMapValue);
    switch (res.selection) {
      case 0:
        voidTerminateFn(player);
        break;
      case 1:
        quantumTeleport(player, world.getDimension("overworld"), elData.portals[0]);
        break;
      case 2:
        quantumTeleport(player, world.getDimension("nether"), elData.portals[1]);
        break;
      case 3:
        quantumTeleport(player, world.getDimension("the_end"), elData.portals[2]);
        break;
      case 4:
        const quantumTpForm = new ModalFormData()
          .title("Quantum Portal Settings")
          .label("Choose a dimension then input your desired coordinates.")
          .dropdown("Dimension", ["Overworld", "Nether", "The End"], { defaultValueIndex: 0 })
          .textField("Coordinates", "x y z", { defaultValue: "0 70 0" })
          .submitButton("Save");
        quantumTpForm.show(player).then(res => {
          const [dimVal, xyzText] = res.formValues?.filter(v => v != null);
          let xyzArr = String(xyzText).split(' ');
          if (res.canceled || xyzArr.length != 3) return player.sendMessage(deityLocale.settingsCancelled);
          const xyzChar = ['x', 'y', 'z'];
          for (let i = 0; i < 3; i++) {
            let floatNum = parseFloat(xyzArr[i]);
            if (!isNaN(floatNum) || Math.abs(floatNum) < 16777216) continue;
            player.sendMessage(deityLocale.commandBadAxis(xyzChar[i], xyzArr[i]));
            return;
          };
          // @ts-ignore
          elData.portals[dimVal] = centeredXZ({
            x: parseFloat(xyzArr[0]),
            y: parseFloat(xyzArr[1]),
            z: parseFloat(xyzArr[2])
          });
        });
        break;
    };
  });
};

/**
 * @param {Player} player
 * @param {string | number} capeId
 */
export function userReceiveCapeGift(player, capeId) {
  const cape = TheImmortalCape[capeId];
  const bodyText = rawtext.format([
    formText.giftUnlocked,
    rawtext.text("\n\n"),
    formText.storedBuff,
    formText.buffHidden,
    rawtext.text("\n§c§lDeity Rarity:§r\n"),
    rawtext.text(cape.buffsText.join('\n'))
  ]);
  const userGift = new ActionFormData()
    .title("Visual Capes Gift")
    .body(bodyText)
    .button(buttonText.reject)
    .button(cape.name, cape.icon);
  userGift.show(player).then(res => {
    if (res.canceled || res.selection === 0) return;
    if (res.selection === 1) registerCapeEquip.subscribe(player, cape, false);
  });
};

function theImmortalFunction() {
  let giftedPlayers = world.getAllPlayers();
  giftedPlayers.forEach(player => {
    if (tickCheck(TicksPerSecond * 30)) theImmortalDataSync(undefined, "sync");
    let id = player.getComponent(EntityComponentTypes.MarkVariant);
    if (tickCheck(10) && player.getGameMode() == GameMode.Survival && player.hasTag(btoa(permissionSwitch.legendaryTag))) {
      const validYaxis = player.dimension.id === 'minecraft:overworld' ? -82 : -18;
      let posY = player.location.y;
      let voidTime = mapVarData(player, voidPlayerMap, elMapValue);
      if (posY <= validYaxis && voidTime.isValid) {
        if (voidTime.voidSec < 1) {
          player.playSound("visualcapes.void_entrance", { volume: 1, location: player.location });
        };
        if (voidTime.voidSec >= TicksPerSecond * 60) {
          player.sendMessage(deityLocale.voidTimeUp(`§e${(voidTime.voidSec / TicksPerSecond).toFixed(2)}s§r`))
          const voidToLand = () => {
            if (player.getSpawnPoint()) {
              let { x, y, z } = player.getSpawnPoint();
              return { x: x, y: y, z: z };
            } else return { x: 0, y: 70, z: 0 };
          };
          player.teleport(centeredXYZ(voidToLand()), {
            checkForBlocks: true,
            dimension: player.getSpawnPoint() ? player.getSpawnPoint().dimension : world.getDimension('overworld'),
            rotation: { x: 0, y: 0 }
          });
          voidTime.isValid = false;
          player.sendMessage(deityLocale.transferCape(10));
          void system.runTimeout(() => {
            player.addTag(btoa(permissionSwitch.rarity.deity));
            userReceiveCapeGift(player, 'eclipse');
          }, TicksPerSecond * 10);
        };
        if (voidTime.isValid) {
          voidTime.voidSec += 10;
          player.onScreenDisplay.setActionBar(`§5Void Timer: §d${(voidTime.voidSec / TicksPerSecond).toFixed(2)}s§r`);
        };
      } else if (voidTime.voidSec > 0 && voidTime.isValid) {
        voidTime.isValid = false;
        player.sendMessage("Void Resistance faded...");
        player.onScreenDisplay.setActionBar(`Void Seconds Ended: ${(voidTime.voidSec / TicksPerSecond).toFixed(2)}s`);
      }
    };
    if (!id || id?.value - offset > -1000) return;
    let mainhand = player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand);
    let health = player.getComponent(EntityComponentTypes.Health);
    switch (id.value - offset) {
      case -1002:
        if (tickCheck(TicksPerSecond * 10)) {
          const tsData = mapVarData(player, thunderstormPlayerMap, tsMapValue);
          player.addEffect('fire_resistance', TicksPerSecond * 15, { amplifier: 255, showParticles: false });
          player.dimension.getEntities({ excludeFamilies: ['inanimate', 'player', 'villager'], location: player.location, maxDistance: 30 }).forEach(e => e.dimension.spawnEntity('minecraft:lightning_bolt', e.location));
          if (hypotXYZ(player.getVelocity(), { x: 0, y: 0, z: 0 }) == 0 && !tsData.animate) {
            tsData.animate = true;
            void system.runTimeout(() => {
              player.playAnimation('animation.player.thunderstorm.idle', { players: world.getAllPlayers(), stopExpression: "query.is_moving" });
              tsData.animate = false;
            }, TicksPerSecond * 5);
          } else {
            tsData.animate = false;
          };
        }
        if (health && health?.currentValue > 5) {
          health?.setCurrentValue(5);
        };
        break;
      case -1001:
        if (tickCheck(TicksPerSecond * 10)) {
          const taData = mapVarData(player, turnaroundByChance, taMapValue);
          player.addEffect('resistance', TicksPerSecond * 15, { amplifier: 255, showParticles: false });
          if (mainhand?.typeId === 'minecraft:end_crystal' && player.isSneaking) {
            player.dimension.spawnParticle('visualcapes:end_cystalist', player.location);
            void system.runTimeout(() => {
              player.dimension.getEntities({ excludeFamilies: ['inanimate'], location: player.location, maxDistance: 25 }).forEach(nearby => {
                if (nearby !== player && nearby.typeId !== 'minecraft:item') {
                  nearby.dimension.createExplosion(nearby.location, 6, {
                    allowUnderwater: true,
                    breaksBlocks: false,
                    causesFire: true,
                    source: player
                  });
                  // @ts-ignore
                  nearby.applyDamage(250, { cause: 'entityExplosion', damagingEntity: player });
                };
              });
              player.addEffect('night_vision', TicksPerSecond);
            }, TicksPerSecond * 3);
          };
          if (hypotXYZ(player.getVelocity(), { x: 0, y: 0, z: 0 }) == 0 && !taData.animate) {
            taData.animate = true;
            void system.runTimeout(() => {
              player.playAnimation('animation.player.turnaround.idle', { players: world.getAllPlayers(), stopExpression: "query.is_moving" });
              taData.animate = false;
            }, TicksPerSecond * 5);
          } else {
            taData.animate = false;
          };
        };
        break;
      case -1000:
        const elData = mapVarData(player, voidPlayerMap, elMapValue);
        if (tickCheck(TicksPerSecond * 10)) {
          player.addEffect('strength', TicksPerSecond * 15, { amplifier: 255, showParticles: false });
          if (hypotXYZ(player.getVelocity(), { x: 0, y: 0, z: 0 }) == 0 && !elData.animate) {
            elData.animate = true;
            void system.runTimeout(() => {
              player.playAnimation('animation.player.eclipse.idle', { players: world.getAllPlayers(), stopExpression: "query.is_moving" });
            }, TicksPerSecond * 5);
          } else {
            elData.animate = false;
          };
        };
        if (health && health?.currentValue > 5) {
          health?.setCurrentValue(5);
        };
        break;
    }
  });
};

/**
 * @param {import("@minecraft/server").Entity} player
 * @param {ItemUseAfterEvent | EntityHurtAfterEvent | EntityDieAfterEvent} eventData
 */
function turnaroundChallenge(player, eventData) {
  if (!(player instanceof Player) || (player instanceof Player && !player.hasTag(btoa(permissionSwitch.legendaryTag)))) return;
  const players = world.getAllPlayers();
  let id = player.getComponent(EntityComponentTypes.MarkVariant);

  if (eventData instanceof EntityDieAfterEvent) {
    let { deadEntity } = eventData;
    let { damagingEntity } = eventData.damageSource;
    if (!(damagingEntity instanceof Player)) return;
    if (
      (players.length > 1 && deadEntity.hasTag(btoa(permissionSwitch.legendaryTag))) ||
      (players.length === 1 && deadEntity.typeId === "minecraft:wither")
    ) grantTa(damagingEntity);

    if (id?.value - offset == -1001 && theImmortalFnLoop !== -1) {
      if (damagingEntity instanceof Player) Achievement.grant(permissionSwitch.achievement.deity_weakness, 1, damagingEntity, (achTag) => {
        if (player.getDynamicProperty(achTag) !== true) return true;
        return false;
      });
      Achievement.grant(permissionSwitch.achievement.deity_weakness, 1, player, (achTag) => {
        if (player.getDynamicProperty(achTag) !== true) return true;
        return false;
      });
    }
  };

  if (eventData instanceof EntityHurtAfterEvent) {
    let { hurtEntity } = eventData;
    let { damagingEntity, damagingProjectile } = eventData.damageSource;
    const source = damagingProjectile ?? damagingEntity;
    if (theImmortalFnLoop !== -1 && source && id?.value - offset == -1001 && containsMatch(source.typeId, endEntities)) {
      hurtEntity.kill();
      hurtEntity.dimension.createExplosion(hurtEntity.location, 8, {
        allowUnderwater: true,
        breaksBlocks: true,
        causesFire: true,
        source: hurtEntity
      });
    };
  };

  if (eventData instanceof ItemUseAfterEvent) {
    let { itemStack } = eventData;
    if (theImmortalFnLoop !== -1 && id?.value - offset == -1001 && itemStack?.typeId == "minecraft:netherite_pickaxe") {
      let ench = itemStack.getComponent(ItemComponentTypes.Enchantable);
      let isSilkTouch = ench?.hasEnchantment("silk_touch");
      let ray = player.getBlockFromViewDirection({ maxDistance: 6 });
      let block = ray?.block;
      if (!block || !isSilkTouch) return;
      if (containsMatch(block.typeId, [...creativeBlocks, ...portalBlocks])) {
        let mainhand = player.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
        mainhand.setItem(undefined);
        player.playSound("random.break", { volume: 1, pitch: 0.9, location: player.location });
        player.sendMessage(deityLocale.instantBreakFail);
        return;
      }
      let blockLoc = centeredXZ(block.location);
      let blockToItem = new ItemStack(block.typeId, 1);
      block.setType("minecraft:air");
      block.dimension.spawnParticle("visualcapes:cape_sparkle_block_break", blockLoc);
      player.playSound("random.fizz", { volume: 2, pitch: Math.random() * 0.2 + 2.4, location: blockLoc });
      block.dimension.spawnItem(blockToItem, blockLoc);
    }
  }
};

/**
 * @param {import("@minecraft/server").Entity} player
 * @param {ItemUseAfterEvent | EntityDieAfterEvent | PlayerDimensionChangeAfterEvent} eventData
 */
function eclipseChallenge(player, eventData) {
  if (!(player instanceof Player) || (player instanceof Player && !player.hasTag(btoa(permissionSwitch.legendaryTag)))) return;
  let id = player.getComponent(EntityComponentTypes.MarkVariant);

  if (eventData instanceof EntityDieAfterEvent) {
    let { cause, damagingEntity } = eventData.damageSource;
    const elData = mapVarData(player, voidPlayerMap, elMapValue);

    if (cause == "void" && elData.isValid) {
      elData.isValid = false;
      player.sendMessage("Void Resistance faded...");
      player.onScreenDisplay.setActionBar(`Void Seconds Ended: ${(elData.voidSec / TicksPerSecond).toFixed(2)}s`);
    };

    const heightLimitsSafe = player.dimension.id == "minecraft:overworld" ? { below: -63, above: 319 } : { below: 1, above: 127 };
    if (theImmortalFnLoop !== -1 && id?.value - offset == -1000 && player.location.y > heightLimitsSafe.below && player.location.y < heightLimitsSafe.above) {
      let pos = player.location;
      const twoBlocks = new BlockVolume(
        { x: pos.x, y: pos.y, z: pos.z },
        { x: pos.x, y: pos.y + 1, z: pos.z }
      );
      player.dimension.fillBlocks(twoBlocks, "minecraft:end_gateway", {
        blockFilter: { includeTypes: ["minecraft:air"] },
        ignoreChunkBoundErrors: true
      });
    };

    if (theImmortalFnLoop !== -1 && id?.value - offset == -1000) {
      if (damagingEntity instanceof Player) Achievement.grant(permissionSwitch.achievement.deity_weakness, 1, damagingEntity, (achTag) => {
        if (player.getDynamicProperty(achTag) !== true) return true;
        return false;
      });
      Achievement.grant(permissionSwitch.achievement.deity_weakness, 1, player, (achTag) => {
        if (player.getDynamicProperty(achTag) !== true) return true;
        return false;
      });
    }
  };

  if (eventData instanceof ItemUseAfterEvent) {
    let { itemStack } = eventData;
    if (theImmortalFnLoop !== -1 && id?.value - offset == -1000 && itemStack?.typeId === "minecraft:nether_star") {
      if (!player.isSneaking && itemStack?.nameTag != "Morph") return voidCastOption(player);
      if (!player.isSneaking) return voidTerminateFn(player);
      const elData = mapVarData(player, voidPlayerMap, elMapValue);
      let dimArr = ["overworld", "nether", "the_end"];
      let pDim = player.dimension.id.replace("minecraft:", '');
      let index = (dimArr.findIndex(d => d === pDim) + 1) % dimArr.length;
      quantumTeleport(player, world.getDimension(dimArr[index]), elData.portals[index]);
    };
  };

  if (eventData instanceof PlayerDimensionChangeAfterEvent) {
    let { toDimension, toLocation } = eventData;
    if (theImmortalFnLoop !== -1 && id?.value - offset == -1000) {
      toDimension.spawnParticle("visualcapes:quantum_smoke", toLocation);
      player.playSound("visualcapes.portal", { volume: 1, location: toLocation });
    };
  };
};

/**
 * @param {import("@minecraft/server").Entity} player
 * @param {EntityHurtAfterEvent | EntityDieAfterEvent} eventData
 */
function thunderstormChallenge(player, eventData) {
  if (!(player instanceof Player) || (player instanceof Player && !player.hasTag(btoa(permissionSwitch.legendaryTag)))) return;
  let id = player.getComponent(EntityComponentTypes.MarkVariant);
  
  if (eventData instanceof EntityHurtAfterEvent) {
    let { damageSource, hurtEntity } = eventData;

    if (
      id?.value - offset !== -1002 &&
      hurtEntity instanceof Player &&
      hurtEntity.hasTag(btoa(permissionSwitch.legendaryTag)) &&
      damageSource.cause === EntityDamageCause.lightning
    ) {
      let inv = hurtEntity.getComponent("minecraft:inventory");
      let container = inv?.container;
      if (!container) return;
      let magicItem = container.getSlot(Math.floor(Math.random() * 35)).getItem();
      const tsData = mapVarData(hurtEntity, thunderstormPlayerMap, tsMapValue);
      if (magicItem?.typeId === "minecraft:waxed_weathered_lightning_rod" && magicItem?.amount === 42 && !tsData.disabled) {
        tsData.disabled = true;
        hurtEntity.sendMessage(deityLocale.transferCape(10));
        void system.runTimeout(() => {
          hurtEntity.addTag(btoa(permissionSwitch.rarity.deity));
          userReceiveCapeGift(hurtEntity, 'thunderstorm');
        }, TicksPerSecond * 10);
      }
    }

    if (damageSource.damagingEntity && damageSource.damagingEntity === player && id?.value - offset === -1002) {
      let initial = hurtEntity.getDynamicProperty("vca:tsdtk");
      if (typeof initial === 'number' && initial >= 9) {
        hurtEntity.setDynamicProperty("vca:tsdtk", 0);
        const finalPos = hurtEntity.location;
        const dim = hurtEntity.dimension;
        void hurtEntity.addEffect('slowness', TicksPerSecond * 6, { amplifier: 255, showParticles: false });
        dim.spawnParticle("visualcapes:fire_spiral", finalPos);
        void system.runTimeout(() => {
          dim.getPlayers().forEach(p => p.dimension.playSound("item.trident.thunder", p.location, { pitch: 1, volume: 1000 }));
          dim.getEntities({ location: finalPos, maxDistance: 8 }).forEach(e => {
            e.kill();
          });
          try {
            const spread = new BlockVolume(
              { x: finalPos.x - 4, y: finalPos.y, z: finalPos.z - 4 },
              { x: finalPos.x + 4, y: finalPos.y, z: finalPos.z + 4 }
            );
            dim.fillBlocks(spread, BlockPermutation.resolve("minecraft:fire", { age: 0 }), { ignoreChunkBoundErrors: true, blockFilter: { includeTypes: ['minecraft:air'] } });
          } catch (err) {}
        }, TicksPerSecond * 5);
        return;
      }
      hurtEntity.setDynamicProperty(
        "vca:tsdtk",
        typeof initial !== 'number' ? 1 : initial + 1
      );
    }
  }

  if (eventData instanceof EntityDieAfterEvent) {
    let { deadEntity } = eventData;

    if (deadEntity === player && id?.value - offset === -1002) {
      deadEntity.dimension.getEntities({ location: deadEntity.location, maxDistance: 64 }).forEach(async (e) => {
        try {
          if (e instanceof Player) e.sendMessage(rawtext.lang("chat.type.text", [`${e.name}`, "§k§4Illumina the Goddess, you may tore these lives apart with the granted power I conquer.§r"]));
          await system.waitTicks(TicksPerSecond);
          e.dimension.spawnEntity("minecraft:lightning_bolt", e.location);
          e.setOnFire(TicksPerSecond * 86400);
          e.addEffect("slowness", TicksPerSecond * 86400, { amplifier: 255, showParticles: true });
          e.addEffect("wither", TicksPerSecond * 86400, { amplifier: 2, showParticles: true });
        } catch (e) {}
      })
    }
  }
}

var theImmortalFnLoop = -1;
if (raritySystem.survival_tweaks) {
  theImmortalFnLoop = system.runInterval(() => {
    theImmortalFunction();
  }, 1);
}

let raptureTicks = 2;
var tscItvl;
/**
 * @param {{ player: Player }} ev
 */
function theSecondComingFn(ev) {
  const { player } = ev;
  const id = player.getComponent(EntityComponentTypes.MarkVariant);
  if (id?.value - offset <= -1000) {
    if (theImmortalFnLoop !== -1) {
      system.clearRun(theImmortalFnLoop);
      theImmortalFnLoop = -1;
    }
    const overworldDim = world.getDimension("overworld");
    const dayThousands = 24000 * 777;
    if (world.getAbsoluteTime() < dayThousands)
    world.setAbsoluteTime(dayThousands);
    world.sendMessage("§eThe Second Coming has begun.§r");
    tscItvl = system.runInterval(() => {
      const absTime = world.getAbsoluteTime();
      void overworldDim.runCommand(`time add -${raptureTicks}`);
      if (tickCheck(10) && raptureTicks >= 8192) {
        overworldDim.getEntities().forEach(e => {
          // @ts-ignore
          e.applyDamage(8, { cause: "void" });
        });
      }
      if (tickCheck(TicksPerSecond * 10) && raptureTicks < 8192) {
        raptureTicks *= 2;
      }
      if (tickCheck(200)) {
        world.getAllPlayers().filter(p => p.dimension.id === "minecraft:overworld").forEach(p => {
          p.playSound("elytra.loop", { volume: 1, location: p.location });
        });
      }
      if (absTime <= raptureTicks) {
        void overworldDim.runCommand("time set 0");
        void overworldDim.runCommand("stopsound @a elytra.loop");
        world.sendMessage("§eThe Second Coming ended.§r");
        raptureTicks = 2;
        system.clearRun(tscItvl);
        theImmortalFnLoop = system.runInterval(() => {
          theImmortalFunction(); 
        }, 1);
        world.afterEvents.playerEmote.subscribe(theSecondComingFn);
      }
    }, 1);
    world.afterEvents.playerEmote.unsubscribe(theSecondComingFn);
  }
}

if (raritySystem.survival_tweaks) {
  TheImmortalCape.setup();
  world.afterEvents.worldLoad.subscribe(() => {
    let plyrs = world.getAllPlayers();
    if (plyrs?.length > 0) {
      for (const p of plyrs) theImmortalDataSync(p, "reload");
    }
  });
  world.afterEvents.entityDie.subscribe(ev => {
    turnaroundChallenge(ev.damageSource.damagingEntity, ev);
    eclipseChallenge(ev.deadEntity, ev);
    thunderstormChallenge(ev.deadEntity, ev);
    // @ts-ignore
    theImmortalDataSync(ev.deadEntity, "sync");
  });
  world.afterEvents.entityHurt.subscribe(ev => {
    turnaroundChallenge(ev.hurtEntity, ev);
    thunderstormChallenge(ev.damageSource.damagingEntity ?? ev.hurtEntity, ev);
  });
  world.afterEvents.itemUse.subscribe(ev => {
    turnaroundChallenge(ev.source, ev);
    eclipseChallenge(ev.source, ev);
  });
  world.afterEvents.playerDimensionChange.subscribe(ev => {
    eclipseChallenge(ev.player, ev);
  });
  world.afterEvents.playerEmote.subscribe(theSecondComingFn);
  world.afterEvents.playerSpawn.subscribe(ev => {
    theImmortalDataSync(ev.player, ev);
  });
  world.beforeEvents.playerLeave.subscribe(ev => {
    theImmortalDataSync(ev.player, "sync");
  });
};

// export { turnaroundByChance, voidPlayerMap, thunderstormPlayerMap };
console.log('"deity.js" loaded successfully.');
