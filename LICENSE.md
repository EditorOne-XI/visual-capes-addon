# Add-on Licensing & Asset Manifest

This Minecraft Add-on implements multiple licenses to protect the various components of this Add-on. Refer to the manifest below:

* **Source Code**
  * **License:** [Author's License](COPYING.License)
  * **Scope:**
```
bundle/VisualCapesBP/... (All)

bundle/VisualCapesExt/... (All)

bundle/VisualCapesRP
├── animations
│   └── animation.player.deity.json
├── attachables
│   └── elytra.json
├── manifest.json
├── models
│   └── entity
│       └── no_model.json
├── pack_icon.png
├── particles
│   ├── bind_warp.particle.json
│   ├── buffs
│   │   ├── bind_effect_buff.particle.json
│   │   ├── crystal_pop_buff.particle.json
│   │   ├── instant_recover_buff.particle.json
│   │   ├── nether_domain_buff.particle.json
│   │   ├── self_destruct_buff.particle.json
│   │   ├── void_terminate_buff.particle.json
│   │   └── wind_pulse_buff.particle.json
│   ├── cape_shine_emitter.particle.json
│   ├── cape_sparkle_block_break.particle.json
│   ├── cape_sparkle_emitter.particle.json
│   ├── cape_void_emitter.particle.json
│   ├── collector
│   │   ├── collector_idle.particle.json
│   │   ├── collector_point.particle.json
│   │   └── collector_start.particle.json
│   ├── domain_caster.particle.json
│   ├── explosion_smoke.particle.json
│   ├── explosion_wave.particle.json
│   ├── fire_ring.particle.json
│   ├── fire_spiral.particle.json
│   ├── quantum_ring.particle.json
│   ├── quantum_smoke.particle.json
│   ├── rarity
│   │   ├── rarity_equip.json
│   │   ├── rarity_equip_common.json
│   │   ├── rarity_equip_deity.json
│   │   ├── rarity_equip_epic.json
│   │   ├── rarity_equip_legendary.json
│   │   ├── rarity_equip_rare.json
│   │   └── rarity_equip_uncommon.json
│   ├── sky_burst.particle.json
│   ├── void_warp.particle.json
│   └── wind_impulse.particle.json
├── render_controllers
│   ├── cape.render_controllers.json
│   └── elytra.render_controllers.json
├── subpacks
│   └── default
│       └── entity
│           └── player.entity.json
├── texts
│   ├── en_US.lang
│   └── languages.json
└── ui
    ├── _global_variables.json
    ├── _ui_defs.json
    ├── capes.ui
    ├── capes_common.ui
    ├── hud_screen.json
    ├── server_form.json
    └── settings_screen.json
```

* **Original Artwork Assets**
  * **License:** [CC BY-ND 4.0](COPYING.CC-BY-ND-4.0)
  * **Scope:**[^1]
```
bundle/VisualCapesRP/textures/capes/
├── +custom
│   └── custom
│       ├── custom1.png
│       ├── custom10.png
│       ├── custom11.png
│       ├── custom12.png
│       ├── custom13.png
│       ├── custom14.png
│       ├── custom15.png
│       ├── custom16.png
│       ├── custom17.png
│       ├── custom18.png
│       ├── custom19.png
│       ├── custom2.png
│       ├── custom20.png
│       ├── custom3.png
│       ├── custom4.png
│       ├── custom5.png
│       ├── custom6.png
│       ├── custom7.png
│       ├── custom8.png
│       └── custom9.png
├── eclipse
│   ├── icon-elytra.png
│   ├── texture.png
│   ├── texture1.png
│   ├── texture2.png
│   ├── texture3.png
│   ├── texture4.png
│   ├── texture5.png
│   ├── texture6.png
│   ├── texture7.png
│   ├── texture8.png
│   ├── texture9.png
│   ├── texture10.png
│   ├── texture11.png
│   ├── texture12.png
│   ├── texture13.png
│   ├── texture14.png
│   ├── texture15.png
│   ├── texture16.png
│   ├── texture17.png
│   ├── texture18.png
│   ├── texture19.png
│   ├── texture20.png
│   ├── texture21.png
│   ├── texture22.png
│   ├── texture23.png
│   ├── texture24.png
│   ├── texture25.png
│   ├── texture26.png
│   ├── texture27.png
│   ├── texture28.png
│   ├── texture29.png
│   ├── texture30.png
│   ├── texture31.png
│   ├── texture32.png
│   ├── texture33.png
│   ├── texture34.png
│   ├── texture35.png
│   ├── texture36.png
│   ├── texture37.png
│   ├── texture38.png
│   ├── texture39.png
│   ├── texture40.png
│   ├── texture41.png
│   ├── texture42.png
│   ├── texture43.png
│   ├── texture44.png
│   ├── texture45.png
│   └── texture46.png
├── thunderstorm
│   ├── icon-elytra.png
│   ├── texture.png
│   ├── texture1.png
│   ├── texture2.png
│   ├── texture3.png
│   ├── texture4.png
│   ├── texture5.png
│   ├── texture6.png
│   ├── texture7.png
│   ├── texture8.png
│   ├── texture9.png
│   ├── texture10.png
│   ├── texture11.png
│   ├── texture12.png
│   ├── texture13.png
│   └── texture14.png
├── turnaround
│   ├── icon-elytra.png
│   └── texture.png
└── ui
    └── addon_logo.png

bundle/VisualCapesRP/textures/misc/
├── enchanted_actor_glint.png
└── enchanted_item_glint.png
```

* **Mojang (Minecraft) Original Assets and/or Derivative Works**
  * **License:** Subject to [Minecraft End User License Agreement (EULA)](https://www.minecraft.net/en-us/usage-guidelines)[^2]
  * **Scope:**[^1]
```
bundle/VisualCapesRP/textures/capes/
├── +aprilfools
│   ├── Awesom.png
│   ├── Awesom_Cape.png
│   ├── Blonk.png
│   ├── Blonk_Cape.png
│   ├── No_circle.png
│   ├── No_circle_Cape.png
│   ├── Nyan.png
│   ├── Nyan_Cape.png
│   ├── Squid.png
│   ├── Squid_Cape.png
│   ├── Veterinarian.png
│   └── Veterinarian_Cape.png
├── +custom
│   ├── AxolotlCape-icon.png
│   ├── AxolotlCape.png
│   ├── BedrockSulfurCubeCape-icon-elytra.png
│   ├── BedrockSulfurCubeCape-icon.png
│   ├── BedrockSulfurCubeCape.png
│   ├── BeeCape-icon.png
│   ├── BeeCape.png
│   ├── BreezeCape-icon.png
│   ├── BreezeCape.png
│   ├── CamelCape-icon.png
│   ├── CamelCape.png
│   ├── CreeperCape-icon.png
│   ├── CreeperCape.png
│   ├── DeepslateCape-icon.png
│   ├── DeepslateCape.png
│   ├── DolphinCape-icon.png
│   ├── DolphinCape.png
│   ├── EnderdragonCape-icon-elytra.png
│   ├── EnderdragonCape-icon.png
│   ├── EnderdragonCape.png
│   ├── EvokerCape-icon.png
│   ├── EvokerCape.png
│   ├── FrogCape-icon.png
│   ├── FrogCape.png
│   ├── NetherStarCape-icon-elytra.png
│   ├── NetherStarCape-icon.png
│   ├── NetherStarCape.png
│   ├── PandaCape-icon.png
│   ├── PandaCape.png
│   ├── PiglinBruteCape-icon.png
│   ├── PiglinBruteCape.png
│   ├── RedstoneCape-icon.png
│   ├── RedstoneCape.png
│   ├── SheepCape-icon.png
│   ├── SheepCape.png
│   ├── SulfurCubeCape-icon-elytra.png
│   ├── SulfurCubeCape-icon.png
│   ├── SulfurCubeCape.png
│   ├── VillagerCape-icon.png
│   ├── VillagerCape.png
│   ├── _custom.png
│   └── _templates
│       ├── bedrock-character1.png
│       ├── elytra.png
│       ├── rarity_common.png
│       ├── rarity_epic.png
│       ├── rarity_legendary.png
│       ├── rarity_rare.png
│       └── rarity_uncommon.png
├── 15thYear
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── bacon
│   ├── icon.png
│   └── texture.png
├── blueprint
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── bugTracker
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── builder
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── cheapsh0t
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── cherry
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── chineseTranslator
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── christmas
│   ├── icon.png
│   └── texture.png
├── cobalt
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── copper
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── crafter
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── crowdinTranslator
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── dannyBstyle
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── default_elytra.png
├── eclipse
│   └── icon.png
├── fjstudios
│   ├── icon.png
│   └── texture.png
├── founder
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── home
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── idaho
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── mapmaker
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── mcCommon
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── mcExperience
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── mcc15
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── menace
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── microsoft
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── microsoftXbox360
│   ├── icon.png
│   └── texture.png
├── millionth
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── minecon2011
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── minecon2012
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── minecon2013
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── minecon2015
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── minecon2016
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── mojang
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── mojangClassic
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── mojangOffice
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── mojangStudios
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── moonlightTrail
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── newyear
│   ├── icon.png
│   └── texture.png
├── oxeye
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── pan
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── party
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── prismarine
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── progressPride
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── scrolls
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── snowman
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── spade
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── thunderstorm
│   └── icon.png
├── tiktok
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── turnaround
│   └── icon.png
├── turtle
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── twitch
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── ui
│   ├── achievementLocked.png
│   ├── achievementUnlocked.png
│   ├── cells_background.json
│   ├── cells_background.png
│   ├── hotbar_0.png
│   ├── rarity_per_cape.png
│   ├── visual_capes_glyph.png
│   └── visual_capes_glyph_color.png
├── valentine
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── vanilla
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
├── xbox360FirstBirthday
│   ├── icon.png
│   └── texture.png
├── yearn
│   ├── icon-elytra.png
│   ├── icon.png
│   └── texture.png
└── zombieHorse
    ├── icon-elytra.png
    ├── icon.png
    └── texture.png

bundle/VisualCapesRP/textures/particle/
└── ascii_sga.png

bundle/VisualCapesRP/sounds
└── visualcapes
    ├── beacon_deactivate.fsb
    ├── challenge_complete.ogg
    ├── fizz.fsb
    ├── levelup.fsb
    ├── levelup_legacy.ogg
    ├── portal_travel.fsb
    ├── respawn_anchor_charge2.fsb
    ├── thunder1.fsb
    └── trident_thunder2.ogg
```

* **The "Software" Warranty Disclaimer**
  * **License:** [Apache 2.0](COPYING.APACHE-2.0)

```
Copyright 2026 EditorOne XI

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

  * **Scope:**
    * Exclusively for this repository only.

---

*Disclaimer: NOT AN OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT*

[^1]: This directory is covered by the repository's referred license. Its contents are implemented within the package source and are not maintained as separate files in this repository.
[^2]: All underlying rights for these assets remain the exclusive property of Mojang AB.
