const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("view")
    .setDescription("Source code for all tools and utilities used"),
  async execute(interaction) {
    console.log("Code for claudia, Checkpoint, bolt, and website go here");
    // await interaction.reply(
    //   `This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`
    // );
  },
};
