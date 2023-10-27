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

const closeIssue = async (repo, id) => {
  return await octokit.request(
    `PATCH /repos/inventsable/${repo}/issues/${id}`,
    {
      owner: "inventsable",
      repo: repo,
      issue_number: id,
      state: "closed",
      state_reason: "completed",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
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

const listIssues = async (repo) => {
  return await octokit.request(`GET /repos/inventsable/${repo}/issues`, {
    owner: "inventsable",
    repo: repo,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
};

const getUserShorthand = (message) => {
  return `[${message.author.username}#${message.author.discriminator}${
    message.author.username !== message.author.globalName
      ? `(${message.author.globalName})`
      : ""
  }](${message.url})\n`;
};

const convertDiscordReplyToBlockQuote = (content) => {
  return `> ${content
    .trim()
    .split(/(\r\n|\n)/gm)
    .join("\r\n> ")}`.replace(/\s(>\s)(?!\w)/gm, "");
};

const sanitizeFinalDiscordBlockQuote = (content) => {
  return content
    .replace(/\n{2,}/gm, "\n")
    .split(/\n(?!\>)/gm)
    .join("\n> ")
    .replace(/\>[^\w\>-]*\>/gm, ">")
    .replace(/>\s{2}—/gm, "\n  —")
    .replace(/\>\s*\-{4}\s*\n/gm, "\n----\n")
    .replace(/\s\>\s*$/, "");
};

module.exports = {
  discordLinkAndIdParser,
  convertDiscordReplyToBlockQuote,
  sanitizeFinalDiscordBlockQuote,
  commentOnIssue,
  createIssue,
  closeIssue,
  listIssues,
  getUserShorthand,
};
