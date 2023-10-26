const { SlashCommandBuilder } = require("discord.js");
const util = require("../../util/github");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("update")
    .setDescription("Add a post to an existing issue")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("ID or URL for message(s) to track")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("issue")
        .setDescription("Issue ID to update")
        .setRequired(true)
    ),
  async execute(interaction) {
    const messageId = interaction.options.getString("id");
    const id = Number(interaction.options.getString("issue"));

    // Split the input messageId string into an array of words
    const validReplies = util.discordLinkAndIdParser(messageId);

    // Initialize the body with the title
    let body = "";
    let index = 0;

    for (let valid of validReplies) {
      const message = await interaction.channel.messages
        .fetch(valid)
        .catch((error) => null);

      if (message) {
        await message.fetch();
        const messageContent = message.content;

        if (index > 0) body += "\r\n----\r\n";

        // Add the message content to the body
        body += "> " + messageContent + "\r\n\r\n";

        // Loop through message attachments and add links to the body
        if (message.attachments.size > 0) {
          for (const [key, attachment] of message.attachments) {
            console.log(attachment);
            // You can format the attachment links as needed
            if (/image/i.test(attachment.contentType)) body += `!`;
            body += `> [Attachment ${key}]( ${attachment.url})\r\n`;
          }
        }

        // Loop through message embeds and add links to the body
        if (message.embeds.length > 0) {
          for (const embed of message.embeds) {
            // You can format the embeds as needed
            if (/image/i.test(embed.contentType)) body += `!`;
            body += `> [Embed: ${embed.type}](${embed.url})\r\n`;
          }
        }

        // Create block quote style
        body = body.trim().replace(/(\r\n|\r|\n)(?!>)\s?/gm, "\r\n> ");

        // Add a link to the original message at the end
        body += `\r\n\r\n  ▸ ${util.getUserShorthand(message)}\r\n\r\n`;
      }
      index = index + 1;
    }

    const issue = {
      title: null,
      body: body.trim().replace(/^\>(\s\>)*\s?/gm, "> "),
    };

    if (issue && issue.body) {
      // console.log(issue.body.join(""));
      const response = await util
        .commentOnIssue("Discord-Issue-Tracker", id, issue.body)
        .catch((err) => console.error(err));
      await interaction
        .reply(`[Issue #${id} updated](${response.data.html_url})`)
        .catch((err) => null);
    } else {
      await interaction.reply({
        content: "Message not found. Please provide a valid message ID.",
        ephemeral: true,
      });
    }
  },
};
