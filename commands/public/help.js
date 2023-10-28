/**
 * Something weird happens here where awaiting a multiselect causes it to timeout immediately
 *
 * This is following the exact API samples, not sure what difference needs to be made
 */
const {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Select option for help"),
  async execute(interaction) {
    const select = new StringSelectMenuBuilder()
      .setCustomId("abc123")
      .setPlaceholder("Make a selection!")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Installation")
          .setDescription("Instructions on how to download and use the panel")
          .setValue("installation"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Test")
          .setDescription("The Fire-type Lizard Pokémon.")
          .setValue("Test")
      );

    const row = new ActionRowBuilder().addComponents(select);

    await interaction.reply({
      content: "Choose your starter!",
      components: [row],
    });

    const collectorFilter = (i) => i.user.id === interaction.user.id;

    try {
      console.log("CONFIRM?");
      const confirmation = await response.awaitMessageComponent({
        filter: collectorFilter,
        time: 600000,
      });
      if (confirmation.customId === "install") {
        // await interaction.guild.members.ban(target);
        await confirmation.update({
          content: `INSTALL`,
          components: [],
        });
      } else if (confirmation.customId === "test") {
        await confirmation.update({
          content: "TEST",
          components: [],
        });
      }
    } catch (e) {
      await interaction.editReply({
        content: "Confirmation not received within 1 minute, cancelling",
        components: [],
      });
    }
    // console.log(result);
  },
};
