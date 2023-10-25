const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("update")
    .setDescription("Add a post to an existing issue")
    .addStringOption((option) =>
      option
        .setName("issue")
        .setDescription("Issue ID to update")
        .setRequired(true)
    ),
  async execute(interaction) {
    console.log(interaction);
    //
  },
};
