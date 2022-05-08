const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
  .setName("clear")
  .setDescription("Xóa trống hàng chờ.")
  .setRun(async (client, interaction, options) => {
    let player = client.manager.players.get(interaction.guild.id);
    if (!player) {
      const queueEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription("❌ | **Danh sách trống...**");
      return interaction.reply({ embeds: [queueEmbed], ephemeral: true });
    }

    if (!interaction.member.voice.channel) {
      const joinEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(
          "❌ | **Vào 1 kênh Voice để chạy bot!**"
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

    if (!player.queue || !player.queue.length || player.queue.length === 0) {
      let cembed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription("❌ | **Không đủ track để xoá.**");

      return interaction.reply({ embeds: [cembed], ephemeral: true });
    }

    player.queue.clear();

    let clearembed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setDescription(`✅ | **Đã xoá hàng chờ!**`);

    return interaction.reply({ embeds: [clearembed] });
  });

module.exports = command;
