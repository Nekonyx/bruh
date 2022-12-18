import autoBind from 'auto-bind'
import { VoiceBasedChannel, VoiceChannel } from 'discord.js'

import { AudioResource } from '@discordjs/voice'

import { Playback } from './playback'

export type PlayerOptions = {
  channel: VoiceBasedChannel
}

export class Player {
  public readonly channel: VoiceBasedChannel
  public readonly playback: Playback

  public constructor(opts: PlayerOptions) {
    autoBind(this)

    this.channel = opts.channel

    this.playback = new Playback({
      channel: opts.channel
    })
  }

  public async play(resource: AudioResource) {
    await this.playback.play(resource)
  }

  public async stop() {
    await this.playback.stop()
  }

  public async resume() {
    await this.playback.resume()
  }

  public async pause() {
    await this.playback.pause()
  }
}
