const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resolve")
    .setDescription("Resolve an open Github issue")
    .addUserOption((option) =>
      option
        .setName("issue")
        .setDescription("Issue ID to resolve")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for resolution")
        .setRequired(false)
    ),
};
