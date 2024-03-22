#!/usr/bin/env yarn ts-node

/**
 * Reads the version of the specified project.
 * example:
 * $ ./read-version @commercetools/cli # 0.0.1
 */

import path from "path";
import nx from "@nx/devkit";
import { readFileSync } from "fs";

export async function readVersion(projectName: string): Promise<string> {
  // Create project graph using Nx
  const projects = await nx.createProjectGraphAsync();
  const project = projects.nodes[projectName];

  try {
    // Read package.json to get the version
    const packageJsonPath = path.join(project.data.root, "package.json");
    const packageJsonContent = readFileSync(packageJsonPath).toString();
    const packageJson = JSON.parse(packageJsonContent);

    if (packageJson && packageJson.version) {
      return packageJson.version;
    }
    // eslint-disable-next-line no-empty
  } catch (err) {}

  // If package.json doesn't exist, attempt to read VERSION file using git show
  try {
    const versionPath = path.join(project.data.root, "VERSION");
    const versionContent = readFileSync(versionPath).toString();
    const versionFromFile = versionContent.trim();

    if (versionFromFile) return versionFromFile;
    // eslint-disable-next-line no-empty
  } catch (err) {}

  // If version cannot be found, throw an error
  throw new Error(`ReadVersion: Version not found (${projectName})`);
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const project = args[0];

  if (typeof project !== "string") {
    throw new Error(`Invalid project ${project}`);
  }

  readVersion(project).then(console.log).catch(console.error);
}
