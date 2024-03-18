/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const nx = require("@nx/devkit");
const { readFileSync } = require("fs");

async function readVersion(projectName) {
  const projects = await nx.createProjectGraphAsync();
  const project = projects.nodes[projectName];

  try {
    const packageJsonPath = path.join(project.data.root, "package.json");
    const packageJsonContent = readFileSync(packageJsonPath).toString();
    const packageJson = JSON.parse(packageJsonContent);

    if (packageJson && packageJson.version) {
      console.debug(
        `ReadVersion: Found packageJsonPath=${packageJsonPath} version=${packageJson.version}`,
      );
      return packageJson.version;
    }
  } catch (error) {
    // If package.json doesn't exist, attempt to read VERSION file using git show
    try {
      const versionPath = path.join(project.data.root, "VERSION");
      const versionContent = readFileSync(versionPath).toString();
      const versionFromFile = versionContent.trim();

      if (versionFromFile) {
        console.debug(
          `ReadVersion: Found versionPath=${versionPath} version=${versionContent}`,
        );
        return versionFromFile;
      }
    } catch (error) {
      // If VERSION file doesn't exist or is empty
    }
  }

  throw new Error(`ReadVersion: Version not found, project: ${projectName}`);
}

module.exports = readVersion;
