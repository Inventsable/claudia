const { SlashCommandBuilder } = require("discord.js");
const util = require("../../util/github");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create")
    .setDescription("Track this post as a new Github issue")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("ID or URL for message(s) to track")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("Title for new issue submission")
        .setRequired(true)
    ),
  async execute(interaction) {
    // Tell Discord that Claudia needs more than 3 seconds to prevent timeout
    interaction.deferReply({ ephemeral: false, fetchReply: false });

    const messageId = interaction.options.getString("id");
    const issueTitle = interaction.options.getString("title");

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
        await message.fetch().catch((error) => null);

        if (index > 0) body += "\n----\n";

        const messageContent = util.convertDiscordReplyToBlockQuote(
          message.content
        );

        // Add the message content to the body
        body += messageContent;
        // Loop through message attachments and add links to the body
        if (message.attachments.size > 0) {
          for (const [key, attachment] of message.attachments) {
            body += "\n> ";
            // You can format the attachment links as needed
            if (/image/i.test(attachment.contentType)) body += `!`;
            body += `[Attachment ${key}]( ${attachment.url})\r\n`;
          }
        }

        // Loop through message embeds and add links to the body
        if (message.embeds.length > 0) {
          for (const embed of message.embeds) {
            body += "\n> ";
            // You can format the embeds as needed
            if (/image/i.test(embed.contentType)) body += `!`;
            body += `[Embed: ${embed.type}](${embed.url})\r\n`;
          }
        }
        body = body.trim();

        // Add a link to the original message at the end
        body += `\n — ${util.getUserShorthand(message)}`;
      }
      index = index + 1;
    }

    const issue = {
      title: issueTitle,
      body: util.sanitizeFinalDiscordBlockQuote(body),
    };

    if (issue && issue.body) {
      // Sending POST to Github to create new comment with compiled result
      const response = await util.createIssue(
        "Discord-Issue-Tracker",
        issue.title,
        issue.body
      );
      // Respond with our deferred reply, confirmation of success, and link to issue comment
      await interaction.followUp(
        `[New issue created: ${issue.title}](${response.data.html_url})`
      );
    } else {
      await interaction.reply({
        content: "Message not found. Please provide a valid message ID.",
        ephemeral: true,
      });
    }
  },
};
