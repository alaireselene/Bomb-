const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
  .setName("remove")
  .setDescription("Xoá một bài hát khỏi hàng chờ.")
  .addNumberOption((option) =>
    option
      .setName("number")
      .setDescription("Nhập số thứ tự của track.")
      .setRequired(true)
  )

  .setRun(async (client, interaction) => {
    const args = interaction.options.getNumber("number");

    let player = client.manager.players.get(interaction.guild.id);
    if (!player) {
      const queueEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription("Hàng đợi trống");
      return interaction.reply({ embeds: [queueEmbed], ephemeral: true });
    }

    if (!interaction.member.voice.channel) {
      const joinEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(
          "Vào 1 kênh Voice để chạy bot!"
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
          "Vào cùng kênh voice với bot để chạy lệnh này!"
        );
      return interaction.reply({ embeds: [sameEmbed], ephemeral: true });
    }

    await interaction.deferReply();

    const position = Number(args) - 1;
    if (position > player.queue.size) {
      let thing = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(
          `Hàng chờ hiện chỉ còn **${player.queue.size}** track.`
        );
      return interaction.editReply({ embeds: [thing] });
    }

    const song = player.queue[position];
    player.queue.remove(position);

    const number = position + 1;
    let thing = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setDescription(`Đã xoá **${number}** khỏi hàng chờ.`);
    return interaction.editReply({ embeds: [thing] });
  });

module.exports = command;
