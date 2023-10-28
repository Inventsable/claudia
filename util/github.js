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

const getModifiedDateFromCommit = async (repo, filePath) => {
  // Your GitHub Personal Access Token
  const token = "your_personal_access_token";

  // GitHub API URL
  const apiUrl = `https://api.github.com/repos/inventsable/${repo}/commits?path=${filePath}`;

  // Set up headers for authentication
  const headers = {
    Authorization: `token ${token}`,
    "User-Agent": "Node.js", // Set a User-Agent header to identify your application
  };
  try {
    const response = await fetch(apiUrl, { headers });

    if (response.status === 200) {
      const data = await response.json();

      if (data.length > 0) {
        const lastCommit = data[0].commit;
        console.log(
          `Last modified timestamp for ${filePath}: ${lastCommit.author.date}`
        );
      } else {
        console.error(`No commits found for ${filePath}`);
      }
    } else {
      throw new Error(`HTTP Status ${response.status}`);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
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
