#!/usr/bin/env yarn ts-node

import fs from "fs";
import path from "path";
import * as nx from "@nx/devkit";
// @ts-expect-error no @types available
import conventional from "conventional-changelog-conventionalcommits";
// @ts-expect-error no @types available
import changelogWriter from "conventional-changelog-writer";
import { getCommits } from "../git/utils/get-commits";
import { readVersion } from "./read-version";

function updateChangelog(folderPath: string, changelogContent: string) {
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
}

async function generateChangelog(from: string, to: string, project: string) {
  const convention = await conventional();
  const projects = await nx.createProjectGraphAsync();
  const projectConfiguration = projects.nodes[project];
  const commits = await getCommits(from, to, project);

  let changelog = await changelogWriter.parseArray(
    commits,
    {
      version: await readVersion(project),
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

  updateChangelog(projectConfiguration.data.root, changelog);
}

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 3) throw new Error("Invalid project.");

  const from = args[0];
  const to = args[1];
  const project = args[2];

  generateChangelog(from, to, project);
}
