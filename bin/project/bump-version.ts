#!/usr/bin/env yarn ts-node

import { calculateNextVersion } from "./utils/calculate-next-version";
import { updateVersion } from "./update-version";

async function bumpVersion(from: string, to: string, project: string) {
  const nextVersion = await calculateNextVersion(from, to, project);

  await updateVersion(project, nextVersion);
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 3) throw new Error("Invalid project.");

  const from = args[0];
  const to = args[1];
  const project = args[2];

  bumpVersion(from, to, project).catch(console.error);
}

exports.bumpVersion = bumpVersion;
