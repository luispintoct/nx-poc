#!/usr/bin/env yarn ts-node

// @ts-expect-error no @types available
import conventional from "conventional-changelog-conventionalcommits";
// @ts-expect-error no @types available
import changelogWriter from "conventional-changelog-writer";
import { getCommits } from "../git/utils/get-commits";
import { readVersion } from "../project/read-version";

const DEFAULT_MESSAGE =
  "\n- This bump does not introduce any new features or fixes. It is solely a result of updates to dependencies, tooling, or global settings.";

async function generateReleaseBody(
  from: string,
  to: string,
  version: string,
  projects: string[],
) {
  const convention = await conventional();
  const body = [`# 🚀 Release ${version}`];

  for (const project of projects) {
    const commits = await getCommits(from, to, project);
    let changelog = await changelogWriter.parseArray(
      commits.map((c) => {
        c.scope = null;
        return c;
      }),
      {
        version: await readVersion(project),
        owner: "commercetools",
        repository: "cli",
        host: "https://github.com",
      },
      convention.writerOpts,
    );

    if (commits.length === 0) changelog += DEFAULT_MESSAGE;

    body.push(`### ${project}${changelog.substring(2)}`);
  }

  return body.join("\n\n\n\n");
}

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 4) throw new Error("Invalid arguments");

  const from = args[0];
  const to = args[1];
  const version = args[2];
  const projects = args[3].split(",");

  generateReleaseBody(from, to, version, projects).then(console.log);
}

exports.generateReleaseBody = generateReleaseBody;
