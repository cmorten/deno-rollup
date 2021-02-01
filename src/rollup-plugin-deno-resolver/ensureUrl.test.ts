import { expect } from "../../test/deps.ts";
import { describe, it } from "../../test/mod.ts";
import { join } from "../../deps.ts";
import { ensureUrl } from "./ensureUrl.ts";

const validUrlStrings = [
  "http://",
  "https://",
  "file:///C:/",
  "file:///",
  "http://test-path",
  "https://test-path",
  "file:///test-path",
  "file:///C:/test-path",
];

describe("ensureUrl", () => {
  validUrlStrings.forEach((source) => {
    it(`ensureUrl: should return valid URL strings unchanged: '${source}'`, () => {
      expect(ensureUrl(source)).toBe(source);
    });
  });

  validUrlStrings.map((string) => join(string)).forEach(
    (source, index) => {
      it(`ensureUrl: should return path malformed URL strings with fixes: '${source}'`, () => {
        console.log(source, validUrlStrings[index])
        expect(ensureUrl(source)).toBe(validUrlStrings[index]);
      });
    },
  );

  [
    "http:",
    "https:",
    "file:",
    "http",
    "https",
    "file",
    "/http://",
    "/https://",
    "/file:///",
    "/file://C:/",
  ].forEach((source) => {
    it(`ensureUrl: should return null for strings that are not URLs: '${source}'`, () => {
      expect(ensureUrl(source)).toBeNull();
    });
  });
});
