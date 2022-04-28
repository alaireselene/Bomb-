const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
  name: "resume",
  description: "Tiếp tục bài hát còn dang dở",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: [],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    if (!player)
      return client.sendTime(
        message.channel,
        "❌ | **Hàng đợi hiện trống... Bạn có thể bật gì đó chăng, ví dụ như Hút pin của Nam CT?**"
      );
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **Vào 1 kênh voice để chạy bot!**"
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
        ":x: | **Vào cùng kênh voice với bot để chạy bot!**"
      );

    if (player.playing)
      return client.sendTime(
        message.channel,
        "❌ | **Bài hát hiện đang được phát!**"
      );
    player.pause(false);
    await message.react("✅");
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
          "❌ | **Vào kênh Vocie để điều khiển bot!**"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
          ":x: | **Vào cùng kênh voice với bot để chạy bot!**"
        );

      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(
          interaction,
          "❌ | **Hàng đợi hiện trống... Bạn có thể bật gì đó chăng, ví dụ như Hút pin của Nam CT?**"
        );
      if (player.playing)
        return client.sendTime(
          interaction,
          "❌ | **Bài hát hiện đang được phát!**"
        );
      player.pause(false);
      client.sendTime(interaction, "**⏯ Đã bỏ tạm dừng, tiếp tục phát nhạc!**");
    },
  },
};
