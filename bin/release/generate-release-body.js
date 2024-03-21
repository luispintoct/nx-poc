/* eslint-disable @typescript-eslint/no-var-requires */
const conventional = require("conventional-changelog-conventionalcommits");
const changelogWriter = require("conventional-changelog-writer");
const getCommits = require("./utils/get-commits");
const readVersion = require("./utils/read-version");

async function generateReleaseBody(from, to, version, projects) {
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

    if (commits.length === 0) {
      changelog +=
        "\n- This bump does not introduce any new features or fixes. It is solely a result of updates to dependencies, tooling, or global settings.";
    }

    body.push(`### ${project}${changelog.substring(2)}`);
  }

  return body.join("\n\n\n\n");
}

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 4) {
    throw new Error("Invalid projects.");
  }

  const from = args[0];
  const to = args[1];
  const version = args[2];
  const projects = args[3].split(",");

  generateReleaseBody(from, to, version, projects)
    .then(console.log)
    .catch(console.error);
}

exports.generateReleaseBody = generateReleaseBody;
