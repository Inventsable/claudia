const { SlashCommandBuilder } = require("discord.js");

// This should maybe be a select menu that includes "install" as an option

module.exports = {
  data: new SlashCommandBuilder().setName("help").setDescription("Get help"),
  async execute(interaction) {
    console.log("Help faq goes here");
    // await interaction.reply(
    //   `This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`
    // );
  },
};
