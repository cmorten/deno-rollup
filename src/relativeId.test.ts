import { expect } from "../test/deps.ts";
import { resolve } from "../deps.ts";
import { describe, it } from "../test/mod.ts";
import { relativeId } from "./relativeId.ts";

describe("relativeId", () => {
  it("relativeId: when a relative file path is provided as the id: it should return the id unchanged", () => {
    const id = "relativeId.ts";
    expect(relativeId(id)).toBe(id);
  });

  it("relativeId: when a relative file path is provided as the id: it should return the path of the id relative to the current working directory", () => {
    const relativePath = "relativeId.ts";
    const id = resolve(relativePath);
    expect(relativeId(id)).toBe(relativePath);
  });
});
