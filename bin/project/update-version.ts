#!/usr/bin/env yarn ts-node

import { execSync } from "child_process";
import fs from "fs";
import nx from "@nx/devkit";
import path from "path";

export async function updateVersion(projectName: string, newVersion: string) {
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
    throw new Error(`Update Version: ${error}`);
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
