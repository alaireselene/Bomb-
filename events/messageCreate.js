const { MessageEmbed } = require("discord.js");

module.exports = async (client, message) => {
  const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);

  if (message.content.match(mention)) {
    const mentionEmbed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setDescription(
        `Tiền tố lệnh trong máy chủ này là \`/\` (Slash Command).\nĐể bắt đầu vui lòng nhập \`/help\` để xem toàn bộ lệnh có sẵn.\nNếu không thấy, vui lòng thay mắt mới hoặc [mời lại bot](https://discord.com/oauth2/authorize?client_id=${client.config.clientId}&permissions=${client.config.permissions}&scope=bot%20applications.commands) với đủ quyền cần thiết.`
      );

    message.channel.send({
      embeds: [mentionEmbed],
    });
  }
};
