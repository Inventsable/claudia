const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resolve")
    .setDescription("Resolve an open Github issue")
    .addStringOption((option) =>
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
  async execute(interaction) {
    // console.log(process.env.GH_TOKEN);
    console.log(interaction);
    //
  },
};
