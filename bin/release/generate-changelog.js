/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const nx = require("@nx/devkit");
const conventional = require("conventional-changelog-conventionalcommits");
const changelogWriter = require("conventional-changelog-writer");
const getCommits = require("./utils/get-commits");

function updateChangelog(folderPath, changelogContent) {
  const filePath = path.join(folderPath, "CHANGELOG.md");

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // If the file exists, read its content and prepend the new content
    const existingContent = fs.readFileSync(filePath, "utf8");
    fs.writeFileSync(filePath, changelogContent + "\n" + existingContent);
  } else {
    // If the file doesn't exist, create a new file with the content
    fs.writeFileSync(filePath, changelogContent);
  }

  console.debug("GenerateChangelog: updated successfully.");
}

async function generateChangelog(from, to, project) {
  const convention = await conventional();
  const projects = await nx.createProjectGraphAsync();
  const projectConfiguration = projects.nodes[project];

  console.debug(
    `GenerateChangelog: projectConfiguration=${JSON.stringify(projectConfiguration)}`,
  );

  const commits = await getCommits(from, to, project);
  let changelog = await changelogWriter.parseArray(
    commits,
    {
      version: "2.1.1",
      owner: "commercetools",
      repository: "cli",
      host: "https://github.com",
    },
    convention.writerOpts,
  );

  if (commits.length === 0) {
    changelog +=
      "\n- This bump does not introduce any new features or fixes. It is solely a result of updates to dependencies, tooling, or global settings.";
  }

  console.debug(`GenerateChangelog: changelog=${changelog}`);
  updateChangelog(projectConfiguration.data.root, changelog);
}

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    throw new Error("Invalid project.");
  }

  const from = args[0];
  const to = args[1];
  const project = args[2];

  console.debug(`GenerateChangelog: from=${from} to=${to} project=${project}`);
  generateChangelog(from, to, project);
}

exports.generateChangelog = generateChangelog;
