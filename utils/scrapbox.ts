import fs from "node:fs";
import axios from "axios";
import type { UserResponse } from "scrapbox-types/response";

export const client = (sid: string) => {
  const cookie = `connect.sid=${sid}`;

  const client = axios.create({
    baseURL: "https://scrapbox.io/api/",
    headers: {
      Cookie: cookie,
    },
  });

  return {
    async fetchProfile() {
      return client.get<UserResponse>("/users/me");
    },

    async importProject(projectName: string, path: fs.PathLike) {
      const user = await this.fetchProfile();
      if (user.data.isGuest) {
        throw new Error("seems Guest");
      }

      return client.post(
        `/page-data/import/${projectName}.json`,
        {
          "import-file": fs.createReadStream(path),
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRF-TOKEN": user.data.csrfToken,
          },
        }
      );
    },

    async fetchCode(projectName: string, pageName: string, fileName: string) {
      return client.get<string>(`/code/${projectName}/${pageName}/${fileName}`);
    },

    async fetchPage(projectName: string, pageName: string) {},
  };
};
