/**
 * Returns a range of commits according to the conventional commits standard
 * filtered based on the provided project scope.
 */

// @ts-expect-error no @types available
import conventional from "conventional-changelog-conventionalcommits";
// @ts-expect-error no @types available
import commitsFilter from "conventional-commits-filter";
import commitsParser, { Commit } from "conventional-commits-parser";
import gitRawCommits from "git-raw-commits";

export async function getCommits(
  from: string,
  to: string,
  project: string,
): Promise<Commit[]> {
  const convention = await conventional();

  return new Promise((resolve, reject) => {
    const conventionalCommits: Commit[] = [];
    const streamCommits = gitRawCommits({
      from,
      to,
      format: "%B%n-hash-%n%H%n-gitTags-%n%d%n-committerDate-%n%ci",
    });

    streamCommits.on("data", (rawCommit: string) => {
      const parsedCommit = commitsParser.sync(
        rawCommit.toString(),
        convention.parserOpts,
      );
      conventionalCommits.push(parsedCommit);
    });

    streamCommits.on("end", () => {
      const commits: Commit[] = commitsFilter(conventionalCommits).filter(
        (commit: Commit) => {
          if (commit.scope == null) return false;

          const projectScope = project.startsWith("@")
            ? project.split("/")[1]
            : project;

          return commit.scope === projectScope;
        },
      );

      resolve(commits);
    });

    streamCommits.on("error", (err: Error) => reject(err));
  });
}
