const { SlashCommandBuilder } = require("discord.js");
const util = require("../../util/github");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resolve")
    .setDescription("Resolve an open Github issue")
    .addStringOption((option) =>
      option
        .setName("issue")
        .setDescription("Issue ID to resolve")
        .setRequired(true)
    ),
  async execute(interaction) {
    const id = Number(interaction.options.getString("issue"));
    const response = await util
      .closeIssue("Discord-Issue-Tracker", id)
      .catch((err) => {
        interaction.reply({
          content: `Error: ${err}`,
          ephemeral: true,
        });
      });
    return await interaction.reply({
      content: `[Issue #${id}](${response.data.html_url}) has been closed`,
    });
  },
};
