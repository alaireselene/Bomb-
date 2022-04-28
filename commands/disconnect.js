const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "disconnect",
  description: "Tắt nhạc, rời kênh Voice.",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["leave", "exit", "quit", "dc", "stop"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **Vào kênh Voice để điều khiển bot.**"
      );
    if (!player)
      return client.sendTime(
        message.channel,
        "❌ | **Danh sách trống...**"
      );
    await client.sendTime(message.channel, ":notes: | **Đã ngắt kết nối!**");
    await message.react("✅");
    player.destroy();
  },

  SlashCommand: {
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, interaction, args, { GuildDB }) => {
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);

      if (!member.voice.channel)
        return client.sendTime(
          interaction,
          "❌ | **Vào kênh Voice để điều khiển bot.**"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
          `❌ | **Bạn phải ở ${guild.me.voice.channel} để điều khiển bot.**`
        );

      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(
          interaction,
          "❌ | **Danh sách trống...**"
        );
      player.destroy();
      client.sendTime(interaction, ":notes: | **Đã ngắt kết nối!**");
    },
  },
};
