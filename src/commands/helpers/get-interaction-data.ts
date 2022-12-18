import {
  BaseInteraction,
  Guild,
  GuildMember,
  Message,
  TextBasedChannel,
  VoiceBasedChannel
} from 'discord.js'

export type InteractionData = {
  guild: Guild
  member: GuildMember
  message?: Message
  text?: TextBasedChannel
  voice?: VoiceBasedChannel
}

export const getInteractionData = async (
  interaction: BaseInteraction
): Promise<InteractionData> => {
  const guild = await interaction.guild!.fetch()
  const member = await guild.members.fetch(interaction.user.id);

  const data: InteractionData = {
    guild,
    member,
  }

  data.voice = member.voice.channel ?? undefined

  if (interaction.isRepliable()) {
    data.text = await interaction.channel!.fetch()
  }

  if (interaction.isMessageComponent()) {
    data.message = await interaction.message!.fetch()
  }

  return data
}
