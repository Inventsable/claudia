const { SlashCommandBuilder, EmbedBuilder, Embed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("download")
    .setDescription("Provides a link to latest version of Checkpoint"),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false, fetchReply: false });
    const extensionVersion = "1.0.2";
    const embed = new EmbedBuilder()
      .setColor("#00ff99")
      .setAuthor({
        name: "Checkpoint - Convert artwork to construction geometry",
        iconURL:
          "https://raw.githubusercontent.com/Inventsable/Discord-Issue-Tracker/master/IconAvatar.png",
        // "",
      })
      .setDescription(
        "<:ai:1167930035970248774> <:aemono:1167947951805579327> <:psmono:1167947963776110722> <:prmono:1167947961506996224> <:idmono:1167947957371404338>"
      )
      .setFields([
        {
          name: "Last updated on Oct 28th, 2023 at 3:50PM",
          value:
            "[Download version 1.0.2 by clicking here](https://google.com)",
          inline: false,
        },
      ])
      .setFooter({
        text: `v${extensionVersion}`,
      })
      .setTimestamp();
    await interaction.followUp({ embeds: [embed] });
  },
};
