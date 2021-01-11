import { expect } from "../../test/deps.ts";
import { dirname, join, resolve, sep, toFileUrl } from "../../deps.ts";
import { describe, it } from "../../test/mod.ts";
import { getUrlBase } from "./getUrlBase.ts";

function assertUrlMatch(test: URL, expected: URL): void | never {
  expect(JSON.stringify(test.toJSON())).toBe(
    JSON.stringify(expected.toJSON()),
  );
}

describe("getUrlBase", () => {
  it("getUrlBase: when no importer is provided: should return the CWD as a file URL", () => {
    const expected = toFileUrl(join(Deno.cwd(), sep));
    const urlBase = getUrlBase();

    assertUrlMatch(urlBase, expected);
  });

  it("getUrlBase: when an undefined importer is provided: should return the CWD as a file URL", () => {
    const expected = toFileUrl(join(Deno.cwd(), sep));
    const urlBase = getUrlBase(undefined);

    assertUrlMatch(urlBase, expected);
  });

  it("getUrlBase: when an absolute path importer is provided: should return the directory path of the importer as a file URL", () => {
    const importer = resolve("./getUrlBase.test.ts");
    const expected = toFileUrl(join(dirname(importer), sep));
    const urlBase = getUrlBase(importer);

    assertUrlMatch(urlBase, expected);
  });

  it("getUrlBase: when a remote URL path importer is provided: should return the directory path of the importer as a file URL", () => {
    const importer = "https://github.com/cmorten/deno-rollup/test.ts";
    const expected = new URL(join(dirname(importer), sep));
    const urlBase = getUrlBase(importer);

    assertUrlMatch(urlBase, expected);
  });

  it("getUrlBase: when an sibling relative path importer is provided: should return the directory path of the importer as a file URL", () => {
    const importer = "./test.ts";
    const expected = toFileUrl(join(Deno.cwd(), dirname(importer), sep));
    const urlBase = getUrlBase(importer);

    assertUrlMatch(urlBase, expected);
  });

  it("getUrlBase: when a parent relative path importer is provided: should return the directory path of the importer as a file URL", () => {
    const importer = "../test.ts";
    const expected = toFileUrl(join(Deno.cwd(), dirname(importer), sep));
    const urlBase = getUrlBase(importer);

    assertUrlMatch(urlBase, expected);
  });

  it("getUrlBase: when a child relative path importer is provided: should return the directory path of the importer as a file URL", () => {
    const importer = "./test-path/test.ts";
    const expected = toFileUrl(join(Deno.cwd(), dirname(importer), sep));
    const urlBase = getUrlBase(importer);

    assertUrlMatch(urlBase, expected);
  });
});
