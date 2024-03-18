module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": async () => {
      const {
        default: { rules },
      } = await import("@commitlint/config-conventional");
      const types = [...rules["type-enum"][2], "release"];
      
      return [2, "always", types];
    },
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
