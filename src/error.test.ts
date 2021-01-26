// deno-lint-ignore-file no-explicit-any

import { expect } from "../test/deps.ts";
import { describe, it } from "../test/mod.ts";
import { error } from "./error.ts";

const mockError = new Error("test-error");
const mockObject = {
  message: "test-object-message",
  name: "test-name",
  frame: "test-frame",
  parserError: "test-parse-error",
};

describe("error", () => {
  it("error: when the passed argument is an error: it should throw the passed error", () => {
    let thrownError: Error;

    try {
      error(mockError);
    } catch (err) {
      thrownError = err;
    }

    expect(thrownError).toEqual(mockError);
  });

  it("error: when the passed argument is an object: it should throw an error with the passed object's message and properties", () => {
    let thrownError: Error;

    try {
      error(mockObject);
    } catch (err) {
      thrownError = err;
    }

    expect(thrownError).toBeInstanceOf(Error);
    Object.entries(mockObject).forEach(([key, value]) => {
      expect((thrownError as any)[key]).toEqual(value);
    });
  });
});
