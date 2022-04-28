const { MessageEmbed } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
  name: "grab",
  description: "Lưu lại bài hát trong Inbox Discord.",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["save"],
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
        "❌ | **Danh sách trống...**"
      );
    if (!player.playing)
      return client.sendTime(
        message.channel,
        "❌ | **Danh sách trống...**"
      );
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **Vào kênh Vocie để điều khiển bot.**"
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
        ":x: | **Vào cùng kênh Voice với bot để điều khiển bot.**"
      );
    message.author
      .send(
        new MessageEmbed()
          .setAuthor(
            `Mình đã lưu lại bài này cho bạn rồi nè ~`,
            client.user.displayAvatarURL({
              dynamic: true,
            })
          )
          .setThumbnail(
            `https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`
          )
          .setURL(player.queue.current.uri)
          .setColor(client.botconfig.EmbedColor)
          .setTitle(`**${player.queue.current.title}**`)
          .addField(
            `⌛ Thời lượng: `,
            `\`${prettyMilliseconds(player.queue.current.duration, {
              colonNotation: true,
            })}\``,
            true
          )
          .addField(`🎵 Từ kênh: `, `\`${player.queue.current.author}\``, true)
          .addField(
            `▶ Phát ngay bằng cách nhập lệnh:`,
            `\`${
              GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
            }play ${player.queue.current.uri}\``
          )
          .addField(`🔎 Bài hát được tìm thấy ở:`, `<#${message.channel.id}>`)
          .setFooter(
            `Được yêu cầu bởi: ${player.queue.current.requester.tag}`,
            player.queue.current.requester.displayAvatarURL({
              dynamic: true,
            })
          )
      )
      .catch((e) => {
        return message.channel.send("**:x: Bạn khoá DMs rồi kìa**");
      });

    client.sendTime(message.channel, "✅ | **Kiểm tra DMs nhé!**");
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
      const user = client.users.cache.get(interaction.member.user.id);
      const member = guild.members.cache.get(interaction.member.user.id);
      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(
          interaction,
          "❌ | **Hàng đợi hiện trống... Bạn có thể bật gì đó chăng, ví dụ như Hút pin của Nam CT?**"
        );
      if (!player.playing)
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
          ":x: | **Bạn phải ở cùng kênh voice với Bot để sử dụng Bot!**"
        );
      try {
        let embed = new MessageEmbed()
          .setAuthor(`Mình đã lưu lại bài này cho bạn rồi nè ~`, client.user.displayAvatarURL())
          .setThumbnail(
            `https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`
          )
          .setURL(player.queue.current.uri)
          .setColor(client.botconfig.EmbedColor)
          .setTimestamp()
          .setTitle(`**${player.queue.current.title}**`)
          .addField(
            `⌛ Thời lượng: `,
            `\`${prettyMilliseconds(player.queue.current.duration, {
              colonNotation: true,
            })}\``,
            true
          )
          .addField(`🎵 Từ kênh: `, `\`${player.queue.current.author}\``, true)
          .addField(
            `▶ Phát ngay bằng cách nhập lệnh:`,
            `\`${
              GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
            }play ${player.queue.current.uri}\``
          )
          .addField(`🔎 Bài hát được tìm thấy ở:`, `<#${interaction.channel_id}>`)
          .setFooter(
            `Được yêu cầu bởi: ${player.queue.current.requester.tag}`,
            player.queue.current.requester.displayAvatarURL({
              dynamic: true,
            })
          );
        user.send(embed);
      } catch (e) {
        return client.sendTime(interaction, "**:x: Bạn tắt DMs rồi kìa!**");
      }

      client.sendTime(interaction, "✅ | **Kiểm tra DMs nhé!**");
    },
  },
};
