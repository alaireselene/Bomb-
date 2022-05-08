const {
  Client,
  Intents,
  MessageEmbed,
  Collection,
  MessageActionRow,
  MessageButton
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const prettyMilliseconds = require("pretty-ms");
const jsoning = require("jsoning"); // Documentation: https://jsoning.js.org/
const { Manager } = require("erela.js");
const ConfigFetcher = require("../util/getConfig");
const Logger = require("./Logger");
const spotify = require("better-erela.js-spotify").default;
const { default: AppleMusic } = require("better-erela.js-apple");
const deezer = require("erela.js-deezer");
const facebook = require("erela.js-facebook");
const Server = require("../api");
const getLavalink = require("../util/getLavalink");
const getChannel = require("../util/getChannel");
const colors = require("colors");
const filters = require("erela.js-filters");

require("./EpicPlayer");

class DiscordMusicBot extends Client {
  /**
   * Create the music client
   * @param {import("discord.js").ClientOptions} props - Client options
   */
  constructor(
    props = {
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGES,
      ],
    }
  ) {
    super(props);

    ConfigFetcher()
      .then((conf) => {
        this.config = conf;
        this.build();
      })
      .catch((err) => {
        throw Error(err);
      });

    //Load Events and stuff
    /**@type {Collection<string, import("./SlashCommand")} */
    this.slashCommands = new Collection();
    this.contextCommands = new Collection();

    this.logger = new Logger(path.join(__dirname, "..", "logs.log"));

    this.LoadCommands();
    this.LoadEvents();

    this.database = new jsoning("db.json");

    this.getLavalink = getLavalink;
    this.getChannel = getChannel;
    this.ms = prettyMilliseconds;
  }

  /**
   * Send an info message
   * @param {string} text
   */
  log(text) {
    this.logger.log(text);
  }

  /**
   * Send an warning message
   * @param {string} text
   */
  warn(text) {
    //this.logger.warn(text);
  }

  /**
   * Build em
   */
  build() {
    this.warn("Started the bot...");
    this.login(this.config.token);
    this.server = new Server(this); //constructing also starts it
    if (this.config.debug === true) {
      this.warn("Debug mode is enabled!");
      this.warn("Only enable this if you know what you are doing!");
      process.on("unhandledRejection", (error) => console.log(error));
      process.on("uncaughtException", (error) => console.log(error));
    } else {
      process.on("unhandledRejection", (error) => {
        return;
      });
      process.on("uncaughtException", (error) => {
        return;
      });
    }

    let client = this;

    this.manager = new Manager({
      plugins: [
        new deezer(),
        new AppleMusic(),
        new spotify(),
        new facebook(),
        new filters(),
      ],
      nodes: this.config.nodes,
      retryDelay: this.config.retryDelay,
      retryAmount: this.config.retryAmount,
      autoPlay: true,
      clientName: `DiscordMusic/v${require("../package.json").version} (Bot: ${
        this.config.clientId
      })`,
      send: (id, payload) => {
        let guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
    })
      .on("nodeConnect", (node) =>
        this.log(
          `Node: ${node.options.identifier} | Lavalink node đuợc kết nối.`
        )
      )
      .on("nodeReconnect", (node) =>
        this.warn(
          `Node: ${node.options.identifier} | Lavalink node đang đuợc kết nối lại.`
        )
      )
      .on("nodeDestroy", (node) =>
        this.warn(
          `Node: ${node.options.identifier} | Lavalink node bị đánh phá.`
        )
      )
      .on("nodeDisconnect", (node) =>
        this.warn(
          `Node: ${node.options.identifier} | Lavalink node bị ngắt điện.`
        )
      )
      .on("nodeError", (node, err) => {
        this.warn(
          `Node: ${node.options.identifier} | Lavalink node gặp lỗi sau: ${err.message}.`
        );
      })
      // on track error warn and create embed
      .on("trackError", (player, err) => {
        this.warn(
          `Máy hát: ${player.options.guild} | Track gặp lỗi sau: ${err.message}.`
        );
        //console.log(err);
        let song = player.queue.current;

        let errorEmbed = new MessageEmbed()
          .setColor("RED")
          .setTitle("Lỗi phát lại!")
          .setDescription(`Không thể phát track này: \`${song.title}\``)
          .setFooter({
            text: "Lỗi không phải tại em cũng không phải tại anh, tại trời xui khiến nên bot này lỗi thui xD",
          });
        client.channels.cache
          .get(player.textChannel)
          .send({ embeds: [errorEmbed] });
      })

      .on("trackStuck", (player, err) => {
        this.warn(`Track gặp lỗi sau: ${err.message}`);
        //console.log(err);
        let song = player.queue.current;

        let errorEmbed = new MessageEmbed()
          .setColor("RED")
          .setTitle("Lỗi track!")
          .setDescription(`Không thể phát track này: \`${song.title}\``)
          .setFooter({
            text: "Lỗi không phải tại em cũng không phải tại anh, tại trời xui khiến nên bot này lỗi thui xD",
          });
        client.channels.cache
          .get(player.textChannel)
          .send({ embeds: [errorEmbed] });
      })
      .on("playerMove", (player, oldChannel, newChannel) => {
        const guild = client.guilds.cache.get(player.guild);
        if (!guild) return;
        const channel = guild.channels.cache.get(player.textChannel);
        if (oldChannel === newChannel) return;
        if (newChannel === null || !newChannel) {
          if (!player) return;
          if (channel)
            channel.send({
              embeds: [
                new MessageEmbed()
                  .setColor(client.config.embedColor)
                  .setDescription(`Nhảy ra khỏi <#${oldChannel}>`),
              ],
            });
          return player.destroy();
        } else {
          player.voiceChannel = newChannel;
          setTimeout(() => player.pause(false), 1000);
          return undefined;
        }
      })
      .on("playerCreate", (player) =>
        this.warn(
          `Máy hát: ${
            player.options.guild
          } | Một máy hát hoen gỉ đã đuợc thả xuống ${
            client.guilds.cache.get(player.options.guild)
              ? client.guilds.cache.get(player.options.guild).name
              : "1 server nào đó."
          }`
        )
      )
      .on("playerDestroy", (player) =>
        this.warn(
          `Máy hát: ${
            player.options.guild
          } | Một máy hát hoen gỉ đã bị đập nát ${
            client.guilds.cache.get(player.options.guild)
              ? client.guilds.cache.get(player.options.guild).name
              : "1 server nào đó"
          }`
        )
      )
      // on LOAD_FAILED send error message
      .on("loadFailed", (node, type, error) =>
        this.warn(
          `Node: ${node.options.identifier} | Không thể tải ${type}: ${error.message}`
        )
      )
      // on TRACK_START send message
      .on("trackStart", async (player, track) => {
        this.warn(
          `Máy hát: ${
            player.options.guild
          } | Track đã đuợc phát [${colors.blue(track.title)}]`
        );

        let trackStartedEmbed = this.Embed()
          .setAuthor({ name: "♪ Đang phát", iconURL: this.config.iconURL })
          .setDescription(`[${track.title}](${track.uri})` || "No Descriptions")
          .addField("Đuợc yêu cầu bởi:", `${track.requester}`, true)
          // show the duration of the track but if it's live say that it's "LIVE" if it's not anumber say it's live, if it's null say it's unknown
          .addField(
            "⌛ Thời lượng:",
            track.isStream
              ? `\`TRỰC TIẾP\``
              : `\`${prettyMilliseconds(track.duration, {
                  colonNotation: true,
                })}\``,
            true
          );
        try {
          trackStartedEmbed.setThumbnail(
            track.displayThumbnail("maxresdefault")
          );
        } catch (err) {
          trackStartedEmbed.setThumbnail(track.thumbnail);
        }
        let nowPlaying = await client.channels.cache
          .get(player.textChannel)
          .send({
            embeds: [trackStartedEmbed],
            components: [client.createController(player.options.guild)],
          })
          .catch(this.warn);
        player.setNowplayingMessage(nowPlaying);
      })
      .on("queueEnd", (player) => {
        this.warn(`Máy hát: ${player.options.guild} | Hàng chờ đã trống không.`);
        let queueEmbed = this.Embed()
          .setAuthor({
            name: "Hàng chờ đã trống không.",
            iconURL: this.config.iconURL,
          })
          .setFooter({ text: "Mọi nguời nghe hết hàng chờ lúc" })
          .setTimestamp();
        client.channels.cache
          .get(player.textChannel)
          .send({ embeds: [queueEmbed] });
        // check the config for how much time to wait before disconnecting the bot
        try {
          if (!player.playing && !player.twentyFourSeven) {
            setTimeout(() => {
              if (!player.playing && player.state !== "DISCONNECTED") {
                let disconnectedEmbed = new MessageEmbed()
                  .setColor(this.config.embedColor)
                  .setAuthor({
                    name: "Đã ngắt kết nối!",
                    iconURL: this.config.iconURL,
                  })
                  .setDescription(
                    `Bot hát không ai nghe bèn bỏ đi chơi.`
                  );
                client.channels.cache
                  .get(player.textChannel)
                  .send({ embeds: [disconnectedEmbed] });
                player.destroy();
              } else if (player.playing) {
                this.warn(`Máy hát: ${player.options.guild} | Vẫn đang phát`);
              }
            }, this.config.disconnectTime);
          } else if (player.playing || player.twentyFourSeven) {
            this.warn(
              `Máy hát: ${player.options.guild} | Vẫn hát 24/7`
            );
          }
        } catch (err) {
          this.warn(err);
        }
      });
  }

  /**
   *
   * @param {string} text
   * @returns {MessageEmbed}
   */
  Embed(text) {
    let embed = new MessageEmbed().setColor(this.config.embedColor);

    if (text) embed.setDescription(text);

    return embed;
  }

  /**
   *
   * @param {string} text
   * @returns {MessageEmbed}
   */
  ErrorEmbed(text) {
    let embed = new MessageEmbed()
      .setColor("RED")
      .setDescription("❌ | " + text);

    return embed;
  }

  LoadEvents() {
    let EventsDir = path.join(__dirname, "..", "events");
    fs.readdir(EventsDir, (err, files) => {
      if (err) throw err;
      else
        files.forEach((file) => {
          const event = require(EventsDir + "/" + file);
          this.on(file.split(".")[0], event.bind(null, this));
          this.warn("Event Loaded: " + file.split(".")[0]);
        });
    });
  }

  LoadCommands() {
    let SlashCommandsDirectory = path.join(
      __dirname,
      "..",
      "commands",
      "slash"
    );
    fs.readdir(SlashCommandsDirectory, (err, files) => {
      if (err) throw err;
      else
        files.forEach((file) => {
          let cmd = require(SlashCommandsDirectory + "/" + file);

          if (!cmd || !cmd.run)
            return this.warn(
              "Unable to load Command: " +
                file.split(".")[0] +
                ", File doesn't have an valid command with run function"
            );
          this.slashCommands.set(file.split(".")[0].toLowerCase(), cmd);
          this.log("Slash Command Loaded: " + file.split(".")[0]);
        });
    });

    let ContextCommandsDirectory = path.join(
      __dirname,
      "..",
      "commands",
      "context"
    );
    fs.readdir(ContextCommandsDirectory, (err, files) => {
      if (err) throw err;
      else
        files.forEach((file) => {
          let cmd = require(ContextCommandsDirectory + "/" + file);
          if (!cmd.command || !cmd.run)
            return this.warn(
              "Unable to load Command: " +
                file.split(".")[0] +
                ", File doesn't have either command/run"
            );
          this.contextCommands.set(file.split(".")[0].toLowerCase(), cmd);
          this.log("ContextMenu Loaded: " + file.split(".")[0]);
        });
    });
  }

  /**
   *
   * @param {import("discord.js").TextChannel} textChannel
   * @param {import("discord.js").VoiceChannel} voiceChannel
   */
  createPlayer(textChannel, voiceChannel) {
    return this.manager.create({
      guild: textChannel.guild.id,
      voiceChannel: voiceChannel.id,
      textChannel: textChannel.id,
      selfDeafen: this.config.serverDeafen,
      volume: this.config.defaultVolume,
    });
  }

  createController(guild) {
    return new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("SECONDARY")
        .setCustomId(`controller:${guild}:LowVolume`)
        .setEmoji("🔉"),

      new MessageButton()
        .setStyle("SUCCESS")
        .setCustomId(`controller:${guild}:Replay`)
        .setEmoji("◀"),

      new MessageButton()
        .setStyle("DANGER")
        .setCustomId(`controller:${guild}:PlayAndPause`)
        .setEmoji("⏯"),

      new MessageButton()
        .setStyle("SUCCESS")
        .setCustomId(`controller:${guild}:Next`)
        .setEmoji("▶"),

      new MessageButton()
        .setStyle("SECONDARY")
        .setCustomId(`controller:${guild}:HighVolume`)
        .setEmoji("🔊")
    );
  }
}

module.exports = DiscordMusicBot;
