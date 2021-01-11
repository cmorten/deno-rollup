import { expect } from "../../test/deps.ts";
import { describe, it } from "../../test/mod.ts";
import { isUrl } from "./isUrl.ts";

describe("isUrl", () => {
  [
    "http://",
    "https://",
    "file://",
    "http://test-path",
    "https://test-path",
    "file://test-path",
  ].forEach((source) => {
    it(`isUrl: should return true for '${source}'`, () => {
      expect(isUrl(source)).toBeTruthy();
    });
  });

  [
    "http:/",
    "https:/",
    "file:/",
    "http:",
    "https:",
    "file:",
    "http",
    "https",
    "file",
    "/http://",
    "/https://",
    "/file://",
    "http:/test-path/",
    "https:/test-path/",
    "file:/test-path/",
  ].forEach((source) => {
    it(`isUrl: should return false for '${source}'`, () => {
      expect(isUrl(source)).toBeFalsy();
    });
  });
});
