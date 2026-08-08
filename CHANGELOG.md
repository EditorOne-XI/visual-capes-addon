# Visual Capes Add-on: Changelog

| Versions | Major Update |
| :---: | :--- |
| [2.6.0](#v260) | Vibrant Visuals Support |
| [2.5.0](#v250-cape-achievements) | GitHub Migration |
| [2.1.0](#v210) | Deity Rarity |
| [2.0.0](#v200-cape-rarity-update) | Pack Extension |
| [1.1.0](#v110) | Custom Cape Slots |
| [1.0.0](#v100-first-release) | First Release |


## v2.6.0

* Added enabling **Vibrant Visuals** support.
* Removed from player.json:`minecraft:apply_knockback_rules` because they are using beta preset features: (v1.26.30)
  * `extra_knockback_approach`
  * `horizontal_hit_angle_scale`
  * `scale_previous_velocity`
  * `scale_with_damage`
  * `vertical_hit_angle_scale`
  * `vertical_position_angle_scale`
* Added 4 Vanilla Minecraft Capes:
  * Builder Cape
  * Moonlight Trail Cape
  * Crafter Cape
  * 4J Studios Cape
* Added 2 Custom Preset Capes:
  * Sulfur Cube Cape
  * Bedrock Sulfur Cube Cape
* Added New Deity Cape:
  * Thunderstorm Cape


## v2.5.0 (Cape Achievements)

> [!NOTE]
> This version was not released publicly.

* Added 4 Vanilla Minecraft Capes:
  * Copper Cape
  * Zombie Horse Cape
  * Blueprint Cape
  * Idaho Cape (Hidden)
* Removed 2 Custom Preset Capes:
  * OptiFine Cape
  * LunarClient Cape
* Added New Deity Cape:
  * Void Cape
* Added 10 Extra Custom Capes Templates.
* Added enchantment glint texture with red glint color.
* Added add-on label on top left of HUD UI stacked with Chat UI to HUD.
* Updated Visual Capes Add-on UI section.

> [!IMPORTANT]
> There are changes made with the capes to implement full license of this add-on and comply with [Minecraft Usage Guidelines](https://www.minecraft.net/en-us/usage-guidelines).

> [!WARNING]
> Removed **Version Selection** from pack settings because version variation would likely to mismatch Behavior Pack and Extension Pack. And I am having issues sourcing JSON files.

### Pack Extension

* Added **Cape Achievements**, can be obtained in any system modes unless restricted.
* Modified Legendary Rarity requirements:
  * From: 64 Experience Bottle and 4 Enchanted Golden Apple.
  * To: 64 Experience Bottle and 16 Enchanted Golden Apple.
* Item name **Reward Convert** can be now named to any item.
* Optimized Cape classes from scripts.
* Added **Language (Locale)** support to scripts, scripts now use `.lang` files but not every text is translatable.
* Adjusted Capes Forms where back buttons are added, and the X button exits the form.
* Added Custom Commands:
  * `/cape`
  * `/opcape` (Shifted from `/scriptevent` command)
  * `/caperegister`
  * `/dispell` (New feature)
  * `/achcape` (New feature)
  * `/opachcape` (New feature)
  * `/itemids` (New feature, debugging)


## v2.1.0

> [!NOTE]
> This version was not released publicly.

* Adjusted 5 existing capes:
  * (Function) `15th_year_cape` -> `fifteenth_year_cape`
  * (Type) `minecon2019_cape` -> `founder_cape`
  * JulianClark's Cape -> Snowman Cape
  * MrMessiah's Cape -> Spade Cape
  * (Type) `xbox360_1st_birthday` -> `xbox360_1st_birthday_cape`
* Added 8 Vanilla Minecraft Capes:
  * Common Cape
  * MCC 15th Year Cape
  * Mojang Office Cape
  * Home Cape
  * Menace Cape
  * Yearn Cape
  * Minecraft Experience Cape
  * Oxeye Cape
* Added 2 New Capes:
  * Nether Star Withered Cape
* Added New Deity Cape:
  * God Cape
* Added Deity rarity and its mechanics on how to obtain Deity rarity capes.


## v2.0.0 (Cape Rarity Update)

* Added 6 Vanilla Minecraft Capes:
  * Cherry Cape
  * Follower's Cape
  * Purple Heart Cape
  * 15-Year Anniversary Cape
  * Progress Pride Cape
  * 1st Birthday Cape
* Added 15 Custom Capes: (Intended for 15 Year Anniversary of Minecraft)
  * Creeper Cape
  * Redstone Cape
  * Ender Dragon Cape
  * Evoker Cape
  * Sheep Colored-Cape
  * Dolphin Cape
  * Panda Cape
  * Villager Cape
  * Bee Cape
  * Piglin Brute Cape
  * Axolotl Cape
  * Deepslate Block Cape
  * Frog Cape
  * Camel Cape
  * Breeze Cape
* Fixed Custom Capes not showing.
* Added 5 Extra **Custom Capes Slot** (now called Templates).
* Added 6 April Fools Capes from Java Edition April Fools Snapshot:
  * Awesom Caep
  * Blonk Caep
  * No Circle Caep
  * Nyan Caep
  * Squid Caep
  * Veterinarian Caep
* Renamed some Capes' name prior to their original name.
* Added **Pack Extension** for Minecraft version 1.21 and above.
* Added Visual Capes Add-on section in the settings screen.
* Description in the Pack Settings has been changed.


## v1.1.0

* Added 4 Capes Available:
  * Christmas Cape
  * Microsoft Xbox 360 Cape
  * New Year Cape
  * Vanilla Cape
* Added 2 Custom Capes and 5 Custom Cape Slots:
  * LunarClient Standard Cape
  * OptiFine Standard Cape
* Description in the Pack Settings has been expanded.
* Available capes that does not have Elytra texture will not change the Elytra texture. (*Unsure for other Platforms*)

> [!WARNING]
> Discontinuation of adding your own custom cape due to expansion of **Custom Cape Slots**. Sorry for inconvenience.


## v1.0.0 (First Release)

* For Custom Capes, You can dm me on Reddit if you want to add your own custom cape in this addon! [EditorOne XI on Reddit](https://www.reddit.com/u/EditorOne5312)

I'll appreciate all of your feedbacks and bug reports!
