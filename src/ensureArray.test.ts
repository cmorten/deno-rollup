import { expect } from "../test/deps.ts";
import { describe, it } from "../test/mod.ts";
import { ensureArray } from "./ensureArray.ts";

describe("ensureArray", () => {
  it("ensureArray: when passed an array: it should return all truthy values", () => {
    const items = [1, 2, null, 3, undefined, false, 4];
    expect(ensureArray(items)).toEqual([1, 2, 3, 4]);
  });

  it("ensureArray: when passed a truthy value that is not an array: it should the value in an array", () => {
    const item = Symbol("test-item");
    expect(ensureArray(item)).toEqual([item]);
  });

  [false, undefined, null].forEach((item) =>
    it(`ensureArray: when passed the falsey value "${item}": it should return an empty array`, () => {
      expect(ensureArray(item)).toEqual([]);
    })
  );
});
