import { Channel, Video } from 'youtube-sr'

import { ITrack } from '../types'

export interface IYouTubeTrack extends ITrack {
  channel: Channel
  video: Video
}
