/* eslint-disable @typescript-eslint/no-var-requires */
const readLatestVersion = require("./read-latest-version");
const calculateVersionBump = require("./calculate-version-bump");

function applyBump(version, bumpType, rcNumber = null) {
  let [versionPart, rcPart = rcNumber ? `-rc.${rcNumber}` : null] =
    version.split("-");
  let [major, minor, patch] = versionPart.split(".").map(Number);

  switch (bumpType.toUpperCase()) {
    case "MAJOR":
      return `${major + 1}.0.0${rcPart ?? ""}`;
    case "MINOR":
      return `${major}.${minor + 1}.0${rcPart ?? ""}`;
    case "PATCH":
      return `${major}.${minor}.${patch + 1}${rcPart ?? ""}`;
    default:
      throw new Error("Invalid bump type. Must be MAJOR, MINOR, or PATCH.");
  }
}

async function calculateNextVersion(from, to, project) {
  const bump = await calculateVersionBump(from, to, project);
  const currentVersion = await readLatestVersion(from, project);

  console.debug(`CalculateNextVersion: currentVersion=${currentVersion}`);
  const nextVersion = applyBump(currentVersion, bump);

  console.debug(`CalculateNextVersion: nextVersion=${nextVersion}`);
  return nextVersion;
}

module.exports = calculateNextVersion;
