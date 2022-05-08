const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
  .setName("loopqueue")
  .setDescription("Bật chế độ lặp lại hàng chờ")
  .setRun(async (client, interaction, options) => {
    let player = client.manager.players.get(interaction.guild.id);
    if (!player) {
      return interaction.reply({
        embeds: [client.ErrorEmbed("Hàng chờ trống.")],
      });
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
    if (player.setQueueRepeat(!player.queueRepeat));
    const queueRepeat = player.queueRepeat ? "bật" : "tắt";

    let loopembed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setDescription(`:thumbsup: | **Chế độ lặp hàng chờ đã đuợc \`${queueRepeat}\`**`);
    interaction.reply({ embeds: [loopembed] });
  });

module.exports = command;
