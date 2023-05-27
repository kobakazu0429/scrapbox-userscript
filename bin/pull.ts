import path from "node:path";
import url from "node:url";
import fs from "node:fs/promises";

const main = async () => {
  const projectsDirPath = path.resolve(path.join(__dirname, "..", "scripts"));
  const projects = await fs.readdir(projectsDirPath);

  const scripts = await Promise.all(
    projects.map((project) => ({
      project,
      scripts: fs.readdir(path.join(projectsDirPath, project)),
    }))
  );

  console.log(scripts);
};

main();
