/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync } = require("child_process");
const path = require("path");
const nx = require("@nx/devkit");

async function readLatestVersion(from, projectName) {
  const projects = await nx.createProjectGraphAsync();
  const project = projects.nodes[projectName];

  try {
    const packageJsonPath = path.join(project.data.root, "package.json");
    const packageJsonContent = execSync(
      `git show ${from}:${packageJsonPath}`,
    ).toString();
    const packageJson = JSON.parse(packageJsonContent);

    if (packageJson && packageJson.version) {
      console.debug(
        `ReadLatestVersion: Found packageJsonPath=${packageJsonPath} version=${packageJson.version}`,
      );
      return packageJson.version;
    }
  } catch (error) {
    // If package.json doesn't exist, attempt to read VERSION file using git show
    try {
      const versionPath = path.join(project.data.root, "VERSION");
      const versionContent = execSync(
        `git show ${from}:${versionPath}`,
      ).toString();
      const versionFromFile = versionContent.trim();

      if (versionFromFile) {
        console.debug(
          `ReadLatestVersion: Found versionPath=${versionPath} version=${versionContent}`,
        );
        return versionFromFile;
      }
    } catch (error) {
      // If VERSION file doesn't exist or is empty
    }
  }

  console.debug(`ReadLatestVersion: Version not found`);
  // Return default version if neither package.json nor VERSION file is found
  return "0.0.0";
}

module.exports = readLatestVersion;
