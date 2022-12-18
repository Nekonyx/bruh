import { VoiceBasedChannel, VoiceChannel } from 'discord.js'
import { createReadStream } from 'fs'

import {
  AudioPlayer,
  AudioResource,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnection
} from '@discordjs/voice'

export type PlaybackOptions = {
  channel: VoiceBasedChannel
}

export class Playback {
  public readonly channel: VoiceBasedChannel

  public readonly connection: VoiceConnection

  public readonly audioPlayer: AudioPlayer

  public constructor(opts: PlaybackOptions) {
    this.channel = opts.channel

    this.connection = joinVoiceChannel({
      adapterCreator: opts.channel.guild.voiceAdapterCreator,
      channelId: opts.channel.id,
      guildId: opts.channel.guild.id
    })

    this.audioPlayer = createAudioPlayer()

    this.connection.subscribe(this.audioPlayer)
  }

  public async play(resource: AudioResource) {
    this.audioPlayer.play(resource)
  }

  public async stop() {
    this.audioPlayer.stop()
    this.connection.destroy()
  }

  public async resume() {
    this.audioPlayer.unpause()
  }

  public async pause() {
    this.audioPlayer.pause()
  }
}
