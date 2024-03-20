/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync } = require("child_process");
const fs = require("fs");
const nx = require("@nx/devkit");
const path = require("path");

async function updateVersion(projectName, newVersion) {
  const projects = await nx.createProjectGraphAsync();
  const project = projects.nodes[projectName];

  try {
    const packageJsonPath = path.join(project.data.root, "package.json");

    if (fs.existsSync(packageJsonPath)) {
      execSync(`yarn workspace ${projectName} version ${newVersion}`, {
        stdio: "inherit",
      });
    } else {
      const versionFilePath = path.join(project.data.root, "VERSION");

      fs.writeFileSync(versionFilePath, newVersion);
    }
  } catch (error) {
    throw new Error(`Update Version: updating version: ${error.message}`);
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const project = args[0];
  const version = args[1];

  if (typeof project !== "string")
    throw new Error(`Invalid project: ${project}`);

  if (typeof version !== "string")
    throw new Error(`Invalid version: ${version}`);

  updateVersion(project, version);
}

module.exports = updateVersion;
