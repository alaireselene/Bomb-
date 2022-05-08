const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const load = require("lodash");
const pms = require("pretty-ms");

const command = new SlashCommand()
  .setName("queue")
  .setDescription("Hiển thị danh sách phát (hàng chờ).")

  .setRun(async (client, interaction, options) => {
    let player = client.manager.players.get(interaction.guild.id);
    if (!player) {
      const queueEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription("Hàng chờ trống");
      return interaction.reply({ embeds: [queueEmbed], ephemeral: true });
    }

    if (!player.playing) {
      const queueEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription("Hàng chờ trống");
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

    await interaction.deferReply().catch(() => {});

    if (!player.queue.size || player.queue.size === 0) {
      let song = player.queue.current;
      const embed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(`**♪ | Đang phát:** [${song.title}](${song.uri})`)
        .addFields(
          {
            name: "⌛ Thời lượng:",
            value: `\`${pms(player.position, { colonNotation: true })} / ${pms(
              player.queue.current.duration,
              { colonNotation: true }
            )}\``,
            inline: true,
          },
          {
            name: "Âm luợng",
            value: `\`${player.volume}\``,
            inline: true,
          },
          {
            name: "Tổng số track",
            value: `\`${player.queue.totalSize - 1}\``,
            colonNotation: true,
            inline: true,
          }
        );

      await interaction.editReply({
        embeds: [embed],
      });
    } else {
      const mapping = player.queue.map(
        (t, i) => `\` ${++i} \` [${t.title}](${t.uri}) [${t.requester}]`
      );

      const chunk = load.chunk(mapping, 10);
      const pages = chunk.map((s) => s.join("\n"));
      let page = interaction.options.getNumber("page");
      if (!page) page = 0;
      if (page) page = page - 1;
      if (page > pages.length) page = 0;
      if (page < 0) page = 0;

      if (player.queue.size < 11 || player.queue.totalSize < 11) {
        let song = player.queue.current;
        const embedTwo = new MessageEmbed()
          .setColor(client.config.embedColor)
          .setDescription(
            `**♪ | Đang phát:** [${song.title}](${song.uri}) [${player.queue.current.requester}]\n\n**Queued Tracks**\n${pages[page]}`
          )
          .addFields(
            {
              name: "⌛ Thời lượng:",
              value: `\`${pms(player.position, {
                colonNotation: true,
              })} / ${pms(player.queue.current.duration, {
                colonNotation: true,
              })}\``,
              inline: true,
            },
            {
              name: "⌛ Tổng thời luợng:",
              value: `\`${pms(player.queue.duration, {
                colonNotation: true,
              })}\``,
              inline: true,
            },
            {
              name: "Tổng số track",
              value: `\`${player.queue.totalSize - 1}\``,
              colonNotation: true,
              inline: true,
            }
          )
          .setFooter({
            text: `Trang ${page + 1}/${pages.length}`,
          });

        await interaction
          .editReply({
            embeds: [embedTwo],
          })
          .catch(() => {});
      } else {
        let song = player.queue.current;
        const embedThree = new MessageEmbed()
          .setColor(client.config.embedColor)
          .setDescription(
            `**♪ | Đang phát:** [${song.title}](${song.uri}) [${player.queue.current.requester}]\n\n**Queued Tracks**\n${pages[page]}`
          )
          .addFields(
            {
              name: "⌛ Thời lượng:",
              value: `\`${pms(player.position, {
                colonNotation: true,
              })} / ${pms(player.queue.current.duration, {
                colonNotation: true,
              })}\``,
              inline: true,
            },
            {
              name: "⌛ Tổng thời luợng:",
              value: `\`${pms(player.queue.duration, {
                colonNotation: true,
              })}\``,
              inline: true,
            },
            {
              name: "Tổng số track",
              value: `\`${player.queue.totalSize - 1}\``,
              colonNotation: true,
              inline: true,
            }
          )
          .setFooter({
            text: `Trang ${page + 1}/${pages.length}`,
          });

        const buttonOne = new MessageButton()
          .setCustomId("queue_cmd_but_1_app")
          .setEmoji("⏭️")
          .setStyle("PRIMARY");
        const buttonTwo = new MessageButton()
          .setCustomId("queue_cmd_but_2_app")
          .setEmoji("⏮️")
          .setStyle("PRIMARY");

        await interaction
          .editReply({
            embeds: [embedThree],
            components: [
              new MessageActionRow().addComponents([buttonTwo, buttonOne]),
            ],
          })
          .catch(() => {});

        const collector = interaction.channel.createMessageComponentCollector({
          filter: (b) => {
            if (b.user.id === interaction.user.id) return true;
            else
              return b
                .reply({
                  content: `Chỉ **${interaction.user.tag}** có thể bấm nút này.`,
                  ephemeral: true,
                })
                .catch(() => {});
          },
          time: 60000 * 5,
          idle: 30e3,
        });

        collector.on("collect", async (button) => {
          if (button.customId === "queue_cmd_but_1_app") {
            await button.deferUpdate().catch(() => {});
            page = page + 1 < pages.length ? ++page : 0;

            const embedFour = new MessageEmbed()
              .setColor(client.config.embedColor)
              .setDescription(
                `**♪ | Đang phát:** [${song.title}](${song.uri}) [${player.queue.current.requester}]\n\n**Queued Tracks**\n${pages[page]}`
              )
              .addFields(
                {
                  name: "⌛ Thời lượng:",
                  value: `\`${pms(player.position, {
                    colonNotation: true,
                  })} / ${pms(player.queue.current.duration, {
                    colonNotation: true,
                  })}\``,
                  inline: true,
                },
                {
                  name: "⌛ Tổng thời luợng:",
                  value: `\`${pms(player.queue.duration, {
                    colonNotation: true,
                  })}\``,
                  inline: true,
                },
                {
                  name: "Tổng số track",
                  value: `\`${player.queue.totalSize - 1}\``,
                  colonNotation: true,
                  inline: true,
                }
              )
              .setFooter({
                text: `Trang ${page + 1}/${pages.length}`,
              });

            await interaction.editReply({
              embeds: [embedFour],
              components: [
                new MessageActionRow().addComponents([buttonTwo, buttonOne]),
              ],
            });
          } else if (button.customId === "queue_cmd_but_2_app") {
            await button.deferUpdate().catch(() => {});
            page = page > 0 ? --page : pages.length - 1;

            const embedFive = new MessageEmbed()
              .setColor(client.config.embedColor)
              .setDescription(
                `**♪ | Đang phát:** [${song.title}](${song.uri}) [${player.queue.current.requester}]\n\n**Queued Tracks**\n${pages[page]}`
              )
              .addFields(
                {
                  name: "⌛ Thời lượng:",
                  value: `\`${pms(player.position, {
                    colonNotation: true,
                  })} / ${pms(player.queue.current.duration, {
                    colonNotation: true,
                  })}\``,
                  inline: true,
                },
                {
                  name: "⌛ Tổng thời luợng:",
                  value: `\`${pms(player.queue.duration, {
                    colonNotation: true,
                  })}\``,
                  inline: true,
                },
                {
                  name: "Tổng số track",
                  value: `\`${player.queue.totalSize - 1}\``,
                  colonNotation: true,
                  inline: true,
                }
              )
              .setFooter({
                text: `Trang ${page + 1}/${pages.length}`,
              });

            await interaction
              .editReply({
                embeds: [embedFive],
                components: [
                  new MessageActionRow().addComponents([buttonTwo, buttonOne]),
                ],
              })
              .catch(() => {});
          } else return;
        });
      }
    }
  });

module.exports = command;
