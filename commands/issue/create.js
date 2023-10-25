const { SlashCommandBuilder } = require("discord.js");
const { Octokit } = require("@octokit/core");

const octokit = new Octokit({
  auth: "YOUR-TOKEN",
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create")
    .setDescription("Track this post as a new Github issue"),
  async execute(interaction) {
    console.log(process.env.GH_TOKEN);
    console.log(interaction);
    //
  },
};

const createGHIssue = async (repo, title, body) => {
  return await octokit.request(`POST /repos/inventsable/${repo}/issues`, {
    owner: "inventsable",
    repo: repo,
    title: title,
    body: body,
    assignees: ["inventsable"],
    milestone: 1,
    labels: ["bug"],
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
};
