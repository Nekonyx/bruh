import { Video, YouTube } from 'youtube-sr'
import ytdl from 'ytdl-core-discord'

import { createAudioResource, StreamType } from '@discordjs/voice'

import { ServiceBase } from '../service-base'
import { IYouTubeTrack } from './youtube.track'

const directBaseUrls = [
  'youtu.be/',
  'youtube.com/watch?v=',
  'http://youtu.be/',
  'http://youtube.com/watch?v=',
  'https://youtu.be/',
  'https://youtube.com/watch?v='
]

enum QueryType {
  Direct = 'direct',
  Search = 'search'
}

export class YouTubeService extends ServiceBase<IYouTubeTrack> {
  public async find(query: string) {
    const type = this.resolveQueryType(query)
    let video: Video

    switch (type) {
      case QueryType.Direct: {
        video = await YouTube.getVideo(query)
        break
      }

      case QueryType.Search: {
        video = await YouTube.searchOne(query)
        break
      }
    }

    return this.videoToTrack(video)
  }

  public async findList(query: string) {
    const videos = await YouTube.search(query, {
      type: 'video',
      limit: 5
    })

    return videos.map((video) => {
      return this.videoToTrack(video)
    })
  }

  public async makeResource(track: IYouTubeTrack) {
    const stream = await ytdl(track.url, {
      quality: 'highestaudio',
      highWaterMark: 1 << 25
    })

    return createAudioResource<IYouTubeTrack>(stream, {
      inputType: StreamType.Opus,
      metadata: track,
      inlineVolume: true
    })
  }

  private resolveQueryType(query: string): QueryType {
    return directBaseUrls.some((x) => query.startsWith(x))
      ? QueryType.Direct
      : QueryType.Search
  }

  private videoToTrack(video: Video): IYouTubeTrack {
    const [artist, title] = video.title!.split(' - ')

    return {
      title,
      artist,
      video,
      id: video.id!,
      duration: video.duration / 1000,
      channel: video.channel!,
      cover: video.thumbnail!.url!,
      url: video.url
    }
  }
}
