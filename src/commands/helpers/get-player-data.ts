import { Guild } from 'discord.js'

import { Player, PlayerManager } from '../../player'

export type PlayerData = {
  manager: PlayerManager
  player: Player | null
}

export const getPlayerData = (guild: Guild): PlayerData => {
  const manager = PlayerManager.instance

  return {
    manager,
    player: manager.get({
      guild
    })
  }
}
