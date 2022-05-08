const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
  name: "remove",
  description: `Xoá một bài hát khỏi hàng chờ`,
  usage: "[số thứ tự]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["rm"],

  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.players.get(message.guild.id);
    const song = player.queue.slice(args[0] - 1, 1);
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

    if (!player.queue || !player.queue.length || player.queue.length === 0)
      return message.channel.send("Hàng chờ trống trơn, có gì mà xoá bạn ơi?");
    let rm = new MessageEmbed()
      .setDescription(
        `✅ **|** Đã xoá bài hát **\`${Number(args[0])}\`** khỏi hàng chờ!`
      )
      .setColor("GREEN");
    if (isNaN(args[0]))
      rm.setDescription(
        `**Cách xài - **${client.botconfig.prefix}\`remove [tên bài]\``
      );
    if (args[0] > player.queue.length)
      rm.setDescription(`Hàng chờ hiện chỉ còn ${player.queue.length} bài thôi!`);
    await message.channel.send(rm);
    player.queue.remove(Number(args[0]) - 1);
  },

  SlashCommand: {
    options: [
      {
        name: "track",
        value: "[track]",
        type: 4,
        required: true,
        description: "Xoá một bài hát khỏi hàng chờ",
      },
    ],
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
      const song = player.queue.slice(args[0] - 1, 1);
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
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
          ":x: | **Vào cùng kênh voice với bot để chạy bot!**"
        );

      if (!player.queue || !player.queue.length || player.queue.length === 0)
        return client.sendTime("❌ | **Hàng đợi hiện trống... Bạn có thể bật gì đó chăng, ví dụ như Hút pin của Nam CT?**");
      let rm = new MessageEmbed()
        .setDescription(
          `✅ | **Đã xoá bài hát** \`${Number(args[0])}\` khỏi hàng chờ!`
        )
        .setColor("GREEN");
      if (isNaN(args[0]))
        rm.setDescription(`**Usage:** \`${GuildDB.prefix}remove [track]\``);
      if (args[0] > player.queue.length)
        rm.setDescription(`Hàng chờ hiện chỉ còn ${player.queue.length} bài thôi!`);
      await interaction.send(rm);
      player.queue.remove(Number(args[0]) - 1);
    },
  },
};
