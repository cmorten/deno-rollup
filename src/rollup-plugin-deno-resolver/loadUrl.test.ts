import { expect } from "../../test/deps.ts";
import { dirname, join, sep, toFileUrl } from "../../deps.ts";
import { describe, it } from "../../test/mod.ts";
import { loadUrl } from "./loadUrl.ts";

describe("loadUrl", () => {
  it("loadUrl: when the protocol is not supported", () => {
    const url = new URL("data://123abc");

    expect(loadUrl(url)).rejects.toMatch(
      "Error: Not implemented: support for protocol 'data:'",
    );
  });

  it("loadUrl: when passed a file URL: it should return the file contents", async () => {
    const tempFile = await Deno.makeTempFile();
    const contents = "Hello Deno!";
    await Deno.writeTextFile(tempFile, contents);

    let error;

    try {
      expect(await loadUrl(toFileUrl(tempFile))).toEqual(contents);
    } catch (e) {
      error = e;
    }

    await Deno.remove(tempFile);

    if (error) {
      throw error;
    }
  });
});
