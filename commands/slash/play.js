// const { Manager } = require("erela.js/structures/Manager");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
  .setName("play")
  .setDescription("Bật bài hát yêu thích của bạn, hoặc không yêu thích, gì đó abcdef.")
  .addStringOption((option) =>
    option
      .setName("query")
      .setDescription("Nhập tên bài hát/link nhạc muốn phát:")
      .setRequired(true)
  )
  .setRun(async (client, interaction, options) => {
    let channel = await client.getChannel(client, interaction);
    if (!channel) return;

    let node = await client.getLavalink(client);
    if (!node) {
      return interaction.reply({
        embeds: [client.ErrorEmbed("Lavalink đã xịt, vui lòng DMs Sena để xử lý!")],
      });
    }
    let query = options.getString("query", true);
    let player = client.createPlayer(interaction.channel, channel);
    if (!interaction.member.voice.channel) {
      const joinEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(
          "❌ | **Vào cùng kênh voice với bot để chạy lệnh này!**"
        );
      return interaction.reply({ embeds: [joinEmbed], ephemeral: true });
    }
    if (player.state !== "CONNECTED") {
      player.connect();
    }
    // console.log(player);
    // if the channel is a stage channel then request to speak
    if (channel.type == "GUILD_STAGE_VOICE") {
      setTimeout(() => {
        if (interaction.guild.me.voice.suppress == true) {
          try {
            interaction.guild.me.voice.setSuppressed(false);
          } catch (e) {
            interaction.guild.me.voice.setRequestToSpeak(true);
          }
        }
      }, 2000); // set timeout are here, because bot sometimes takes time before reconising it's a stage.
    }

    await interaction.reply({
      embeds: [client.Embed(":mag_right: **Đang tìm...**")],
    });

    let res = await player.search(query, interaction.user).catch((err) => {
      client.error(err);
      return {
        loadType: "LOAD_FAILED",
      };
    });

    if (res.loadType === "LOAD_FAILED") {
      if (!player.queue.current) player.destroy();
      return interaction
        .editReply({
          embeds: [client.ErrorEmbed("Trong quá trình tìm kiếm, Bomb! đã làm vỡ kính lúp. Vui lòng thử lại hoặc DMs Sena.")],
        })
        .catch(this.warn);
    }

    if (res.loadType === "NO_MATCHES") {
      if (!player.queue.current) player.destroy();
      return interaction
        .editReply({
          embeds: [client.ErrorEmbed("Không có kết quả.")],
        })
        .catch(this.warn);
    }

    if (res.loadType === "TRACK_LOADED" || res.loadType === "SEARCH_RESULT") {
      player.queue.add(res.tracks[0]);
      if (!player.playing && !player.paused && !player.queue.size)
        player.play();
      let addQueueEmbed = client
        .Embed()
        .setAuthor({ name: "♪ Đã thêm track sau vào hàng chờ:", iconURL: client.config.iconURL })
        //.setAuthor("Added to queue", client.config.iconURL) Deprecated soon
        .setDescription(
          `[${res.tracks[0].title}](${res.tracks[0].uri})` || "Vô danh"
        )
        .setURL(res.tracks[0].uri)
        .addField("Từ kênh/tác giả:", res.tracks[0].author, true)
        .addField(
          "⌛ Thời lượng:",
          res.tracks[0].isStream
            ? `\`TRỰC TIẾP\``
            : `\`${client.ms(res.tracks[0].duration, {
                colonNotation: true,
              })}\``,
          true
        );
      try {
        addQueueEmbed.setThumbnail(
          res.tracks[0].displayThumbnail("maxresdefault")
        );
      } catch (err) {
        addQueueEmbed.setThumbnail(res.tracks[0].thumbnail);
      }
      if (player.queue.totalSize > 1)
        addQueueEmbed.addField(
          "Bài hát đứng số ",
          `${player.queue.size - 0}`,
          "trong hàng chờ",
          true
        );
      return interaction
        .editReply({ embeds: [addQueueEmbed] })
        .catch(this.warn);
    }

    if (res.loadType === "PLAYLIST_LOADED") {
      player.queue.add(res.tracks);
      if (
        !player.playing &&
        !player.paused &&
        player.queue.totalSize === res.tracks.length
      )
        player.play();
      let playlistEmbed = client
        .Embed()
        .setAuthor({
          name: "Đã thêm Playlist sau vào hàng chờ:",
          iconURL: client.config.iconURL,
        })
        //.setAuthor("Playlist added to queue", client.config.iconURL)
        .setThumbnail(res.tracks[0].thumbnail)
        .setDescription(`[${res.playlist.name}](${query})`)
        .addField("Đã thêm vào ", `\`${res.tracks.length}\` bài hát.`, false)
        .addField(
          "⌛ Thời lượng:",
          `\`${client.ms(res.playlist.duration, {
            colonNotation: true,
          })}\``,
          false
        );
      return interaction
        .editReply({ embeds: [playlistEmbed] })
        .catch(this.warn);
    }
  });

module.exports = command;
