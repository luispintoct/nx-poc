import { readVersion } from "../read-version";
import { calculateVersionBump } from "./calculate-version-bump";

type Version = `${number}.${number}.${number}`;
type Bump = "MAJOR" | "MINOR" | "PATCH";

function applyBump(
  version: Version,
  bumpType: Bump,
  rcNumber: string | null = null,
) {
  const [versionPart, rcPart = rcNumber ? `-rc.${rcNumber}` : null] =
    version.split("-");
  const [major, minor, patch] = versionPart.split(".").map(Number);

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

export async function calculateNextVersion(
  from: string,
  to: string,
  project: string,
) {
  const bump = await calculateVersionBump(from, to, project);
  const currentVersion = await readVersion(project);
  return applyBump(currentVersion as Version, bump);
}
