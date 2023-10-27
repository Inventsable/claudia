const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("installation")
    .setDescription("Show installation guide"),
  async execute(interaction) {
    console.log("Installation guide goes here");
    // await interaction.reply(
    //   `This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`
    // );
  },
};
