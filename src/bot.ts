import autoBind from 'auto-bind'
import { IntentsBitField, Interaction } from 'discord.js'
import { Client } from 'discordx'
import { resolve } from 'path'

import { importx } from '@discordx/importer'

import { config } from './config'
import { Color } from './constants'
import { UserError } from './errors'
import { createEmbed, createEmbedMessage } from './helpers'

export class Bot {
  public readonly client = new Client({
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildPresences,
      IntentsBitField.Flags.GuildVoiceStates
    ]
  })

  public constructor() {
    autoBind(this)

    this.client.on('interactionCreate', this.onInteractionCreate)
  }

  public async start() {
    console.log('loading commands')
    await this.autoload()

    console.log('logging in')
    await this.client.login(config.bot.token)

    console.log('initializing commands')
    await this.client.initApplicationCommands()
  }

  private async autoload() {
    await importx(resolve(__dirname, 'commands/**/*.command.{ts,js}'))
  }

  private async onInteractionCreate(interaction: Interaction) {
    try {
      await this.client.executeInteraction(interaction)
    } catch (error) {
      let title = 'Interaction error'
      let description = 'An error occurred while executing this interaction.'
      let includeStackTrace = false

      if (error instanceof UserError) {
        title = error.title
        description = error.message
      } else {
        console.error('interaction error:', error)
        includeStackTrace = true
      }

      if (!interaction.isRepliable()) {
        return
      }

      const message = createEmbedMessage({
        title,
        description,
        color: Color.Red
      })

      if (includeStackTrace) {
        // @ts-expect-error
        message.embeds![0].addFields.push({
          name: 'Stack trace:',
          value: `\`\`\`${error}\`\`\``
        })
      }

      if (interaction.replied) {
        interaction.editReply(message)
      } else {
        interaction.reply(message)
      }
    }
  }
}
