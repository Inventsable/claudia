const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create")
    .setDescription("Track this post as a new Github issue"),
  async execute(interaction) {
    console.log(interaction);
    //
  },
};
