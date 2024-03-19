/* eslint-disable @typescript-eslint/no-var-requires */
const conventional = require("conventional-changelog-conventionalcommits");
const commitsFilter = require("conventional-commits-filter");
const commitsParser = require("conventional-commits-parser");
const gitRawCommits = require("git-raw-commits");

async function getCommits(from, to, project) {
  const convention = await conventional();

  return new Promise((resolve, reject) => {
    const conventionalCommits = [];
    const streamCommits = gitRawCommits({
      from,
      to,
      format: "%B%n-hash-%n%H%n-gitTags-%n%d%n-committerDate-%n%ci",
    });

    streamCommits.on("data", (rawCommit) => {
      conventionalCommits.push(
        commitsParser.sync(String(rawCommit), convention.parserOpts),
      );
    });

    streamCommits.on("end", () => {
      const commits = commitsFilter(conventionalCommits).filter((commit) => {
        if (commit.scope == null) return true;

        const projectScope = project.startsWith("@")
          ? project.split("/")[1]
          : project;

        return commit.scope === projectScope;
      });

      console.debug(`GetCommits: commits=${JSON.stringify(commits)}`);
      resolve(commits);
    });

    streamCommits.on("error", (err) => {
      reject(err);
    });
  });
}

module.exports = getCommits;
