const { SlashCommandBuilder, underscore } = require("discord.js");
const util = require("../../util/github");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription("List all open issues"),
  async execute(interaction) {
    const id = Number(interaction.options.getString("issue"));
    const response = await util.listIssues("Discord-Issue-Tracker");
    console.log(response);
    const list = response.data
      .map((item) => `- ${item.title} - <${item.html_url}>`)
      .reverse()
      .join(`\r\n`);
    return await interaction.reply({
      content: `## ${underscore(
        `[Known issues:](https://github.com/Inventsable/Discord-Issue-Tracker/issues)`
      )}\r\n\r\n${list}`,
    });
  },
};
