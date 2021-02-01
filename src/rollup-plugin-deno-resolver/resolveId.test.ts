import { expect } from "../../test/deps.ts";
import { join, resolve, sep, toFileUrl } from "../../deps.ts";
import { describe, it } from "../../test/mod.ts";
import { resolveId } from "./resolveId.ts";

describe("resolveId", () => {
  it("resolveId: when a remote URL source is provided: it should return the source unchanged", () => {
    const source = "https://github.com/cmorten/deno-rollup/test.ts";
    expect(resolveId(source)).toBe(source);
  });

  it("resolveId: when a file URL source is provided: it should return the source unchanged", () => {
    const source = toFileUrl(resolve("./test.ts")).href;
    expect(resolveId(source)).toBe(source);
  });

  it("resolveId: when a remote URL source is provided: and an importer is provided: it should return the source unchanged", () => {
    const source = "https://github.com/cmorten/deno-rollup/test.ts";
    expect(resolveId(source, "test-importer")).toBe(source);
  });

  it("resolveId: when a file URL source is provided: and an importer is provided: it should return the source unchanged", () => {
    const source = toFileUrl(resolve("./test.ts")).href;
    expect(resolveId(source, "test-importer")).toBe(source);
  });

  it("resolveId: when a path malformed remote URL source is provided: it should return the fixed source unchanged", () => {
    const source = "https://github.com/cmorten/deno-rollup/test.ts";
    expect(resolveId(source.replace("//", "/"))).toBe(source);
  });

  it("resolveId: when a path malformed file URL source is provided: it should return the fixed source unchanged", () => {
    const source = toFileUrl(resolve("./test.ts")).href;
    console.log({ source, res: resolve("./test.ts") });
    expect(resolveId(source.replace("///", "/"))).toBe(source);
  });

  it("resolveId: when a path malformed remote URL source is provided: and an importer is provided: it should return the fixed source unchanged", () => {
    const source = "https://github.com/cmorten/deno-rollup/test.ts";
    expect(resolveId(source.replace("//", "/"), "test-importer")).toBe(source);
  });

  it("resolveId: when a path malformed file URL source is provided: and an importer is provided: it should return the fixed source unchanged", () => {
    const source = toFileUrl(resolve("./test.ts")).href;
    expect(resolveId(source.replace("///", "/"), "test-importer")).toBe(source);
  });

  it("resolveId: when an absolute path source is provided: it should return the source unchanged", () => {
    const source = join(resolve("./"), "test.ts");
    expect(resolveId(source)).toBe(source);
  });

  it("resolveId: when an absolute path source is provided: and a remote URL importer is provided: it should return the resolved URL of the source from the importer", () => {
    const importer = "https://github.com/cmorten/deno-rollup/test.ts";
    const source = "/cmorten/opine-cli/test.ts";
    expect(resolveId(source, importer)).toBe(
      "https://github.com/cmorten/opine-cli/test.ts",
    );
  });

  it("resolveId: when an absolute path source is provided: and a file URL importer is provided: it should return the source", () => {
    const importer = toFileUrl(resolve("./test.ts")).href;
    const source = "/cmorten/opine-cli/test.ts";
    expect(resolveId(source, importer)).toBe(source);
  });

  it("resolveId: when an absolute path source is provided: and a path malformed remote URL importer is provided: it should return the resolved URL of the source from the fixed importer", () => {
    const importer = "https://github.com/cmorten/deno-rollup/test.ts";
    const source = "/cmorten/opine-cli/test.ts";
    expect(resolveId(source, importer.replace("//", "/"))).toBe(
      "https://github.com/cmorten/opine-cli/test.ts",
    );
  });

  it("resolveId: when an absolute path source is provided: and a path malformed file URL importer is provided: it should return the source", () => {
    const importer = toFileUrl(resolve("./test.ts")).href;
    const source = "/cmorten/opine-cli/test.ts";
    expect(resolveId(source, importer.replace("//", "/"))).toBe(source);
  });

  it("resolveId: when a relative path source is provided: it should return the source unchanged", () => {
    const source = join("..", "test-path", "test.ts");
    expect(resolveId(source)).toBe(source);
  });

  it("resolveId: when an unnormalized relative path source is provided: it should return the normalized source", () => {
    const source = `.${sep}${sep}test.ts`;
    expect(resolveId(source)).toBe(`test.ts`);
  });

  it("resolveId: when a relative path source is provided: and an encapsulating relative path importer is provided: it should return the resolved relative path of the source from the importer", () => {
    const importer = join("test-importer-path", "test-sub-path-1", "test.ts");
    const source = join("..", "test-sub-path-2", "test.ts");
    expect(resolveId(source, importer)).toBe(
      join("test-importer-path", "test-sub-path-2", "test.ts"),
    );
  });

  it("resolveId: when a relative path source is provided: and a non-encapsulating relative path importer is provided: it should return the resolved relative path of the source from the importer", () => {
    const importer = join("test-path-1", "test.ts");
    const source = join("..", "..", "test-path-2", "test.ts");
    expect(resolveId(source, importer)).toBe(
      join("..", "test-path-2", "test.ts"),
    );
  });

  it("resolveId: when a relative path source is provided: and an absolute path importer is provided: it should return the resolved absolute path of the source from the importer", () => {
    const importer = join(resolve("./"), "test-path-1", "test.ts");
    const source = join("..", "test-path-2", "test.ts");
    expect(resolveId(source, importer)).toBe(
      join(resolve("./"), "test-path-2", "test.ts"),
    );
  });

  it("resolveId: when a relative path source is provided: and a remote URL importer is provided: it should return the resolved URL of the source from the importer", () => {
    const importer = "https://github.com/cmorten/deno-rollup/test.ts";
    const source = join("..", "opine-cli", "test.ts");
    expect(resolveId(source, importer)).toBe(
      "https://github.com/cmorten/opine-cli/test.ts",
    );
  });

  it("resolveId: when a relative path source is provided: and a file URL importer is provided: it should return the resolved URL of the source from the importer", () => {
    const importer = toFileUrl(resolve("./test.ts")).href;
    const source = join("..", "opine-cli", "test.ts");
    expect(resolveId(source, importer)).toBe(
      resolve(source),
    );
  });

  it("resolveId: when a relative path source is provided: and a path malformed remote URL importer is provided: it should return the resolved URL of the source from the fixed importer", () => {
    const importer = "https://github.com/cmorten/deno-rollup/test.ts";
    const source = join("..", "opine-cli", "test.ts");
    expect(resolveId(source, importer.replace("//", "/"))).toBe(
      "https://github.com/cmorten/opine-cli/test.ts",
    );
  });

  it("resolveId: when a relative path source is provided: and a path malformed file URL importer is provided: it should return the resolved URL of the source from the fixed importer", () => {
    const importer = toFileUrl(resolve("./test.ts")).href;
    const source = join("..", "opine-cli", "test.ts");
    expect(resolveId(source, importer.replace("///", "/"))).toBe(
      resolve(source),
    );
  });
});
