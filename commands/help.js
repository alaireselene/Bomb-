const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  description: "Thông tin về Bomb!",
  usage: "[lệnh]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["command", "commands", "cmd"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let Commands = client.commands.map(
      (cmd) =>
        `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix}${
          cmd.name
        }${cmd.usage ? " " + cmd.usage : ""}\` - ${cmd.description}`
    );

    let Embed = new MessageEmbed()
      .setAuthor(
        `Thông tin về ${client.user.username}`,
        client.botconfig.IconURL
      )
      .setColor(client.botconfig.EmbedColor)
      .setFooter(
        `Để biết thêm thông tin về từng lệnh, hãy nhập ${
          GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
        }help [lệnh] | Ngày vui vẻ!`
      ).setDescription(`${Commands.join("\n")}
  
  Phiên bản bot: v${require("../package.json").version}
  [✨ Support Server](${
    client.botconfig.SupportServer
  }) | Mã nguồn gốc ở: [GitHub](https://github.com/SudhanPlayz/Discord-MusicBot) | bởi [SudhanPlayz](https://github.com/SudhanPlayz) | Việt hóa bởi Sena.`);
    if (!args[0]) message.channel.send(Embed);
    else {
      let cmd =
        client.commands.get(args[0]) ||
        client.commands.find((x) => x.aliases && x.aliases.includes(args[0]));
      if (!cmd)
        return client.sendTime(
          message.channel,
          `❌ | Không tìm thấy lệnh.`
        );

      let embed = new MessageEmbed()
        .setAuthor(`Lệnh: ${cmd.name}`, client.botconfig.IconURL)
        .setDescription(cmd.description)
        .setColor("GREEN")
        //.addField("Tên:", cmd.name, true)
        .addField("Cách dùng khác:", `\`${cmd.aliases.join(", ")}\``, true)
        .addField(
          "Usage",
          `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix}${
            cmd.name
          }${cmd.usage ? " " + cmd.usage : ""}\``,
          true
        )
        .addField(
          "Quyền hạn:",
          "Người dùng: " +
            cmd.permissions.member.join(", ") +
            "\nBot: " +
            cmd.permissions.channel.join(", "),
          true
        )
        .setFooter(
          `Tiền tố lệnh: - ${
            GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
          }`
        );

      message.channel.send(embed);
    }
  },

  SlashCommand: {
    options: [
      {
        name: "command",
        description: "Thông tin về Bomb!",
        value: "command",
        type: 3,
        required: false,
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
      let Commands = client.commands.map(
        (cmd) =>
          `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix}${
            cmd.name
          }${cmd.usage ? " " + cmd.usage : ""}\` - ${cmd.description}`
      );

      let Embed = new MessageEmbed()
        .setAuthor(
          `Được yêu cầu bởi ${client.user.username}`,
          client.botconfig.IconURL
        )
        .setColor(client.botconfig.EmbedColor)
        .setFooter(
          `Để biết thêm thông tin về từng lệnh, hãy nhập ${
            GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
          }help [lệnh] | Ngày vui vẻ!`
        ).setDescription(`${Commands.join("\n")}
  
  Phiên bản bot: v${require("../package.json").version}
  [✨ Support Server](${
    client.botconfig.SupportServer
  }) | Mã nguồn gốc ở: [GitHub](https://github.com/SudhanPlayz/Discord-MusicBot) | bởi [SudhanPlayz](https://github.com/SudhanPlayz) | Việt hóa bởi Sena.`);
      if (!args) return interaction.send(Embed);
      else {
        let cmd =
          client.commands.get(args[0].value) ||
          client.commands.find(
            (x) => x.aliases && x.aliases.includes(args[0].value)
          );
        if (!cmd)
          return client.sendTime(
            interaction,
            `❌ | Không tìm thấy lệnh.`
          );

        let embed = new MessageEmbed()
          .setAuthor(`Lệnh: ${cmd.name}`, client.botconfig.IconURL)
          .setDescription(cmd.description)
          .setColor("GREEN")
          //.addField("Tên:", cmd.name, true)
          .addField("Cách dùng khác:", cmd.aliases.join(", "), true)
          .addField(
            "Cách sử dụng:",
            `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix}${
              cmd.name
            }\`${cmd.usage ? " " + cmd.usage : ""}`,
            true
          )
          .addField(
            "Quyền hạn:",
            "Người dùng: " +
              cmd.permissions.member.join(", ") +
              "\nBot: " +
              cmd.permissions.channel.join(", "),
            true
          )
          .setFooter(
            `Tiền tố lệnh: - ${
              GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
            }`
          );

        interaction.send(embed);
      }
    },
  },
};
