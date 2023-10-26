const { Octokit } = require("@octokit/core");
const fetch = require("node-fetch");
const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
  request: {
    fetch: fetch,
  },
});

const discordLinkAndIdParser = (args) => {
  const words = args.split(" ");
  const result = [];
  for (let word of words) {
    if (/^\d+$/.test(word)) {
      result.push(word);
    } else {
      const channelMatch = word.match(
        /https:\/\/discord\.com\/channels\/\d+\/\d+\/(\d+)/
      );

      if (channelMatch) {
        result.push(channelMatch[1]);
      }
    }
  }
  return result;
};

const commentOnIssue = async (repo, id, body) => {
  return await octokit.request(
    `POST /repos/inventsable/${repo}/issues/${id}/comments`,
    {
      owner: "inventsable",
      repo: repo,
      issue_number: id,
      body: body,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
};

const createIssue = async (repo, title, body) => {
  return await octokit.request(`POST /repos/inventsable/${repo}/issues`, {
    owner: "inventsable",
    repo: repo,
    title: title,
    body: body,
    assignees: ["inventsable"],
    labels: ["bug"],
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
};

module.exports = {
  discordLinkAndIdParser,
  commentOnIssue,
  createIssue,
};
