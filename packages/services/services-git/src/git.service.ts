import { execSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import simpleGit from "simple-git";

type GitCloneOptions = {
  source: "github";
  user: string;
  name: string;
  path?: string;
  destination: string;
};

class GitService {
  async clone(options: GitCloneOptions): Promise<void> {
    const git = simpleGit();
    const gitUrl =
      options.source === "github"
        ? `https://github.com/${options.user}/${options.name}.git`
        : ``;

    try {
      // Clone the repository to a temporary directory
      const tempDir = path.join(
        os.tmpdir(),
        `connector-template-${Date.now().toString()}`,
      );
      await git.clone(gitUrl, tempDir);

      const currentDir = process.cwd();
      // Move to the cloned repository directory
      process.chdir(tempDir);

      // Checkout the specific folder
      if (options.path) {
        execSync(
          `git sparse-checkout init --cone && git sparse-checkout set ${options.path}`,
        );
      }

      // Move the folder to the specified destination
      const sourcePath = path.join(tempDir, options.path ?? "");
      fs.renameSync(sourcePath, path.join(currentDir, options.destination));
    } catch (error) {
      console.error("Error cloning to folder:", error);
    }
  }

  async push(): Promise<void> {
    throw new Error("not implemented");
  }
}

export { GitService };
