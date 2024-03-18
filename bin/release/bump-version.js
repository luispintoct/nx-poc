/* eslint-disable @typescript-eslint/no-var-requires */
const calculateNextVersion = require("./utils/calculate-next-version");
const updateVersion = require("./utils/update-version");

async function bumpVersion(from, to, project) {
  const nextVersion = await calculateNextVersion(from, to, project);

  await updateVersion(project, nextVersion);
}

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length >= 2) {
    const from = args[0];
    const to = args[1];
    const project = args[2];

    console.debug(`BumpVersion: from=${from} to=${to} project=${project}`);
    bumpVersion(from, to, project).then(() => process.exit(0));
  } else {
    throw new Error("Invalid project.");
  }
}

exports.bumpVersion = bumpVersion;
