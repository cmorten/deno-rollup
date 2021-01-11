import { expect } from "../../test/deps.ts";
import { join, resolve } from "../../deps.ts";
import { describe, it } from "../../test/mod.ts";
import { resolveId } from "./resolveId.ts";

describe("resolveId", () => {
  it("resolveId: when a URL source is provided: it should return the source unchanged", () => {
    const source = "https://github.com/cmorten/deno-rollup/test.ts";
    expect(resolveId(source)).toBe(source);
  });

  it("resolveId: when a URL source is provided: and an importer is provided: it should return the source unchanged", () => {
    const source = "https://github.com/cmorten/deno-rollup/test.ts";
    expect(resolveId(source, "test-importer")).toBe(source);
  });

  it("resolveId: when an absolute path source is provided: it should return the source unchanged", () => {
    const source = join(resolve("./"), "test.ts");
    expect(resolveId(source)).toBe(source);
  });

  it("resolveId: when an absolute path source is provided: and an importer is provided: it should return the source unchanged", () => {
    const source = join(resolve("./"), "test.ts");
    expect(resolveId(source, "test-importer")).toBe(source);
  });

  it("resolveId: when a relative path source is provided: it should return the source unchanged", () => {
    const source = join("..", "test-path", "test.ts");
    expect(resolveId(source)).toBe(source);
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

  it("resolveId: when a relative path source is provided: and an URL importer is provided: it should return the resolved URL of the source from the importer", () => {
    const importer = "https://github.com/cmorten/deno-rollup/test.ts";
    const source = join("..", "opine-cli", "test.ts");
    expect(resolveId(source, importer)).toBe(
      "https://github.com/cmorten/opine-cli/test.ts",
    );
  });
});
