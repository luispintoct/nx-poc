module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": async () => {
      const { execSync } = await import("child_process");
      const nxProjects = execSync("yarn nx show projects")
        .toString()
        .trim()
        .split("\n");
      const nxProjectsScopes = Object.keys(nxProjects).map((projectName) => {
        return projectName.startsWith("@")
          ? projectName.split("/")[1]
          : projectName;
      });
      return [2, "always", nxProjectsScopes];
    },
  },
};
