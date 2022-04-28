const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
  name: "loopqueue",
  description: "Bật chế độ lặp lại hàng chờ",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["lq", "repeatqueue", "rq"],
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

    if (player.queueRepeat) {
      player.setQueueRepeat(false);
      client.sendTime(message.channel, `:repeat: Chế độ Lặp hàng chờ \`đã tắt\``);
    } else {
      player.setQueueRepeat(true);
      client.sendTime(message.channel, `:repeat: Chế độ Lặp hàng chờ \`đang bật\``);
    }
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
      let player = await client.Manager.get(interaction.guild_id);
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);
      const voiceChannel = member.voice.channel;
      let awaitchannel = client.channels.cache.get(interaction.channel_id); /// thanks Reyansh for this idea ;-;
      if (!player)
        return client.sendTime(
          interaction,
          "❌ | **Hàng đợi hiện trống... Bạn có thể bật gì đó chăng, ví dụ như Hút pin của Nam CT?**"
        );
      if (!member.voice.channel)
        return client.sendTime(
          interaction,
          "❌ | **Vào kênh Vocie để điều khiển bot!**"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(voiceChannel)
      )
        return client.sendTime(
          interaction,
          ":x: | **Vào cùng kênh voice với bot để chạy bot!**"
        );

      if (player.queueRepeat) {
        player.setQueueRepeat(false);
        client.sendTime(interaction, `:repeat: **Chế độ Lặp hàng chờ** \`đã tắt\``);
      } else {
        player.setQueueRepeat(true);
        client.sendTime(interaction, `:repeat: **Chế độ Lặp hàng chờ** \`Đang bật\``);
      }
      console.log(interaction.data);
    },
  },
};
