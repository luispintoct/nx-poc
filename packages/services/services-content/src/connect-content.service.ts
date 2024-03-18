import https from "https";
import path from "path";
import fs from "fs";

type ConnectTemplate = {
  key: string;
  title: string;
  repository: {
    source: "github";
    user: string;
    name: string;
    url: string;
    path?: string;
  };
};

class ConnectContentService {
  constructor(readonly contentSource: string) {}

  async getTemplates(): Promise<Array<ConnectTemplate>> {
    const fileContent = await this.fetchContentFile("connect");

    return JSON.parse(fileContent as string);
  }

  private async fetchContentFile(file: string): Promise<unknown> {
    if (this.isUrl(this.contentSource)) {
      return new Promise((resolve, reject) => {
        const url = `${this.contentSource}${file}`;

        https
          .get(url, (response) => {
            let data = "";

            // A chunk of data has been received.
            response.on("data", (chunk) => {
              data += chunk;
            });

            // The whole response has been received.
            response.on("end", () => {
              if (response.statusCode !== 200) {
                reject(
                  new Error(
                    `Failed to fetch file: ${response.statusCode} ${response.statusMessage}`,
                  ),
                );
              } else {
                resolve(data);
              }
            });
          })
          .on("error", (error) => {
            reject(new Error(`Error fetching file: ${error.message}`));
          });
      });
    }

    // Read the file synchronously
    return fs.readFileSync(path.join(this.contentSource, file), "utf8");
  }

  private isUrl(value: string): boolean {
    const urlRegex: RegExp =
      /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/;
    return urlRegex.test(value);
  }
}

export { ConnectContentService };
