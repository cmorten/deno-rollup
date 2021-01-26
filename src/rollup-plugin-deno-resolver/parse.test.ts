import { expect } from "../../test/deps.ts";
import { join, sep, toFileUrl } from "../../deps.ts";
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

  it("parse: when a relative source is provided: it should return the resolved source from the CWD as a URL instance", () => {
    const source = "./test-path/test.ts";

    assertUrlMatch(
      parse(source) as URL,
      new URL(source, toFileUrl(join(Deno.cwd(), sep))),
    );
  });

  it("parse: when a source that cannot be parsed is provided: it should return null", () => {
    expect(parse("https://://")).toBe(null);
  });
});
