const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");

const command = new SlashCommand()
  .setName("grab")
  .setDescription("Lưu lại bài hát trong Inbox Discord.")
  .setRun(async (client, interaction) => {
    let player = client.manager.players.get(interaction.guild.id);
    if (!player) {
      const queueEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription("❌ | **Hàng chờ trống**");
      return interaction.reply({ embeds: [queueEmbed], ephemeral: true });
    }

    if (!interaction.member.voice.channel) {
      const joinEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(
          "❌ | **Bạn phải vào kênh thoại để dùng lệnh này!**"
        );
      return interaction.reply({ embeds: [joinEmbed], ephemeral: true });
    }

    if (
      interaction.guild.me.voice.channel &&
      !interaction.guild.me.voice.channel.equals(
        interaction.member.voice.channel
      )
    ) {
      const sameEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(
          "❌ | **Vào cùng kênh voice với bot để chạy lệnh này!**"
        );
      return interaction.reply({ embeds: [sameEmbed], ephemeral: true });
    }

    const save = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setAuthor({
        name: "Mình đã lưu lại bài này cho bạn rồi nè ~",
        iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}`,
      })
      .setDescription(
        `**Tên bài hát là [${player.queue.current.title}](${player.queue.current.uri})**`
      )
      .addFields(
        {
          name: "⌛ Thời lượng:",
          value: `\`${prettyMilliseconds(player.queue.current.duration, {
            colonNotation: true,
          })}\``,
          inline: true,
        },
        {
          name: "🎵 Từ kênh:",
          value: `\`${player.queue.current.author}\``,
          inline: true,
        },
        {
          name: "🔎 Bài hát được tìm thấy ở:",
          value: `\`${interaction.guild}\``,
          inline: true,
        }
      );

    interaction.user.send({ embeds: [save] });

    return interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor(client.config.embedColor)
          .setDescription(
            "✅ | **Kiểm tra DMs nhé! **"
          ),
      ],
      ephemeral: true,
    });
  });

module.exports = command;
