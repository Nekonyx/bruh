import { AudioResource } from '@discordjs/voice'

import { ITrack } from './types'

export abstract class ServiceBase<T extends ITrack> {
  public abstract find(query: string): Promise<T>

  public abstract findList(query: string): Promise<T[]>

  public abstract makeResource(track: T): Promise<AudioResource<T>>
}
