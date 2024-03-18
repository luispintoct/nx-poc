/* eslint-disable @typescript-eslint/no-var-requires */
const getCommits = require("./get-commits");
const conventional = require("conventional-changelog-conventionalcommits");

function mapBump(bump) {
  switch (bump.level) {
    case 0:
      return "MAJOR";
    case 1:
      return "MINOR";
    case 2:
    default:
      return "PATCH";
  }
}

async function calculateVersionBump(from, to, project) {
  const convention = await conventional({ preMajor: true }); // TODO: get preMajor from nx configs
  const commits = await getCommits(from, to, project);

  const bump = convention.recommendedBumpOpts.whatBump(commits);

  console.debug(
    `CalculateVersionBump: bump=${JSON.stringify(bump)} | ${mapBump(bump)}`,
  );

  return mapBump(bump);
}

module.exports = calculateVersionBump;
