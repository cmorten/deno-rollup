import { expect } from "../../test/deps.ts";
import { join, resolve, sep, toFileUrl } from "../../deps.ts";
import { describe, it } from "../../test/mod.ts";
import { resolveId } from "./resolveId.ts";

describe("resolveId", () => {
  it("resolveId: when a remote URL source is provided: it should return the source unchanged", () => {
    const source = "https://github.com/cmorten/deno-rollup/source.ts";
    expect(resolveId(source)).toBe(source);
  });

  it("resolveId: when a file URL source is provided: it should return the source unchanged", () => {
    const source = toFileUrl(resolve("./source.ts")).href;
    expect(resolveId(source)).toBe(source);
  });

  it("resolveId: when a remote URL source is provided: and an importer is provided: it should return the source unchanged", () => {
    const source = "https://github.com/cmorten/deno-rollup/source.ts";
    expect(resolveId(source, "test-importer")).toBe(source);
  });

  it("resolveId: when a file URL source is provided: and an importer is provided: it should return the source unchanged", () => {
    const source = toFileUrl(resolve("./source.ts")).href;
    expect(resolveId(source, "test-importer")).toBe(source);
  });

  it("resolveId: when a path malformed remote URL source is provided: it should return the fixed source", () => {
    const source = "https://github.com/cmorten/deno-rollup/source.ts";
    expect(resolveId(join(source))).toBe(source);
  });

  it("resolveId: when a path malformed file URL source is provided: it should return the fixed source", () => {
    const source = toFileUrl(resolve("./source.ts")).href;
    expect(resolveId(join(source))).toBe(source);
  });

  it("resolveId: when a path malformed remote URL source is provided: and an importer is provided: it should return the fixed source", () => {
    const source = "https://github.com/cmorten/deno-rollup/source.ts";
    expect(resolveId(join(source), "test-importer")).toBe(source);
  });

  it("resolveId: when a path malformed file URL source is provided: and an importer is provided: it should return the fixed source", () => {
    const source = toFileUrl(resolve("./source.ts")).href;
    expect(resolveId(join(source), "test-importer")).toBe(source);
  });

  it("resolveId: when an absolute path source is provided: it should return the source unchanged", () => {
    const source = join(resolve("./"), "source.ts");
    expect(resolveId(source)).toBe(source);
  });

  it("resolveId: when an absolute path source is provided: and a remote URL importer is provided: it should return the resolved URL of the source from the importer", () => {
    const importer = "https://github.com/cmorten/deno-rollup/importer.ts";
    const source = "/cmorten/opine-cli/source.ts";
    expect(resolveId(source, importer)).toBe(
      "https://github.com/cmorten/opine-cli/source.ts",
    );
  });

  it("resolveId: when an absolute path source is provided: and a file URL importer is provided: it should return the source", () => {
    const importer = toFileUrl(resolve("./importer.ts")).href;
    const source = resolve("./source.ts");
    expect(resolveId(source, importer)).toBe(source);
  });

  it("resolveId: when an absolute path source is provided: and a path malformed remote URL importer is provided: it should return the resolved URL of the source from the fixed importer", () => {
    const importer = "https://github.com/cmorten/deno-rollup/importer.ts";
    const source = "/cmorten/opine-cli/source.ts";
    expect(resolveId(source, join(importer))).toBe(
      "https://github.com/cmorten/opine-cli/source.ts",
    );
  });

  it("resolveId: when an absolute path source is provided: and a path malformed file URL importer is provided: it should return the source", () => {
    const importer = toFileUrl(resolve("./importer.ts")).href;
    const source = resolve("./source.ts");
    expect(resolveId(source, join(importer))).toBe(source);
  });

  it("resolveId: when a relative path source is provided: it should return the source unchanged", () => {
    const source = join("..", "test-path", "source.ts");
    expect(resolveId(source)).toBe(source);
  });

  it("resolveId: when an unnormalized relative path source is provided: it should return the normalized source", () => {
    const source = `.${sep}${sep}source.ts`;
    expect(resolveId(source)).toBe(`source.ts`);
  });

  it("resolveId: when a relative path source is provided: and an encapsulating relative path importer is provided: it should return the resolved relative path of the source from the importer", () => {
    const importer = join(
      "test-importer-path",
      "test-sub-path-1",
      "importer.ts",
    );
    const source = join("..", "test-sub-path-2", "source.ts");
    expect(resolveId(source, importer)).toBe(
      join("test-importer-path", "test-sub-path-2", "source.ts"),
    );
  });

  it("resolveId: when a relative path source is provided: and a non-encapsulating relative path importer is provided: it should return the resolved relative path of the source from the importer", () => {
    const importer = join("test-path-1", "importer.ts");
    const source = join("..", "..", "test-path-2", "source.ts");
    expect(resolveId(source, importer)).toBe(
      join("..", "test-path-2", "source.ts"),
    );
  });

  it("resolveId: when a relative path source is provided: and an absolute path importer is provided: it should return the resolved absolute path of the source from the importer", () => {
    const importer = join(resolve("./"), "test-path-1", "importer.ts");
    const source = join("..", "test-path-2", "source.ts");
    expect(resolveId(source, importer)).toBe(
      join(resolve("./"), "test-path-2", "source.ts"),
    );
  });

  it("resolveId: when a relative path source is provided: and a remote URL importer is provided: it should return the resolved URL of the source from the importer", () => {
    const importer = "https://github.com/cmorten/deno-rollup/importer.ts";
    const source = join("..", "opine-cli", "source.ts");
    expect(resolveId(source, importer)).toBe(
      "https://github.com/cmorten/opine-cli/source.ts",
    );
  });

  it("resolveId: when a relative path source is provided: and a file URL importer is provided: it should return the resolved URL of the source from the importer", () => {
    const importer = toFileUrl(resolve("./importer.ts")).href;
    const source = join("..", "opine-cli", "source.ts");
    expect(resolveId(source, importer)).toBe(
      resolve(source),
    );
  });

  it("resolveId: when a relative path source is provided: and a path malformed remote URL importer is provided: it should return the resolved URL of the source from the fixed importer", () => {
    const importer = "https://github.com/cmorten/deno-rollup/importer.ts";
    const source = join("..", "opine-cli", "source.ts");
    expect(resolveId(source, join(importer))).toBe(
      "https://github.com/cmorten/opine-cli/source.ts",
    );
  });

  it("resolveId: when a relative path source is provided: and a path malformed file URL importer is provided: it should return the resolved URL of the source from the fixed importer", () => {
    const importer = toFileUrl(resolve("./importer.ts")).href;
    const source = join("..", "opine-cli", "source.ts");
    expect(resolveId(source, join(importer))).toBe(
      resolve(source),
    );
  });
});
