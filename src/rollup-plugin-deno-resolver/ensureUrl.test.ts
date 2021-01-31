import { expect } from "../../test/deps.ts";
import { describe, it } from "../../test/mod.ts";
import { ensureUrl } from "./ensureUrl.ts";

const validUrlStrings = [
  "http://",
  "https://",
  "file:///",
  "http://test-path",
  "https://test-path",
  "file:///test-path",
];

describe("ensureUrl", () => {
  validUrlStrings.forEach((source) => {
    it(`ensureUrl: should return valid URL strings unchanged: '${source}'`, () => {
      expect(ensureUrl(source)).toBe(source);
    });
  });

  validUrlStrings.map((string) => string.replace(/([\/]+)/, "/")).forEach(
    (source, index) => {
      it(`ensureUrl: should return path malformed URL strings with fixes: '${source}'`, () => {
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
  ].forEach((source) => {
    it(`ensureUrl: should return null for strings that are not URLs: '${source}'`, () => {
      expect(ensureUrl(source)).toBeNull();
    });
  });
});
