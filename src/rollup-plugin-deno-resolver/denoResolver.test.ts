import { expect } from "../../test/deps.ts";
import { join, resolve } from "../../deps.ts";
import { describe, it } from "../../test/mod.ts";
import { denoResolver } from "./denoResolver.ts";

describe("denoResolver", () => {
  it("denoResolver: it should return an object with a name of rollup-plugin-deno-resolver", () => {
    expect(denoResolver().name).toEqual("rollup-plugin-deno-resolver");
  });

  it("denoResolver: it should return an object with a resolveId function", () => {
    expect(denoResolver().resolveId).toBeInstanceOf(Function);
  });

  it("denoResolver: it should return an object with a load function", () => {
    expect(denoResolver().load).toBeInstanceOf(Function);
  });
});
