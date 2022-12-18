import { BaseMessageOptions, EmbedBuilder, EmbedData } from 'discord.js'

import { Color } from '../constants'

export const createEmbed = (data: EmbedData): EmbedBuilder => {
  return new EmbedBuilder({
    color: Color.Blue,
    ...data
  })
}

export const createEmbedMessage = (data: EmbedData): BaseMessageOptions => {
  return {
    embeds: [createEmbed(data)]
  }
}
