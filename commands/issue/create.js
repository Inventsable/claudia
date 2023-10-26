const { SlashCommandBuilder } = require("discord.js");

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
    const messageId = interaction.options.getString("id");
    const issueTitle = interaction.options.getString("title");

    // Split the input messageId string into an array of words
    const validReplies = utils.discordLinkAndIdParser(messageId);

    // Initialize the body with the title
    let body = "";

    for (let valid of validReplies) {
      const message = await interaction.channel.messages
        .fetch(valid)
        .catch((error) => null);

      if (message) {
        await message.fetch();
        const messageContent = message.content;

        // Add the message content to the body
        body += messageContent + "\r\n\r\n";

        // Loop through message attachments and add links to the body
        if (message.attachments.size > 0) {
          for (const [key, attachment] of message.attachments) {
            console.log(attachment);
            // You can format the attachment links as needed
            if (/image/i.test(attachment.contentType)) body += `!`;
            body += `[Attachment ${key}]( ${attachment.url})\r\n`;
          }
        }

        // Loop through message embeds and add links to the body
        if (message.embeds.length > 0) {
          for (const embed of message.embeds) {
            // You can format the embeds as needed
            if (/image/i.test(embed.contentType)) body += `!`;
            body += `[Embed: ${embed.type}](${embed.url})\r\n`;
          }
        }

        // Add a link to the original message at the end
        body += `[Message origin](${message.url})\r\n\r\n`;
      }
    }

    const issue = {
      title: issueTitle,
      body: body.trim(),
    };

    if (issue && issue.body) {
      console.log(issue);
      // console.log(issue.body.join(""));
      const response = await utils.createIssue(
        "Discord-Issue-Tracker",
        issue.title,
        issue.body
      );
      await interaction.reply(
        `[New issue created: ${issue.title}](${response.data.html_url})`
      );
    } else {
      await interaction.reply(
        "Message not found. Please provide a valid message ID."
      );
    }
  },
};
