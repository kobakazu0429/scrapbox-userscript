import path from "node:path";
import fs from "node:fs/promises";
import fg from "fast-glob";
import groupBy from "just-group-by";
import type { ImportedData, ImportedLightPage } from "scrapbox-types/response";

const main = async () => {
  const scriptsEachProject = groupBy(await fg("scripts/**/*.js"), (arg) => {
    const [, project] = arg.split("/");
    return project;
  });
  const scriptsEachPage = Object.fromEntries(
    Object.keys(scriptsEachProject).map((project) => {
      return [
        project,
        groupBy(scriptsEachProject[project], (arg) => {
          const [, _project, page] = arg.split("/");
          return page;
        }),
      ];
    })
  );

  for (const project in scriptsEachPage) {
    const exportPage: ImportedData = { pages: [] };

    for (const pageTitle in scriptsEachPage[project]) {
      const page: ImportedLightPage = {
        title: pageTitle,
        lines: [pageTitle, ""],
      };

      for (const script of scriptsEachPage[project][pageTitle]) {
        const content = await fs.readFile(script, "utf-8");
        const line = [
          `code:${path.basename(script)}`,
          ...content.split("\n").map((line) => " " + line),
          "",
        ];
        page.lines.push(...line);
      }

      exportPage.pages.push(page);
    }

    await fs.writeFile(`${project}.json`, JSON.stringify(exportPage));
  }
};

main();
