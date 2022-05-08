const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
  .setName("pause")
  .setDescription("Tạm dừng bài hát hiện tại.")
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

    if (player.paused) {
      let pembed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription("❌ | **Track đang phát đang ở trạng thái dừng, vui lòng không thực hiện thao tác thừa!**");
      return interaction.reply({ embeds: [pembed], ephemeral: true });
    }

    player.pause(true);

    let pauseembed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setDescription(`⏸ **Đã dừng!**`);
    return interaction.reply({ embeds: [pauseembed] });
  });

module.exports = command;
