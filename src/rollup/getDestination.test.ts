import { expect } from "../../test/deps.ts";
import { describe, it } from "../../test/mod.ts";
import { resolve } from "../../deps.ts";
import { getDestination } from "./getDestination.ts";

describe("getDestination", () => {
  it("getDestination: when passed a 'dir' option: it should return the resolved directory", () => {
    const dir = "./test-dir/";
    expect(getDestination({ dir })).toEqual(resolve(dir));
  });

  it("getDestination: when not passed a 'dir' option: but passed a 'file' option: it should return the resolved directory of the provided file", () => {
    const file = "./test-dir/test.ts";
    expect(getDestination({ file })).toEqual(resolve("./test-dir/"));
  });

  it("getDestination: when not passed a 'dir' or 'file' option: it should return null", () => {
    expect(getDestination({})).toBeNull();
  });
});
