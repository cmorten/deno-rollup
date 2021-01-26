import { expect } from "../../test/deps.ts";
import { join, sep, toFileUrl } from "../../deps.ts";
import { describe, it } from "../../test/mod.ts";
import { getUrlBase } from "./getUrlBase.ts";

function assertUrlMatch(test: URL, expected: URL): void | never {
  expect(JSON.stringify(test.toJSON())).toBe(
    JSON.stringify(expected.toJSON()),
  );
}

describe("getUrlBase", () => {
  it("getUrlBase: should return the CWD as a file URL", () => {
    const expected = toFileUrl(join(Deno.cwd(), sep));
    const urlBase = getUrlBase();

    assertUrlMatch(urlBase, expected);
  });
});
