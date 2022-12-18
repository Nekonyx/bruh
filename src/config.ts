import { readFileSync } from 'fs'
import { resolve } from 'path'
import { parse } from 'yaml'

export type Config = {
  bot: {
    token: string
  }
}

export const config: Config = parse(
  readFileSync(resolve(process.cwd(), 'config.yml'), 'utf8')
)
