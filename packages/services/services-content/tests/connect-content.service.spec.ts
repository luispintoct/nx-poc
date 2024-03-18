import fs from "fs";
import { ConnectContentService } from "../src";

jest.mock("fs");

describe("ConnectService", () => {
  describe("getTemplates", () => {
    it("should return the file content if a directory path is provided as contentSource", async () => {
      // Given
      const folder = "/folder";
      const content = [
        { key: "foo", title: "Foo", repository: { url: "foo", path: "/foo" } },
      ];
      (fs.readFileSync as unknown as jest.Mock) = jest
        .fn()
        .mockReturnValueOnce(JSON.stringify(content));
      const contentService = new ConnectContentService("/folder");

      // When
      const result = await contentService.getTemplates();

      // Then
      expect(fs.readFileSync).toHaveBeenCalledWith(`${folder}/connect`, "utf8");
      expect(result).toEqual(content);
    });

    // it("should return the remote file content if a url is provided as contentSource", async () => {
    //   // Given
    //   const folder = "/folder";
    //   const content = [
    //     { key: "foo", title: "Foo", repository: { url: "foo", path: "/foo" } },
    //   ];
    //   (fs.readFile as unknown as jest.Mock) = jest.fn(
    //     (filePath: string, encoding: string, callback) => {
    //       if (
    //         filePath === path.join(folder, "connect/templates.json") &&
    //         encoding === "utf8"
    //       ) {
    //         return callback(undefined, content);
    //       }
    //     },
    //   );
    //   const contentService = new ConnectContentService("/folder");

    //   // When
    //   const result = await contentService.getTemplates();

    //   // Then
    //   expect(result).toBe(content);
    // });
  });
});
