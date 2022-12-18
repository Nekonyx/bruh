import 'reflect-metadata'

import { Bot } from './bot'

const bootstrap = async () => {
  const bot = new Bot()
  await bot.start()
}

bootstrap()
  .then(() => {
    console.log('ready')
  })
  .catch((error) => {
    console.error('fatal:', error)
    process.exit(1)
  })
