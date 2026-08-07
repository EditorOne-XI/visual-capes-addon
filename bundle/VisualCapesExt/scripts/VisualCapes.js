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
import { ActionFormData, MessageFormData, ModalFormData } from '@minecraft/server-ui';
import { world, system, TicksPerSecond, Entity, EntityComponentTypes, EntityDamageCause, EquipmentSlot, ItemStack, Player, WeatherType, CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus } from '@minecraft/server';
import { raritySystem } from './config.js';
import { rawtext, VanillaCape, CustomCape, AprilFoolsCape, permissionSwitch, rarityNames, vcaProperties, damageCauseByTick, notGameModes, formText, buttonText, messageText, cmdPlayerOnly } from './common/constants.js';
import { Achievement, getErrorMessage, containsMatch, sortByName, sortByRarity, visualCapesInfo, itemAuxCmd, mapVarData, hypotXYZ, centeredXZ, btoa, atob, tickCheck, commandFail, scriptCheck, accessFilter, worldData, getEntityName, getDynamicProperties, registerCapeEquip, capeActiveFx, capeBuff, buffTagsDisplay, sendConfirmationCape, capeRarityAccess, registerRewardFn, operatorVisualCapesSortedForm } from './common/static.js';

/**
 * @param {Player} player
 */
function visualCapesStartup(player) {
  const visualCapesStu = new ActionFormData()
    .title('Welcome to Visual Capes Add-on')
    .body(formText.startup)
    .button(buttonText.info)
    .button(buttonText.start)
    .button(buttonText.skip);
  visualCapesStu.show(player).then(res => {
    if (res.canceled) {
      const visualCapesStuCancel = new MessageFormData()
        .title(buttonText.canceledTitle)
        .body(formText.canceledNote)
        .button1(buttonText.goBack)
        .button2(buttonText.exit);
      visualCapesStuCancel.show(player).then(res => {
        if (res.selection == 1 || res.canceled) {
          player.addTag(btoa(permissionSwitch.canceledMenu));
          player.sendMessage(messageText.canceledMessage);
          let mainhand = player.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
          mainhand.setItem(undefined);
        } else return visualCapesStartup(player);
      });
    };
    switch (res.selection) {
      case 0:
        visualCapesInfo(player, visualCapesStartup);
        break;
      case 1:
        player.addTag(btoa(permissionSwitch.startup));
        visualCapesStart(player);
        break;
      case 2:
        player.addTag(btoa(permissionSwitch.startup));
        player.addTag(btoa(permissionSwitch.skipStartup));
        visualCapesMenu(player);
        break;
    };
  });
};

/**
 * @param {Player} player
 */
function visualCapesStart(player) {
  const visualCapesStartForm = new ActionFormData()
    .title('Start with your first cape!')
    .body(formText.starterCapes)
    .button(buttonText.none);
  let showCapes = VanillaCape.list.filter(cape => cape.rarity_value === 2);
  for (let showCape of showCapes) {
    visualCapesStartForm.button(showCape.name, showCape.icon);
  };
  visualCapesStartForm.show(player).then(res => {
    if (res.canceled) return;
    const selectedCape = showCapes[res.selection - 1];
    if (res.selection === 0) {
      player.triggerEvent('capes:remove_cape');
    } else {
      player.triggerEvent(selectedCape.type);
      world.sendMessage(`§e${player.name}§f picked the §9${selectedCape.name}§f from the starter capes.§f`);
      Achievement.grant(permissionSwitch.achievement.starter, 1, player, (/** @type {any} */ achTag) => {
        if ((player.getDynamicProperty(achTag) === true) ||
          (player.hasTag(btoa(permissionSwitch.skipStartup)) ||
          player.hasTag(btoa(permissionSwitch.canceledMenu)))
        ) return false;
        return true;
      });
    };
  });
};

/**
 * @param {Player} player
 */
function visualCapesMenu(player) {
  const visualCapesMenuForm = new ActionFormData()
    .title('Visual Capes Menu')
    .body(formText.visualCapesMenu(buffTagsDisplay(player, 1)))
    .button(buttonText.info)
    .button('Vanilla')
    .button('Custom')
    .button('April Fools');
  visualCapesMenuForm.show(player).then(res => {
    if (res.canceled) return;
    switch (res.selection) {
      case 0:
        visualCapesInfo(player, visualCapesMenu);
        break;
      case 1:
        const vanillaCpsLst = VanillaCape.list.filter(cape => accessFilter(player, cape));
        capeRarityAccess(player, VanillaCape, vanillaCpsLst, 'Vanilla', visualCapesMenu);
        break;
      case 2:
        /**
             * @param {Player} player
             */
        function visualCustomCapesSection(player) {
          const vsCustomCapesSec = new ActionFormData()
            .title('Visual Capes Custom Menu')
            .body(CustomCape.menuText(CustomCape.count, true))
            .button(buttonText.back)
            .button('Presets')
            .button('Customized');
          vsCustomCapesSec.show(player).then(res => {
            if (res.canceled) return;
            switch (res.selection) {
              case 1:
                const customCpsLst = CustomCape.list.filter(cape => accessFilter(player, cape));
                capeRarityAccess(player, CustomCape, customCpsLst, 'Custom Presets', visualCustomCapesSection);
                break;
              case 2:
                const customCpsTmpLst = CustomCape.tempList.filter(cape => accessFilter(player, cape));
                capeRarityAccess(player, CustomCape, customCpsTmpLst, 'Custom Templates', visualCustomCapesSection);
                break;
              default: visualCapesMenu.call(undefined, player);
            };
          });
        };
        visualCustomCapesSection(player);
        break;
      case 3:
        const aprilFoolsCpsLst = AprilFoolsCape.list.filter(cape => accessFilter(player, cape));
        capeRarityAccess(player, AprilFoolsCape, aprilFoolsCpsLst, 'April Fools', visualCapesMenu);
        break;
    };
  });
};

/**
 * @param {Player} player
 */
function visualCapesRarityRewards(player) {
  const buffDefIndex = capeBuff.effects.findIndex(effect => effect.type === 'regeneration');
  const vsCapeRarityMenu = new ModalFormData()
    .title('Cape Rarity Reward')
    .dropdown('Select Rarity Reward', rarityNames.slice(1, -1), { defaultValueIndex: 0 })
    .divider()
    .dropdown('Select a Buff', capeBuff.effects.map(buff => buff.name), { defaultValueIndex: buffDefIndex, tooltip: formText.buffReward })
    .toggle('Include Saturation+\n§7Amplifier: 256§r', { defaultValue: false })
    .divider()
    .label(formText.buffAmplifier)
    .slider('Buff Amplifier Level', 1, 10, { defaultValue: 1, valueStep: 1, tooltip: 'Level computation if applicable:\n§7floor((maxLevel - 1) * (level * 0.1))§r' })
    .submitButton('Register');
  vsCapeRarityMenu.show(player).then(res => registerRewardFn(player, res));
};

/**
 * @param {Player} player
 */
function operatorVisualCapesMenu(player) {
  const opVsCapeMenuForm = new ActionFormData()
    .title('Visual Capes Menu [OP]')
    .body(formText.visualCapesMenuOperator)
    .button('Capes List')
    .button('Rarity Access');
  if (!raritySystem.enabled) {
    operatorVisualCapesList(player);
  } else {
    opVsCapeMenuForm.show(player).then(res => {
      if (res.canceled) return;
      if (res.selection === 0) {
        operatorVisualCapesList(player);
      } else {
        operatorVisualCapesRarity(player);
      };
    });
  };
};

/**
 * @param {Player} player
 */
function operatorVisualCapesRarity(player) {
  const players = world.getAllPlayers();
  const opVsCapeRarityForm = new ModalFormData()
    .title('Visual Capes Menu [OP]')
    .dropdown('Select Rarity', ['All', ...rarityNames.slice(1, -1)], { defaultValueIndex: 1 })
    .toggle('Remove Access', { defaultValue: false })
    .dropdown('Select a Player', players.map(p => p.name), { defaultValueIndex: 0 });
  opVsCapeRarityForm.show(player).then(res => {
    if (res.canceled) return operatorVisualCapesMenu(player);
    const [rarityValue, remove, target] = res.formValues.filter(v => v != null);
    // @ts-ignore
    const selectedPlayer = players[target];
    const rarityTags = [
      permissionSwitch.rarity.uncommon,
      permissionSwitch.rarity.rare,
      permissionSwitch.rarity.epic,
      permissionSwitch.rarity.legendary
    ];
    // @ts-ignore
    const langVar = [ player.name, `[§3${rarityNames[rarityValue]}§e]` ];
    if (remove) {
      if (rarityValue === 0) rarityTags.forEach(tag => selectedPlayer.removeTag(btoa(tag)));
      // @ts-ignore
      else selectedPlayer.removeTag(btoa(rarityTags[rarityValue - 1]));
      selectedPlayer.sendMessage(rawtext.format([
        rawtext.text("§e"),
        rawtext.lang(`vcascript.message.menuoperator.rarity.take${rarityValue === 0 ? "All" : ''}`, langVar),
        rawtext.text("§r")
      ]));
    } else {
      if (rarityValue === 0) rarityTags.forEach(tag => selectedPlayer.addTag(btoa(tag)));
      // @ts-ignore
      else selectedPlayer.addTag(btoa(rarityTags[rarityValue - 1]));
      selectedPlayer.sendMessage(rawtext.format([
        rawtext.text("§e"),
        rawtext.lang(`vcascript.message.menuoperator.rarity.give${rarityValue === 0 ? "All" : ''}`, langVar),
        rawtext.text("§r")
      ]));
    }
  });
};

/**
 * @param {Player} player
 */
function operatorVisualCapesList(player) {
  const players = world.getAllPlayers();
  const targetList = ['Self', ...players.map(p => p.name)];
  const sortNames = ['Default', 'Rarity', 'Alphabetical'];
  const opVsCapeListForm = new ModalFormData()
    .title('Visual Capes Menu [OP]')
    .dropdown('Classification', ['Vanilla', 'Custom: Presets', 'Custom: Templates', 'April Fools'], { defaultValueIndex: 0 })
    .dropdown('Capes List Sort by:', [...sortNames, 'Remove Cape'], { defaultValueIndex: 0, tooltip: formText.visualCapesMopCapesList })
    .toggle('Descending', { defaultValue: false, tooltip: formText.visualCapesMopListSort })
    .dropdown('Select a Player', targetList, { defaultValueIndex: 0 });
  if (raritySystem.enabled) {
    opVsCapeListForm.toggle('Unlock Common', { defaultValue: true });
    opVsCapeListForm.toggle('Unlock Uncommon', { defaultValue: true });
    opVsCapeListForm.toggle('Unlock Rare', { defaultValue: true });
    opVsCapeListForm.toggle('Unlock Epic', { defaultValue: false });
    opVsCapeListForm.toggle('Unlock Legendary', { defaultValue: false });
    if (raritySystem.survival_tweaks) {
      opVsCapeListForm.toggle('§6Trigger Stored Buffs§r', { defaultValue: false });
    };
  };
  opVsCapeListForm.submitButton(buttonText.apply);
  opVsCapeListForm.show(player).then(res => {
    if (res.canceled) {
      if (!raritySystem.enabled && !raritySystem.survival_tweaks) return;
      else return operatorVisualCapesMenu(player);
    };
    const resultInput = res.formValues.filter(v => v != null);
    let classValue, sortValue, desc, target, rarity0, rarity1, rarity2, rarity3, rarity4, addBuffs;
    if (raritySystem.enabled && raritySystem.survival_tweaks) {
      [classValue, sortValue, desc, target, rarity0, rarity1, rarity2, rarity3, rarity4, addBuffs] = resultInput;
    } else if (raritySystem.enabled && !raritySystem.survival_tweaks) {
      [classValue, sortValue, desc, target, rarity0, rarity1, rarity2, rarity3, rarity4] = resultInput;
      addBuffs = false;
    } else {
      [classValue, sortValue, desc, target] = resultInput;
      rarity0 = rarity1 = rarity2 = rarity3 = rarity4 = true;
      addBuffs = false;
    };
    function capeClass() {
      switch (classValue) {
        case 0: return VanillaCape.list;
        case 1: return CustomCape.list;
        case 2: return CustomCape.tempList;
        case 3: return AprilFoolsCape.list;
      };
    };
    /**
       * @param {{ rarity_value: number; }} cape
       */
    function rarityFilter(cape) {
      const conditions = [
        { rarity: 0, toggled: rarity0 },
        { rarity: 1, toggled: rarity1 },
        { rarity: 2, toggled: rarity2 },
        { rarity: 3, toggled: rarity3 },
        { rarity: 4, toggled: rarity4 },
      ];
      return conditions.some(condition => condition.toggled && cape.rarity_value === condition.rarity);
    };
    if (!rarity0 && !rarity1 && !rarity2 && !rarity3 && !rarity4) {
      const allCapesLockedForm = new MessageFormData()
        .title(buttonText.listEmptyTitle)
        .body(formText.capeLockedAll)
        .button2(buttonText.goBack)
        .button1(buttonText.exit);
      allCapesLockedForm.show(player).then(res => {
        if (res.canceled || res.selection === 0) return;
        else return operatorVisualCapesMenu(player);
      });
    } else {
      let varInput = [
        // @ts-ignore
        { player: player, selectedPlayer: players[target - 1] },
        { _target: target, _addBuffs: addBuffs, _targetList: targetList }
      ];
      switch (sortValue) {
        case 0:
          // Default Sort cannot be reversed by logic but it is possible lol
          let showCapes = capeClass().filter(cape => rarityFilter(cape));
          // @ts-ignore
          operatorVisualCapesSortedForm(varInput[0], varInput[1], sortNames[sortValue], showCapes);
          break;
        case 1:
          let rarityCapesList;
          if (desc) {
            rarityCapesList = sortByRarity(capeClass()).reverse();
          } else {
            rarityCapesList = sortByRarity(capeClass());
          };
          let rarityShowCapes = rarityCapesList.filter((/** @type {any} */ cape) => rarityFilter(cape));
          // @ts-ignore
          operatorVisualCapesSortedForm(varInput[0], varInput[1], sortNames[sortValue], rarityShowCapes);
          break;
        case 2:
          let alphabetCapesList;
          if (desc) {
            alphabetCapesList = sortByName(capeClass()).reverse();
          } else {
            alphabetCapesList = sortByName(capeClass());
          };
          let alphabetShowCapes = alphabetCapesList.filter((/** @type {any} */ cape) => rarityFilter(cape));
          // @ts-ignore
          operatorVisualCapesSortedForm(varInput[0], varInput[1], sortNames[sortValue], alphabetShowCapes);
          break;
        default:
          if (target === 0) registerCapeEquip.unsubscribe(player);
          else sendConfirmationCape(true, { sender: player, target: varInput[0].selectedPlayer }, null, addBuffs);
          break;
      };
    };
  });
};

/**
 * @param {Player} player
 * @param {typeof VanillaCape} capeClass
 * @param {string} formText
 * @param {Function} prevForm
 * @param {any[]} [cList]
 */
function visualCapesDefaultForm(player, capeClass, formText, prevForm, cList) {
  const vsCapesDefaultForm = new ActionFormData()
    .title('Capes Menu for ' + formText)
    .body(capeClass.menuText(capeClass.count))
    .button(buttonText.back);
  let _list = cList ?? capeClass.list;
  for (let cape of _list) {
    vsCapesDefaultForm.button(cape.name, cape.icon);
  };
  vsCapesDefaultForm.show(player).then(res => {
    if (res.canceled) return;
    else {
      if (res.selection == 0) return prevForm.call(undefined, player);
      const selectedCape = _list[res.selection - 1];
      registerCapeEquip.subscribe(player, selectedCape, false);
    }
  });
};

/**
 * @param {Player} player
 */
function visualCapesMenuDefault(player) {
  const vsCapesMenuDefaultSection = new ActionFormData()
    .title('Visual Capes Menu')
    .body(formText.visualCapesMenuDefault)
    .button(buttonText.info)
    .button('Vanilla Capes')
    .button('Custom Capes')
    .button('April Fools Capes')
    .button('Remove Cape');
  vsCapesMenuDefaultSection.show(player).then(res => {
    if (res.canceled) return;
    switch (res.selection) {
      case 0:
        visualCapesInfo(player, visualCapesMenuDefault);
        break;
      case 1:
        visualCapesDefaultForm(player, VanillaCape, 'Vanilla', visualCapesMenuDefault);
        break;
      case 2:
        const vsCapesDefault1Sec = new ActionFormData()
          .title('Visual Capes Custom Menu')
          .body(CustomCape.menuText(CustomCape.count, true))
          .button(buttonText.back)
          .button('Presets')
          .button('Customized');
        vsCapesDefault1Sec.show(player).then(res => {
          if (res.canceled) return;
          switch (res.selection) {
            case 1:
              visualCapesDefaultForm(player, CustomCape, 'Custom Presets', visualCapesMenuDefault, CustomCape.list);
              break;
            case 2:
              visualCapesDefaultForm(player, CustomCape, 'Custom Templates', visualCapesMenuDefault, CustomCape.tempList);
              break;
            default: visualCapesMenuDefault.call(undefined, player);
          };
        });
        break;
      case 3:
        visualCapesDefaultForm(player, AprilFoolsCape, 'April Fools', visualCapesMenuDefault);
        break;
      default:
        const vsCapesDefaultRemove = new MessageFormData()
          .title('Remove your Cape')
          .body('Are you sure to remove your current equiped cape?')
          .button2(buttonText.yes)
          .button1(buttonText.reject);
        vsCapesDefaultRemove.show(player).then(res => {
          if (res.canceled) return;
          if (res.selection === 1) registerCapeEquip.unsubscribe(player);
          else return visualCapesMenuDefault(player);
        });
        break;
    };
  });
};

/**
 * @param {Player} player
 */
function visualCapesMenuItemUse(player) {
  if (player.hasTag(btoa(permissionSwitch.canceledMenu))) {
  } else if (!raritySystem.enabled) {
    if (player.hasTag(btoa(permissionSwitch.op))) {
      operatorVisualCapesMenu(player);
    } else {
      visualCapesMenuDefault(player);
    }
  } else {
    if (player.hasTag(btoa(permissionSwitch.op))) {
      operatorVisualCapesMenu(player);
    } else if (player.hasTag(btoa(permissionSwitch.startup)) || player.hasTag(btoa(permissionSwitch.skipStartup))) {
      visualCapesMenu(player);
    } else {
      visualCapesStartup(player);
    }
  }
}

/**
 * @param {Player} player
 */
function visualCapesWorldSettings(player) {
  const visualCapesSettings = new ModalFormData()
    .title("Visual Capes Add-on")
    .label(formText.settingDescription)
    .toggle("Show Script Checks", { defaultValue: false, tooltip: formText.settingScriptCheck })
    .toggle("Cape Collector", { defaultValue: false, tooltip: formText.settingCapeCollector });
    if (raritySystem.survival_tweaks) {
      visualCapesSettings.divider()
      .header("§6Challenges§r")
      .toggle("Always Thunderstorm", { defaultValue: true })
      .divider()
      .label(formText.settingDamageState)
      .toggle("Damage State", { defaultValue: false })
      .divider()
      .label(formText.settingDamageAmplifier)
      .slider("Incrememt Damage Every ? Days", 5, 50, { defaultValue: 10, valueStep: 5 });
    }
    visualCapesSettings.submitButton("Save");
  void system.run(() => {
    visualCapesSettings.show(player).then(res => {
      if (res.canceled) return visualCapesWorldSettings.call(undefined, player);
      let [scrptChk, cpClctr, alwysThndr, dmgSt, dsDays] = res.formValues.filter(v => v != null);
      world.setDynamicProperty(vcaProperties.scriptCheck, scrptChk);
      world.setDynamicProperty(vcaProperties.capeCollector, cpClctr);
      if (raritySystem.survival_tweaks) {
        world.setDynamicProperty(vcaProperties.alwaysThunder, alwysThndr);
        world.setDynamicProperty(vcaProperties.damageState, dmgSt);
        world.setDynamicProperty(vcaProperties.damageStateDays, dsDays);
      }
      if (scrptChk) player.sendMessage(JSON.stringify(getDynamicProperties(world), undefined, 2));
      world.setDynamicProperty(vcaProperties.settings, true);
      world.sendMessage(`${formText.addonName} §eAdd-on configuration applied. Have fun!§r`);
    });
  });
}

/**
 * @param {Player} player
 */
function capeCollector(player) {
  try {
    const radius = 1.5;
    const ticks = system.currentTick % 2400000;
    const hspd = ticks * 0.105;
    const vspd = ticks * 0.18;
    const x = radius * Math.sin(vspd) * Math.cos(hspd);
    const y = radius * Math.sin(vspd) * Math.sin(hspd);
    const z = radius * Math.cos(vspd);
    const pos = player.location;
    const isMoving = hypotXYZ(player.getVelocity(), { x: 0, y: 0, z: 0 });
    if (!isMoving && tickCheck(400))
    player.dimension.spawnParticle(
      "visualcapes:collector_idle", pos
    );
    player.dimension.spawnParticle(
      "visualcapes:collector_point", 
      { x: pos.x + x, y: pos.y + y + 1, z: pos.z + z }
    );
  } catch (e) {};
}

/**
 * @param {Entity} [target]
 */
function exitDomain(target) {
  world.getAllPlayers().filter(p => p.hasTag(capeBuff.variables.domain_caster) || p.hasTag(capeBuff.variables.domain_victim)).forEach(player => {
    if (player === target) {
      player.removeTag(capeBuff.variables.domain_caster);
      player.removeTag(capeBuff.variables.domain_victim);
    } else {
      player.removeTag(capeBuff.variables.domain_caster);
      player.removeTag(capeBuff.variables.domain_victim);
      player.removeTag(capeBuff.variables.domain_tryexit);
      player.dimension.spawnParticle("visualcapes:domain_portal", player.location);
      player.teleport(centeredXZ({
        x: Math.floor(player.location.x),
        y: 320,
        z: Math.floor(player.location.z)
      }), { dimension: world.getDimension("overworld") });
    }
  });
}


// ----------------------------------------------------------------------------------------------------
//    World
// ----------------------------------------------------------------------------------------------------

world.afterEvents.worldLoad.subscribe(() => {
  if (world.getDynamicProperty(vcaProperties.damageState))
  world.getAllPlayers().forEach(p => p.setDynamicProperty("dmgState", true));
});

world.afterEvents.playerSpawn.subscribe((ev) => {
  let { player } = ev;
  let modifiedData = worldData(vcaProperties.settings);
  if (modifiedData !== true) visualCapesWorldSettings.call(undefined, player);

  if (world.getDynamicProperty(vcaProperties.damageState)) {
    player.setDynamicProperty("dmgState", false);
    system.runTimeout(() => {
      player.setDynamicProperty("dmgState", true);
      scriptCheck(() => player.sendMessage(`§3[!] Damage State ready.§r`));
    }, 600);
  }
});

if (raritySystem.survival_tweaks) {
  world.beforeEvents.playerLeave.subscribe(ev => {
    world.getAllPlayers().filter(pd => pd !== ev.player && (pd.hasTag(capeBuff.variables.domain_caster) || pd.hasTag(capeBuff.variables.domain_victim)) && pd.dimension.id === 'minecraft:nether' && parseFloat(pd.location.y.toFixed(2)) >= 128).forEach(pd => {
      pd.sendMessage('§eEscaping domain in 3 seconds...§r');
    });
    void system.runTimeout(() => {
      exitDomain(ev.player);
    }, TicksPerSecond * 3);
  });

  world.afterEvents.entityHurt.subscribe(ev => {
    let { hurtEntity } = ev;
    let { cause, damagingEntity } = ev.damageSource;
    let dmgStateEnabled = world.getDynamicProperty(vcaProperties.damageState);
    if (
      dmgStateEnabled &&
      hurtEntity instanceof Player &&
      containsMatch(cause, damageCauseByTick) &&
      (!damagingEntity || damagingEntity?.typeId !== "minecraft:player") &&
      cause !== EntityDamageCause.void
    ) {
      let health = hurtEntity.getComponent(EntityComponentTypes.Health);
      if (!health) return;
      let dmgSource = damagingEntity ?? hurtEntity;
      let curDay = world.getAbsoluteTime();
      let dy = world.getDynamicProperty(vcaProperties.damageStateDays);
      let dayScale = Math.floor(curDay / (24000 * (Number(dy) ?? 10)));
      let dmgState = hurtEntity.getDynamicProperty("dmgState");
      // Player's health.defaultValue = 36, idk why
      if ((health.currentValue >= 10) && !dmgState) {
        hurtEntity.setDynamicProperty("dmgState", true);
        scriptCheck(() => hurtEntity.sendMessage(`§3[!] Damage State cooldown...§r`));
        hurtEntity.applyDamage(dayScale, {
          cause: cause == EntityDamageCause.projectile ? EntityDamageCause.entityAttack : cause,
          damagingEntity: dmgSource
        });
        void system.runTimeout(() => {
          hurtEntity.setDynamicProperty("dmgState", false);
          scriptCheck(() => hurtEntity.sendMessage(`§3[!] Damage State ready.§r`));
        }, 600);
      }
    }
  });

  world.afterEvents.entityRemove.subscribe(ev => {
    if (lockPositions.has(ev.removedEntityId)) {
      lockPositions.delete(ev.removedEntityId);
    };
  });
}

world.afterEvents.entityDie.subscribe(ev => {
  let target = ev.deadEntity;
  let sourceD = ev.damageSource;
  // let sourceE = ev.damageSource.damagingEntity;
  if (target.typeId === 'minecraft:player') {
    let infBuffTagsData = [];
    target.getTags().forEach(tag => {
      const tagSplit = atob(tag).split('-');
      if (tagSplit[0] === capeActiveFx) {
        if (parseInt(tagSplit[2]) >= 7) {
          infBuffTagsData.push(tag);
        };
        if (tagSplit[1] === 'wind.pulse') {
          impulseRates.delete(target.id);
        };
        target.removeTag(tag);
      } else if (tag === capeBuff.variables.domain_caster || tag === capeBuff.variables.domain_victim) {
        world.getAllPlayers().filter(pd => pd !== target && (pd.hasTag(capeBuff.variables.domain_caster) || pd.hasTag(capeBuff.variables.domain_victim)) && pd.dimension.id === 'minecraft:nether' && parseFloat(pd.location.y.toFixed(2)) >= 128).forEach(pd => {
          pd.sendMessage('§eEscaping Domain in 3 seconds...§r');
        });
        void system.runTimeout(() => {
          exitDomain(target);
        }, TicksPerSecond * 3);
      } else if (tag === capeBuff.variables.binder || tag === capeBuff.variables.binded) {
        if (lockPositions.has(target.id)) {
          target.dimension.spawnParticle('visualcapes:bind_effect', target.location);
          lockPositions.delete(target.id);
        };
        target.removeTag(tag);
      };
    });
    if (raritySystem.survival_tweaks && infBuffTagsData.length > 0 && (sourceD.cause === 'entityExplosion' || sourceD.cause === 'blockExplosion')) {
      const dropCore = new ItemStack('minecraft:heavy_core', 1);
      const pLdead = {
        x: target.location.x,
        y: target.location.y + 1,
        z: target.location.z
      };
      target.dimension.spawnItem(dropCore, pLdead);
    };
  };
});

world.afterEvents.itemUse.subscribe(ev => {
  let player = ev.source;
  // let item = ev.itemStack;
  let itemType = ev.itemStack.typeId;
  let itemName = ev.itemStack.nameTag;
  void system.run(() => {
    if (itemType === "minecraft:pumpkin_pie" && itemName === "Cape Selector")
      visualCapesMenuItemUse(player);
    if (itemName === "Reward Convert" && raritySystem.survival_tweaks)
      visualCapesRarityRewards(player);
    if (itemName === "Achievement")
      Achievement.view(player);
  });
});


// ----------------------------------------------------------------------------------------------------
//    System
// ----------------------------------------------------------------------------------------------------

const impulseRates = new Map();
const lockPositions = new Map();
if (raritySystem.survival_tweaks) {
  void system.runInterval(() => {
    if (worldData(vcaProperties.alwaysThunder)) world.getDimension("overworld").setWeather(WeatherType.Thunder, 60);

    let players = world.getAllPlayers();
    const entities = (/** @type {string} */ dimension) => { return world.getDimension(dimension.replace('minecraft:', '')).getEntities(); };
    players.forEach(player => player.getTags().forEach(tag => {
      // Buff Duration Loop
      const [prefix, effect, amplifier] = atob(tag).split('-');
      if (tickCheck(TicksPerSecond * 10) && prefix === capeActiveFx) {
        if (raritySystem.enabled && raritySystem.survival_tweaks && effect !== 'wind.pulse') {
          player.addEffect(effect.replace(/\./g, '_'), 600, { amplifier: parseInt(amplifier), showParticles: true });
        } else if (!raritySystem.enabled || !raritySystem.survival_tweaks) {
          player.removeTag(tag);
        }
      }
    }));

    // Anti Falling Buff
    let antiFallPlayers = players.filter(p => p.hasTag(capeBuff.variables.wind_pulse));
    if (tickCheck(2) && antiFallPlayers && raritySystem.survival_tweaks) {
      antiFallPlayers.forEach(player => {
        try {
          const playerId = player.id;
          let impulseRate = mapVarData(player, impulseRates);
          const playerGm = player.getGameMode();
          const isFalling = player.isFalling || parseFloat(player.getVelocity().y.toFixed(2)) <= -0.25;
          if (!isFalling || player.isSneaking || containsMatch(playerGm, notGameModes)) {
            impulseRate = 0;
            impulseRates.set(playerId, impulseRate);
            return;
          }
          const fallLoc = {
            x: Math.floor(player.location.x),
            y: Math.floor(player.location.y),
            z: Math.floor(player.location.z)
          };
          if (player.dimension.getBlock(fallLoc).isAir) {
            player.addEffect('slow_falling', 1, { showParticles: false });
            player.dimension.spawnParticle('visualcapes:wind_pulse', player.location);
            const dimensionId = player.dimension.id.replace('minecraft:', '');
            world.getDimension(dimensionId).getEntities({ 
              location: player.location, 
              maxDistance: 8 
            }).forEach(e => {
              if (e instanceof Player) {
                e.playSound('mace.smash_air', { volume: 1, pitch: 1, location: e.location });
                e.playSound('wind_charge.burst', { volume: 1, pitch: 1, location: e.location });
              }
              if (hypotXYZ(player.location, e.location) > 2.5) return;
              const imp = Math.floor(impulseRate / 10);
              if (imp < 1 || (!e.isOnGround && (e instanceof Player && !e.isJumping))) return;
              e.dimension.spawnParticle('visualcapes:wind_impulse', e.location);
              if (e.typeId === 'minecraft:player') {
                if (e !== player) e.applyKnockback({ x: 0, z: 0 }, 1 * imp);
              } else e.applyImpulse({ x: 0, y: 1 * imp, z: 0 });
            });
          }
          impulseRate += 1.5;
          impulseRates.set(playerId, impulseRate);
        } catch (error) {
          if ((player.isFalling || parseFloat(player.getVelocity().y.toFixed(2)) <= -0.25) && !player.isSneaking) {
            player.addEffect('slow_falling', 1, { amplifier: 0, showParticles: false });
          }
        }
      });
    };

    // Bind Curse Ticks
    let bindCurseCasters = players.filter(p => p.hasTag(capeBuff.variables.binder) && raritySystem.survival_tweaks);
    let bindCurseEntities = () => {
      if (raritySystem.survival_tweaks) {
        const bcVarDims = (/** @type {string} */ dim) => { return entities(dim).filter(e => e.hasTag(capeBuff.variables.binded)) ?? []; };
        return [...bcVarDims('overworld'), ...bcVarDims('nether'), ...bcVarDims('the_end')];
      } else return [];
    }
    if ((bindCurseCasters || bindCurseEntities().length > 0) && raritySystem.survival_tweaks) {
      const bc_e0 = bindCurseEntities() ?? [];
      const bc_e1 = bindCurseCasters ?? [];
      for (let bdd of bc_e0) {
        if (bdd.hasTag(capeBuff.variables.binder)) continue;
        const dataBC = mapVarData(bdd, lockPositions, {
          duration: TicksPerSecond * 60,
          location: {
            x: parseFloat(bdd.location.x.toFixed(2)),
            y: parseFloat(bdd.location.y.toFixed(2)),
            z: parseFloat(bdd.location.z.toFixed(2))
          },
          rotation: {
            x: parseFloat(String(bdd.getRotation().x)),
            y: parseFloat(String(bdd.getRotation().y))
          }
        });
        if (dataBC.duration > 0) {
          bdd.teleport(dataBC.location, {
            rotation: dataBC.rotation,
            keepVelocity: false
          });
          dataBC.duration--;
        } else {
          bdd.dimension.spawnParticle('visualcapes:bind_effect', bdd.location);
          bdd.removeTag(capeBuff.variables.binded);
          lockPositions.delete(bdd.id);
        }
      };
      for (let bdr of bc_e1) {
        const dataBC = mapVarData(bdr, lockPositions, { duration: TicksPerSecond * 60 });
        if (dataBC.duration > 0) {
          bdr.addEffect('darkness', TicksPerSecond * 2, { amplifier: 0, showParticles: true });
          dataBC.duration--;
        } else {
          bdr.removeTag(capeBuff.variables.binder);
          lockPositions.delete(bdr.id);
        }
      };
    };

    // Nether Domain Effect
    let ntdm = players.filter(p => p.hasTag(capeBuff.variables.domain_victim) || p.hasTag(capeBuff.variables.domain_caster));
    if (tickCheck(TicksPerSecond * 7.5) && ntdm && raritySystem.survival_tweaks) {
      ntdm.forEach(player => {
        let isVictim = player.hasTag(capeBuff.variables.domain_victim);
        const domainTag = isVictim ? capeBuff.variables.domain_victim : capeBuff.variables.domain_caster;
        if (player.dimension.id === 'minecraft:nether' && parseFloat(player.location.y.toFixed(2)) >= 128) {
          player.playSound('mob.ghast.fireball', { volume: 1, pitch: 1, location: player.location });
          if (isVictim) {
            player.setOnFire(3, true);
          } else {
            player.dimension.spawnParticle('visualcapes:domain_caster', player.location);
            if (player.isSneaking && ntdm.length == 1) {
              if (player.hasTag(capeBuff.variables.domain_tryexit)) {
                player.sendMessage("Exiting domain...");
                exitDomain();
              } else player.addTag(capeBuff.variables.domain_tryexit);
            } else {
              player.removeTag(capeBuff.variables.domain_tryexit);
            }
          };
        } else {
          player.removeTag(domainTag);
        };
      });
    };
  }, 1);
}

void system.runInterval(() => {
  for (const player of world.getAllPlayers()) {
    if (player.getDynamicProperty(Achievement.tag(permissionSwitch.achievement.cape_collector)))
    capeCollector(player);
  }
}, 1);

system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {
  const allCapesList = [...VanillaCape.list, ...CustomCape.list, ...AprilFoolsCape.list, ...CustomCape.tempList];
  customCommandRegistry.registerEnum("vca:invoke", ["add", "remove"]);
  customCommandRegistry.registerEnum("vca:action", ["equip", "remove"]);
  customCommandRegistry.registerEnum("vca:capesList", allCapesList.map(cape => cape.type));

  // Global Cape Equip Command
  customCommandRegistry.registerCommand(
    {
      name: "vca:cape",
      description: "Equip or remove cape to your player.",
      permissionLevel: CommandPermissionLevel.Any,
      cheatsRequired: false,
      optionalParameters: [
        {
          name: "vca:action",
          type: CustomCommandParamType.Enum
        },
        {
          name: "vca:capesList",
          type: CustomCommandParamType.Enum
        }
      ]
    },
    (origin, action, capesList) => {
      const source = origin.sourceEntity;
      if (!(source instanceof Player)) return commandFail(cmdPlayerOnly);
      void system.run(() => {
        try {
          if (!action) return visualCapesMenuItemUse.call(undefined, source);
          switch (action) {
            case 'equip':
              if (!capesList) throw "No cape chosen to equip.";
              if (!allCapesList.find(cape => cape.type === capesList))
                throw new SyntaxError(`${capesList} is not a valid cape type.`);
              let chosenCape = allCapesList.find(selCape => selCape.type === capesList)
              let chosenCapeR = allCapesList.filter(cape => accessFilter(source, cape)).find(selCape => selCape.type === capesList);
              if (raritySystem.enabled && !chosenCapeR)
                throw "You do not have the privilege to equip this cape.";
              registerCapeEquip.subscribe(source, chosenCapeR ?? chosenCape, raritySystem.survival_tweaks);
              break;
            case 'remove':
              registerCapeEquip.unsubscribe(source);
              break;
            default: throw new SyntaxError(`${action} is not an option.`);
          }
        } catch (e) {
          source.sendMessage(`§c${getErrorMessage(e)}§r`);
        }
      });
      return { status: CustomCommandStatus.Success };
    }
  );

  // Operator Cape Menu
  customCommandRegistry.registerEnum("vca:opinvoke", ["add", "menu", "remove", "restart_menu"]);
  customCommandRegistry.registerCommand(
    {
      name: "vca:opcape",
      description: "Add or remove operator menu of Visual Capes Add-on to a player.",
      permissionLevel: CommandPermissionLevel.Admin,
      cheatsRequired: false,
      mandatoryParameters: [
        {
          name: "vca:opinvoke",
          type: CustomCommandParamType.Enum
        }
      ],
      optionalParameters: [
        {
          name: "vca:target",
          type: CustomCommandParamType.PlayerSelector
        }
      ]
    },
    (origin, invoke, target) => {
      const source = target ?? origin.sourceEntity;
      const cast = origin.sourceEntity;
      if (!(source instanceof Player)) return commandFail(cmdPlayerOnly);
      const opInvoke = () => {
        let queueStr = invoke === 'add' ? 'now an Operator' : 'no longer an Operator';
        world.sendMessage(`${formText.addonName} §e${source.name} is ${queueStr} for the Capes Menu.§r`);
      };
      void system.run(() => {
        try {
          switch (invoke) {
            case 'add':
              source.addTag(btoa(permissionSwitch.op));
              opInvoke();
              break;
            case 'menu':
              if (source.hasTag(btoa(permissionSwitch.op))) return operatorVisualCapesMenu.call(undefined, source);
              source.sendMessage(`${formText.addonName} §cYou do not have permission to use this menu.§r`);
              break;
            case 'remove':
              source.removeTag(btoa(permissionSwitch.op));
              opInvoke();
              break;
            case 'restart_menu':
              source.removeTag(btoa(permissionSwitch.canceledMenu));
               source.sendMessage(`${formText.addonName} §eYour access to the Capes Menu has been restored${target !== cast ? ` by ${getEntityName(cast)}` : ''}.§r`);
              break;
            default: throw new SyntaxError(`${invoke} is not an option.`);
          }
        } catch (e) {
          source.sendMessage(`§c${getErrorMessage(e)}§r`);
        }
      });
      return { status: CustomCommandStatus.Success };
    }
  );

  // Cape Achievements OP
  customCommandRegistry.registerEnum("vca:achievement", Achievement.listArr.map(n => n[0]));
  customCommandRegistry.registerCommand(
    {
      name: "vca:opachcape",
      description: "Add or remove achievement of Visual Capes Add-on to a player.",
      permissionLevel: CommandPermissionLevel.Admin,
      cheatsRequired: true,
      mandatoryParameters: [
        {
          name: "vca:invoke",
          type: CustomCommandParamType.Enum
        },
        {
          name: "vca:achievement",
          type: CustomCommandParamType.Enum
        }
      ],
      optionalParameters: [
        {
          name: "vca:target",
          type: CustomCommandParamType.PlayerSelector
        }
      ]
    },
    (origin, invoke, achievement, target) => {
      const source = target ?? origin.sourceEntity;
      if (!(source instanceof Player)) return commandFail(cmdPlayerOnly);
      void system.run(() => {
        try {
          const achvTag = Achievement.listArr.find(n => n[0] === achievement);
          if (!achvTag) throw new ReferenceError(`Achievement ${achievement} does not exist.`);
          switch (invoke) {
            case 'add':
              Achievement.apply(achvTag[1], source);
              break;
            case 'remove':
              Achievement.revoke(achvTag[1], source);
              break;
            default: throw new SyntaxError(`${invoke} is not an option.`);
          }
        } catch (e) {
          source.sendMessage(`§c${getErrorMessage(e)}§r`);
        }
      });
      return { status: CustomCommandStatus.Success };
    }
  );

  // Cape Achievements
  customCommandRegistry.registerCommand(
    {
      name: "vca:achcape",
      description: "View Visual Capes Add-on achievements.",
      permissionLevel: CommandPermissionLevel.Any,
      cheatsRequired: false
    },
    (origin) => {
      const source = origin.sourceEntity;
      if (!(source instanceof Player)) return commandFail(cmdPlayerOnly);
      void system.run(() => {
        try {
          Achievement.view.call(undefined, source);
        } catch (e) {
          source.sendMessage(`§c${getErrorMessage(e)}§r`);
        }
      });
      return { status: CustomCommandStatus.Success };
    }
  );

  if (raritySystem.survival_tweaks) {
    // Cape Register Command
    const rarityCmdArr = rarityNames.slice(1, -1).map(r => r.toLowerCase());
    const capeBuffCmda = capeBuff.effects.map(buff => buff.type.replace(/\./g, '_'));
    customCommandRegistry.registerEnum("vca:rarity", rarityCmdArr);
    customCommandRegistry.registerEnum("vca:selectBuff", capeBuffCmda);
    customCommandRegistry.registerCommand(
      {
        name: "vca:caperegister",
        description: "Register cape rarity to acquire cape privilege.",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false,
        optionalParameters: [
          {
            name: "vca:rarity",
            type: CustomCommandParamType.Enum
          },
          {
            name: "vca:selectBuff",
            type: CustomCommandParamType.Enum
          },
          {
            name: "vca:saturation",
            type: CustomCommandParamType.Boolean
          },
          {
            name: "vca:level",
            type: CustomCommandParamType.Integer
          }
        ]
      },
      (origin, rarity, selectBuff, saturation, level) => {
        const source = origin.sourceEntity;
        if (!(source instanceof Player)) return commandFail(cmdPlayerOnly);
        void system.run(() => {
          try {
            if (rarity) {
              if (!selectBuff || !(typeof saturation === 'boolean') || !level)
                throw "Providing options must be complete to register automatically.";
              if (!capeBuffCmda.find(b => b === selectBuff))
                throw new ReferenceError(`${selectBuff} buff does not exist.`);
              if (!(typeof saturation === 'boolean'))
                throw new SyntaxError(`Expected a boolean in saturation.`);
              if (!(level >= 1 && level <= 10))
                throw new SyntaxError(`Level shoud be between 1 to 10.`);
              let entry = {
                canceled: false,
                formValues: [
                  rarityCmdArr.findIndex(r => r === rarity),
                  capeBuff.effects.findIndex(b => b.type === selectBuff.replace(/_/g, '.')),
                  saturation, level - 1
                ]
              };
              registerRewardFn(source, entry);
            } else visualCapesRarityRewards(source);
          } catch (e) {
            source.sendMessage(`§c${getErrorMessage(e)}§r`);
          }
        });
        return { status: CustomCommandStatus.Success };
      }
    );

    // Dispell Buff Command
    const normalBuffs = capeBuff.effects.filter(e => e.legendarybuff !== 'custom').map(e => e.type.replace(/\./g, '_'));
    customCommandRegistry.registerEnum('vca:normBuffList', ['all', ...normalBuffs]);
    customCommandRegistry.registerCommand(
      {
        name: "vca:dispell",
        description: "Remove an active buff to your player.",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false,
        optionalParameters: [
          {
            name: "vca:normBuffList",
            type: CustomCommandParamType.Enum
          }
        ]
      },
      (origin, buffSel) => {
        const source = origin.sourceEntity;
        if (!(source instanceof Player)) return commandFail(cmdPlayerOnly);
        void system.run(() => {
          try {
            if (buffSel === 'all') {
              let sourceTags = source.getTags();
              sourceTags.forEach(tag => {
                let [prefix, type] = atob(tag).split('-');
                if (prefix === capeActiveFx) {
                  source.removeTag(tag);
                  source.removeEffect(type.replace(/\./, '_'));
                };
              });
              source.sendMessage('§eTook all active buffs successfully.§r');
            } else {
              let buffSelFormat = buffSel.replace(/_/g, '.');
              let activeBuffsTag = source.getTags().find(t => atob(t).split('-')[1] === buffSelFormat);
              if (!activeBuffsTag) throw "No buff got removed to your player.";
              source.removeTag(activeBuffsTag);
              source.removeEffect(buffSel);
              source.sendMessage(`§eTook ${capeBuff.effectNameDisplay(capeBuff.effects.find(e => e.type === buffSelFormat).name)} buff successfully.§r`);
            }
          } catch (e) {
            source.sendMessage(`§c${getErrorMessage(e)}§r`);
          }
        });
        return { status: CustomCommandStatus.Success };
      }
    );
  }

  /* For Development Only
  if (dmNhRGV2RTFfWEk) {
    // Timer Command [!]
    customCommandRegistry.registerCommand(
      {
        name: "vca:timer",
        description: "Visual Capes Add-on.",
        permissionLevel: CommandPermissionLevel.Admin,
        cheatsRequired: true,
        mandatoryParameters: [
          {
            name: "vca:duration",
            type: CustomCommandParamType.Integer
          }
        ]
      },
      (origin, duration) => {
        const source = origin.sourceEntity;
        void system.run(() => {
          try {
            runTimer(duration, (sec) => {
              world.sendMessage('§aWorld Timer: ' + sec + 's' + (sec === duration ? ' §7[Finished]§r' : '§r'));
              world.sendMessage(`§1${world.getAbsoluteTime()} : ${system.currentTick}§r`);
            });
          } catch (e) {
            if (source instanceof Player) source.sendMessage(`§c${getErrorMessage(e, false)}§r`);
          }
        });
        return { status: CustomCommandStatus.Success };
      }
    );

    // consoleMap Command [!]
    const mapNames = [
      "impulseRates",
      "lockPositions",
      "turnaroundByChance",
      "voidPlayerMap"
    ];
    customCommandRegistry.registerEnum("vca:scriptMap", mapNames);
    customCommandRegistry.registerEnum("vca:mapMethod", ["delete", "has", "get"]);
    customCommandRegistry.registerCommand(
      {
        name: "vca:consolemap",
        description: "Visual Capes Add-on.",
        permissionLevel: CommandPermissionLevel.Host,
        cheatsRequired: true,
        mandatoryParameters: [
          {
            name: "vca:scriptMap",
            type: CustomCommandParamType.Enum
          }
        ],
        optionalParameters: [
          {
            name: "vca:mapMethod",
            type: CustomCommandParamType.Enum
          }
        ]
      },
      (origin, scriptMap, method) => {
        const source = origin.sourceEntity;
        if (!raritySystem.survival_tweaks) {
          return {
            status: CustomCommandStatus.Failure,
            message: `${dmNhRGV2RTFfWEk} This command can only be executed in Survival Tweaks System.`
          };
        }
        void system.run(() => {
          try {
            let mapLiterals = [
              impulseRates,
              lockPositions,
              turnaroundByChance,
              voidPlayerMap
            ];
            let mapIndex = mapNames.findIndex(m => m === scriptMap);
            let mapData = mapLiterals[mapIndex];
            if (!method) return consoleMap.call(undefined, source, mapData);
            switch (method) {
              case 'delete':
                mapData.delete(source.id);
                if (source instanceof Player) source.sendMessage(`Your data in ${scriptMap} has been deleted.`);
                break;
              case 'has':
                console.log(getEntityName(source) + " has data to " + scriptMap + "?: " + mapData.has(source.id));
                break;
              case 'get':
                console.log(JSON.stringify(mapData.get(source.id), undefined, 2));
                break;
              default:
                throw new TypeError(`${method} is invalid.`);
            }
          } catch (e) {
            if (source instanceof Player) source.sendMessage(`§c${getErrorMessage(e, false)}§r`);
          }
        });
        return { status: CustomCommandStatus.Success };
      }
    );

    // turnaround Edit Command [!]
    customCommandRegistry.registerCommand(
      {
        name: "vca:ta",
        description: "Visual Capes Add-on.",
        permissionLevel: CommandPermissionLevel.Host,
        cheatsRequired: true,
        mandatoryParameters: [
          {
            name: "vca:value",
            type: CustomCommandParamType.Integer
          }
        ]
      },
      (origin, value) => {
        const source = origin.sourceEntity;
        if (!raritySystem.survival_tweaks) {
          return {
            status: CustomCommandStatus.Failure,
            message: `${dmNhRGV2RTFfWEk} This command can only be executed in Survival Tweaks System.`
          };
        }
        void system.run(() => {
          try {
            let taMyData = mapVarData(source, turnaroundByChance, {
              animate: false, credit: 1, disabled: false
            });
            taMyData.credit = value;
          } catch (e) {
            if (source instanceof Player) source.sendMessage(`§c${getErrorMessage(e)}§r`);
          }
        });
        return { status: CustomCommandStatus.Success };
      }
    );

    // Dynamic Properties Reset [!]
    customCommandRegistry.registerEnum("vca:dataObject", ["world", "self"]);
    customCommandRegistry.registerCommand(
      {
        name: "vca:resetworlddata",
        description: "Visual Capes Add-on game dynamic properties.",
        permissionLevel: CommandPermissionLevel.Host,
        cheatsRequired: true,
        mandatoryParameters: [
          {
            name: "vca:dataObject",
            type: CustomCommandParamType.Enum
          }
        ],
        optionalParameters: [
          {
            name: "vca:print",
            type: CustomCommandParamType.Boolean
          }
        ]
      },
      (origin, dataType, print) => {
        const source = origin.sourceEntity;
        void system.run(() => {
          try {
            let dateNow = new Date();
            let dateNowStr = dateNow.toDateString();
            let dataPrint = dataType === "world" ? world : source;
            if (print === true) {
              if (source instanceof Player) source.sendMessage(JSON.stringify(getDynamicProperties(dataPrint), undefined, 2));
            } else {
              console.log(`DynamicProperties log at ${dateNowStr}: `, JSON.stringify(getDynamicProperties(dataPrint), undefined, 2));
              // @ts-ignore
              if (clearDynamicProperties(dataPrint)) {
                if (dataType === "self") {
                  impulseRates.delete(source.id);
                  lockPositions.delete(source.id);
                  turnaroundByChance.delete(source.id);
                  voidPlayerMap.delete(source.id);
                  thunderstormPlayerMap.delete(source.id);
                  console.log("All of your data from Map() datas has been reset.", JSON.stringify(Object.fromEntries(voidPlayerMap)));
                }
                if (source instanceof Player) {
                  source.sendMessage(`${formText.addonName} §eDynamicProperties Reset successfully.§r`);
                  source.sendMessage(JSON.stringify(getDynamicProperties(dataPrint), undefined, 2));
                }
              }
            }
          } catch (e) {
            if (source instanceof Player) source.sendMessage(`§c${getErrorMessage(e, false)}§r`);
          }
        });
        return { status: CustomCommandStatus.Success };
      }
    );
  }
  */

  // Item AUX List
  customCommandRegistry.registerCommand(
    {
      name: "vca:itemids",
      description: "Shows list of item IDs.",
      permissionLevel: CommandPermissionLevel.Any,
      cheatsRequired: false
    },
    (origin) => {
      const source = origin.sourceEntity;
      if (!(source instanceof Player)) return commandFail(cmdPlayerOnly);
      void system.run(() => itemAuxCmd(source));
      return { status: CustomCommandStatus.Success };
    }
  );
});

console.log('"VisualCapes.js" loaded successfully.');
