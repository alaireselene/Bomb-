const { MessageEmbed } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
  .setName("filters")
  .setDescription("Thêm hoặc sửa bộ lọc.")
  .addStringOption((option) =>
    option
      .setName(" Mẫu có sẵn:")
      .setDescription("Mẫu tuỳ chỉnh để thêm")
      .setRequired(true)
      .addChoice("Nightcore", "nightcore")
      .addChoice("BassBoost", "bassboost")
      .addChoice("Vaporwave", "vaporwave")
      .addChoice("Pop", "pop")
      .addChoice("Soft", "soft")
      .addChoice("Treblebass", "treblebass")
      .addChoice("Eight Dimension", "eightD")
      .addChoice("Karaoke", "karaoke")
      .addChoice("Làm mới", "off")
  )

  .setRun(async (client, interaction, options) => {
    const args = interaction.options.getString("preset");

    let player = client.manager.players.get(interaction.guild.id);

    if (!player) {
      const queueEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription("❌ | Server Discord này đang chưa có track nào trong hàng chờ!");
      return interaction.reply({ embeds: [queueEmbed], ephemeral: true });
    }

    if (!interaction.member.voice.channel) {
      const joinEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(
          "❌ | Bạn phải vào kênh thoại để dùng lệnh này!"
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
          "❌ | Vào cùng kênh voice với bot để chạy lệnh này!"
        );
      return interaction.reply({ embeds: [sameEmbed], ephemeral: true });
    }

    // create a new embed
    let thing = new MessageEmbed().setColor(client.config.embedColor);

    if (args == "nightcore") {
      thing.setDescription("✅ | Nightcore đã đuợc kích hoạt!");
      player.nightcore = true;
    } else if (args == "bassboost") {
      thing.setDescription("✅ | BassBoost đã đuợc bật!");
      player.bassboost = true;
    } else if (args == "vaporwave") {
      thing.setDescription("✅ | Vaporwave đã đuợc bật!");
      player.vaporwave = true;
    } else if (args == "pop") {
      thing.setDescription("✅ | Pop đã đuợc bật!");
      player.pop = true;
    } else if (args == "soft") {
      thing.setDescription("✅ | Soft đã đuợc bật!");
      player.soft = true;
    } else if (args == "treblebass") {
      thing.setDescription("✅ | Treblebass đã đuợc bật!");
      player.treblebass = true;
    } else if (args == "eightD") {
      thing.setDescription("✅ | Eight Dimension đã đuợc bật!");
      player.eightD = true;
    } else if (args == "karaoke") {
      thing.setDescription("✅ | Karaoke đã đuợc bật!");
      player.karaoke = true;
    } else if (args == "off") {
      thing.setDescription("✅ | EQ đã đuợc xoá bỏ!");
      player.reset();
    } else {
      thing.setDescription("❌ | Bộ lọc không hợp lệ!");
    }

    return interaction.reply({ embeds: [thing] });
  });

module.exports = command;
