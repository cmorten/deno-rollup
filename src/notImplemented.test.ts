import { expect } from "../test/deps.ts";
import { join, resolve } from "../deps.ts";
import { describe, it } from "../test/mod.ts";
import { notImplemented } from "./notImplemented.ts";

describe("notImplemented", () => {
  it("notImplemented: when no message is provided: it should throw an error of 'Not implemented'", () => {
    expect(() => notImplemented()).toThrow("Not implemented");
  });

  it("notImplemented: when a message is provided: it should throw an error of 'Not implemented: ' followed by the message", () => {
    const message = "Hello Deno!";
    expect(() => notImplemented(message)).toThrow(
      `Not implemented: ${message}`,
    );
  });
});
