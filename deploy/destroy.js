//Deletes every commands from every server yikes!!1!!11!!
const readline = require("readline");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const getConfig = require("../util/getConfig");
const LoadCommands = require("../util/loadCommands");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

(async () => {
  const config = await getConfig();
  const rest = new REST({ version: "9" }).setToken(config.token);

  rl.question(
    "Nhập GuildID muốn xoá lệnh: ",
    async (guild) => {
      console.log("Lực luợng ta zam đang đi xoá lệnh.");
      let commands = await rest.get(
        Routes.applicationGuildCommands(config.clientId, guild)
      );
      for (let i = 0; i < commands.length; i++) {
        const cmd = commands[i];
        await rest
          .delete(
            Routes.applicationGuildCommand(config.clientId, guild, cmd.id)
          )
          .catch(console.log);
        console.log("Đã xoá lệnh: " + cmd.name);
      }
      if (commands.length === 0)
        console.log("Quỷ ta zam không tìm thấy lệnh xD");
      rl.close();
    }
  );
})();
