const SlashCommand = require("../../lib/SlashCommand");
const moment = require("moment");
require("moment-duration-format");
const { MessageEmbed } = require("discord.js");
const os = require("os");

const command = new SlashCommand()
  .setName("stats")
  .setDescription("Cập nhật thông tin bot từ máy chủ")
  .setRun(async (client, interaction) => {
    // get OS info
    const osver = os.platform() + " " + os.release();

    // Get nodejs version
    const nodeVersion = process.version;

    // get the uptime in a human readable format
    const runtime = moment
      .duration(client.uptime)
      .format("d[ Ngày]・h[ Tiếng]・m[ Phút]・s[ Giây]");
    // show lavalink uptime in a nice format
    const lavauptime = moment
      .duration(client.manager.nodes.values().next().value.stats.uptime)
      .format(" D[ng], H[h], m[p]");
    // show lavalink memory usage in a nice format
    const lavaram = (
      client.manager.nodes.values().next().value.stats.memory.used /
      1024 /
      1024
    ).toFixed(2);
    // sow lavalink memory alocated in a nice format
    const lavamemalocated = (
      client.manager.nodes.values().next().value.stats.memory.allocated /
      1024 /
      1024
    ).toFixed(2);
    // show system uptime
    var sysuptime = moment
      .duration(os.uptime() * 1000)
      .format("d[ Ngày]・h[ Tiếng]・m[ Phút]・s[ Giây]");

    // get commit hash and date
    let gitHash = "unknown";
    try {
      gitHash = require("child_process")
        .execSync("git rev-parse HEAD")
        .toString()
        .trim();
    } catch (e) {
      // do nothing
      gitHash = "unknown";
    }

    const statsEmbed = new MessageEmbed()
      .setTitle(`Thông tin về ${client.user.username}`)
      .setColor(client.config.embedColor)
      .setDescription(
        `\`\`\`yml\nTên: ${client.user.username}#${client.user.discriminator} [${client.user.id}]\nAPI: ${client.ws.ping}ms\nRuntime: ${runtime}\`\`\``
      )
      .setFields([
        {
          name: `Trạng thái Lavalink`,
          value: `\`\`\`yml\nUptime: ${lavauptime}\nRAM: ${lavaram} MB\nĐang phát: ${
            client.manager.nodes.values().next().value.stats.playingPlayers
          } trên ${
            client.manager.nodes.values().next().value.stats.players
          }\`\`\``,
          inline: true,
        },
        {
          name: "Trạng thái bot",
          value: `\`\`\`yml\nDiscord Server: ${
            client.guilds.cache.size
          } \nNodeJS: ${nodeVersion}\nDiscordMusicBot: v${
            require("../../package.json").version
          } \`\`\``,
          inline: true,
        },
        {
          name: "Trạng thái hệ thống BKNS",
          value: `\`\`\`yml\nOS: ${osver}\nUptime: ${sysuptime}\n\`\`\``,
          inline: false,
        },
      ])
      .setFooter({ text: `Build: ${gitHash}` });
    return interaction.reply({ embeds: [statsEmbed], ephemeral: false });
  });

module.exports = command;
