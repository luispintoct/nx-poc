import { getCommits } from "../../git/utils/get-commits";
// @ts-expect-error no @types available
import conventional from "conventional-changelog-conventionalcommits";

function mapBump(bump: { level: number }) {
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

export async function calculateVersionBump(
  from: string,
  to: string,
  project: string,
) {
  const convention = await conventional({ preMajor: true }); // TODO: get preMajor / beta from nx configs
  const commits = await getCommits(from, to, project);
  const bump = convention.recommendedBumpOpts.whatBump(commits);

  return mapBump(bump);
}
