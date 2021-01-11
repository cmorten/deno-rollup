import { expect } from "../../test/deps.ts";
import { describe, it } from "../../test/mod.ts";
import { isTypescript } from "./isTypescript.ts";

describe("isTypescript", () => {
  [
    "test.ts",
    "test.tsx",
    "../test.ts",
    "../test.tsx",
    "/test.ts",
    "/test.tsx",
  ].forEach((source) => {
    it(`isTypescript: should return true for '${source}'`, () => {
      expect(isTypescript(source)).toBeTruthy();
    });
  });

  [
    "test.t",
    "test.tx",
    "test.txs",
    "test.tsz",
    "test.tsxz",
    "test.js",
    "test.jsx",
  ].forEach((source) => {
    it(`isTypescript: should return false for '${source}'`, () => {
      expect(isTypescript(source)).toBeFalsy();
    });
  });
});
