const { MessageEmbed } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
  .setName("invite")
  .setDescription("Rủ tớ vào server của cậu.")
  .setRun(async (client, interaction, options) => {
    const embed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setTitle(`Rủ tớ vào server của cậu.`)
      .setDescription(
        `Cậu có thể rủ tớ nhập bọn bằng cách bấm vào [đây](https://discord.com/oauth2/authorize?client_id=${client.config.clientId}&permissions=${client.config.permissions}&scope=bot%20applications.commands)`
      );
    return interaction.reply({ embeds: [embed] });
  });
module.exports = command;
