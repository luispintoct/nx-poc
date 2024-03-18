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
    throw new Error(`CalculateNextVersion: updating version: ${error.message}`);
  }
}

module.exports = updateVersion;
