const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
  .setName("volume")
  .setDescription("Điều khiển âm lượng hiên tại.")
  .addNumberOption((option) =>
    option
      .setName("amount")
      .setDescription("Nhập 1 số từ** \`1 - 100\`")
      .setRequired(false)
  )
  .setRun(async (client, interaction) => {
    const category = interaction.options.getNumber("options");

    let player = client.manager.players.get(interaction.guild.id);
    if (!player) {
      const queueEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription("❌ | **Hàng đợi trống**");
      return interaction.reply({ embeds: [queueEmbed], ephemeral: true });
    }

    if (!interaction.member.voice.channel) {
      const joinEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(
          "❌ | **Vào 1 kênh voice để chạy lệnh!**"
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
          "❌ | **Vào cùng kênh voice với bot để chạy bot!**"
        );
      return interaction.reply({ embeds: [sameEmbed], ephemeral: true });
    }

    let vol = interaction.options.getNumber("amount");
    if (!vol || vol < 1 || vol > 125) {
      const NumberEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(`:loud_sound: | **Âm lượng hiện tại: ${player.volume}**`);
      return interaction.reply({ embeds: [NumberEmbed] });
    }

    player.setVolume(vol);
    return interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor(client.config.embedColor)
          .setDescription(
            `:loud_sound: | Đã chuyển âm lượng về **${player.volume}**`
          ),
      ],
    });
  });

module.exports = command;
