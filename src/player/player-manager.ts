import autoBind from 'auto-bind'
import { Guild, VoiceBasedChannel, VoiceChannel } from 'discord.js'

import { Player } from './player'

export type PlayerGetParams = {
  guild: Guild | string
}

export type PlayerCreateParams = {
  channel: VoiceBasedChannel
}

export class PlayerManager {
  public static instance = new PlayerManager()

  public readonly players = new Map<string, Player>()

  private constructor() {
    autoBind(this)
  }

  public get(params: PlayerGetParams): Player | null {
    const guildId =
      params.guild instanceof Guild ? params.guild.id : params.guild

    return this.players.get(guildId) || null
  }

  public create(params: PlayerCreateParams): Player {
    return new Player({
      channel: params.channel
    })
  }
}
