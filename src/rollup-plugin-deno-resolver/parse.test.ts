import { expect } from "../../test/deps.ts";
import { dirname, join, sep, toFileUrl } from "../../deps.ts";
import { describe, it } from "../../test/mod.ts";
import { parse } from "./parse.ts";

function assertUrlMatch(test: URL, expected: URL): void | never {
  expect(JSON.stringify(test.toJSON())).toBe(
    JSON.stringify(expected.toJSON()),
  );
}

describe("parse", () => {
  it("parse: when a valid URL source is provided: it should return the source as a URL instance", () => {
    const source = "https://github.com/cmorten/deno-rollup/test.ts";

    assertUrlMatch(parse(source) as URL, new URL(source));
  });

  it("parse: when a relative source is provided: and no importer is provided: it should return the resolved source from the CWD as a URL instance", () => {
    const source = "./test-path/test.ts";

    assertUrlMatch(
      parse(source) as URL,
      new URL(source, toFileUrl(join(Deno.cwd(), sep))),
    );
  });

  it("parse: when a relative source is provided: and an importer is provided: it should return the resolved source from the importer as a URL instance", () => {
    const source = "./test/test.ts";
    const importer = "https://github.com/cmorten/deno-rollup/test.ts";

    assertUrlMatch(
      parse(source, importer) as URL,
      new URL(source, join(dirname(importer), sep)),
    );
  });

  it("parse: when a source and importer pair that cannot be parsed are provided: it should return null", () => {
    expect(parse("", "https://://")).toBe(null);
  });
});
