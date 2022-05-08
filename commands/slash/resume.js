const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
  .setName("resume")
  .setDescription("Tiếp tục bài hát còn dang dở.")
  .setRun(async (client, interaction, options) => {
    let player = client.manager.players.get(interaction.guild.id);
    if (!player) {
      const queueEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription("❌ | Hàng chờ hiện trống...");
      return interaction.reply({ embeds: [queueEmbed], ephemeral: true });
    }

    if (!interaction.member.voice.channel) {
      const joinEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(
          "❌ | **Vào cùng kênh voice với bot để chạy lệnh này!**"
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

    if (!player.paused) {
      let ResumedEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription("❌ | **Track đang phát đã đuợc phát tiếp, vui lòng không thực hiện thao tác thừa!**");
      return interaction.reply({ embeds: [ResumedEmbed], ephemeral: true });
    }
    player.pause(false);
    let ResEmbed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setDescription(`⏯ **Đã tiếp tục!**`);
    return interaction.reply({ embeds: [ResEmbed] });
  });

module.exports = command;
