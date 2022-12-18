import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'

import { Color } from '../constants'
import { UserError } from '../errors'
import { createEmbedMessage } from '../helpers'
import { ITrack, YouTubeService } from '../player/services'
import {
  getInteractionData,
  getPlayerData,
  getProgressBar,
  ProgressBarType
} from './helpers'

@Discord()
export class PlayCommand {
  private readonly yt = new YouTubeService()

  @Slash({
    name: 'play',
    description: 'Play or resume a track'
  })
  public async play(
    @SlashOption({
      type: ApplicationCommandOptionType.String,
      name: 'query',
      description: 'sus'
    })
    query: string | null,
    interaction: CommandInteraction
  ) {
    const { guild, member, voice } = await getInteractionData(interaction)
    let { manager, player } = getPlayerData(guild)

    await interaction.deferReply()

    if (!voice) {
      throw new UserError(
        'Bruh',
        'You need to be in a voice channel to use this command'
      )
    }

    if (player && player.channel.id !== voice.id) {
      throw new UserError(
        'Bruh',
        'You need to be in the same voice channel as the bot to use this command'
      )
    }

    player = manager.create({
      channel: voice
    })

    if (!query) {
      throw new UserError(
        'Bruh',
        'okay i pull up hop out at the after party you and all your friends yeah they love to get naughty'
      )
    }

    const track = await this.yt.find(query!)
    const resource = await this.yt.makeResource(track)

    await interaction.editReply(
      createEmbedMessage({
        title: `${track.artist} - ${track.title}`,
        url: track.url,
        color: Color.Blue,
        description: getProgressBar({
          type: ProgressBarType.Split,
          current: 0,
          total: track.duration
        }),
        thumbnail: {
          url: track.cover
        },
        fields: [
          {
            name: '\\🕔 Duration:',
            value: this.formatDuration(track.duration),
            inline: true
          },
          {
            name: '\\📺 Channel:',
            value: track.channel.name || 'Unknown',
            inline: true
          }
        ]
      })

      //
    )

    await player.play(resource)
  }

  private formatTrack(track: ITrack, number: number): string {
    const duration = this.formatDuration(track.duration)

    // prettier-ignore
    return `**${number + 1}. [${track.artist} - ${track.title}](${track.url}) - ${duration}**`
  }

  private formatDuration(duration: number): string {
    const hh = Math.floor(duration / 3600)
    const ii = Math.floor((duration - hh * 3600) / 60)
    const ss = duration - hh * 3600 - ii * 60

    return `${hh}:${ii}:${ss}`
  }
}
