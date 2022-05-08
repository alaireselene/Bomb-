const { MessageEmbed, message } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");
const fs = require("fs");
const path = require("path");

const command = new SlashCommand()
  .setName("reload")
  .setDescription("Tải lại toàn bộ lệnh.")
  .setRun(async (client, interaction, options) => {
    if (interaction.user.id === client.config.adminId) {
      try {
        let ContextCommandsDirectory = path.join(__dirname, "..", "context");
        fs.readdir(ContextCommandsDirectory, (err, files) => {
          files.forEach((file) => {
            delete require.cache[
              require.resolve(ContextCommandsDirectory + "/" + file)
            ];
            let cmd = require(ContextCommandsDirectory + "/" + file);
            if (!cmd.command || !cmd.run)
              return this.warn(
                "❌ Không thể tải lệnh: " +
                  file.split(".")[0] +
                  ", Tập tin không có lệnh."
              );
            client.contextCommands.set(file.split(".")[0].toLowerCase(), cmd);
          });
        });

        let SlashCommandsDirectory = path.join(__dirname, "..", "slash");
        fs.readdir(SlashCommandsDirectory, (err, files) => {
          files.forEach((file) => {
            delete require.cache[
              require.resolve(SlashCommandsDirectory + "/" + file)
            ];
            let cmd = require(SlashCommandsDirectory + "/" + file);

            if (!cmd || !cmd.run)
              return this.warn(
                "❌ Không thể tải lệnh: " +
                  file.split(".")[0] +
                  ", Tập tin chứa lệnh không hợp lệ/không chạy đuợc."
              );
            client.slashCommands.set(file.split(".")[0].toLowerCase(), cmd);
          });
        });

        const totalCmds =
          client.slashCommands.size + client.contextCommands.size;
        client.log(`Đã tải lại ${totalCmds} lệnh!`);
        return interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor(client.config.embedColor)
              .setDescription(`Tải thành công \`${totalCmds}\` lệnh!`)
              .setFooter({text: `${client.user.username} đã bị tẩy não bởi ${interaction.user.username}`})
              .setTimestamp(),
          ], ephemeral: true
        });
      } catch (err) {
        console.log(err);
        return interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor(client.config.embedColor)
              .setDescription(
                "Lỗi bất ngờ xuất hiện. Nhắc Sena kiểm tra VPS để xem chi tiết."
              ),
          ], ephemeral: true
        });
      }
    } else {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor(client.config.embedColor)
            .setDescription("Bạn không đuợc ủy quyền để dùng lệnh này!"),
        ], ephemeral: true
      });
    }
  });

module.exports = command;
