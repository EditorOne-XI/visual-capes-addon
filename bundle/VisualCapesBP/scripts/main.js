/****************************************************************************************************\
| Visual Capes Add-on Script
| - by EditorOne5312 | EditorOne XI - All rights reserved.
|   $ Youtube: EditorOne XI
|   $ Reddit: u/EditorOneXI
|   $ GitHub: EditorOne-XI
|   $ Modbay: EditorOne XI
|   $ MCPEDL: EditorOne (Legacy Versions)
| > IF DOWNLOADED FROM ANOTHER SITE BESIDES MY SOURCES, REPORT THE SITE IMMEDIATELY! (Indirectly to me)
\****************************************************************************************************/
import { world, system, EntityComponentTypes, GameMode } from '@minecraft/server';
import { offset } from './offset.js';

void system.runInterval(() => {
  try {
    world.getAllPlayers().forEach(player => {
      let id = player.getComponent(EntityComponentTypes.MarkVariant);
      if (id?.value <= -1000 && !(player.getGameMode() === GameMode.Spectator) && !(player.getEffect('invisibility'))) {
        switch (id.value - offset) {
          case -1000:
            player.dimension.spawnParticle("visualcapes:cape_void_emitter", player.location);
            break;
          case -1001:
            player.dimension.spawnParticle("visualcapes:cape_sparkle_emitter", player.location);
            break;
          case -1002:
            player.dimension.spawnParticle("visualcapes:cape_shine_emitter", player.location);
            break;
        }
      }
      id = null;
    });
  } catch (error) {}
}, 2);
