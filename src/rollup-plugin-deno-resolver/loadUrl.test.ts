import { expect } from "../../test/deps.ts";
import { resolve, toFileUrl } from "../../deps.ts";
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

  it("loadUrl: when passed a remote HTTP URL: it should return the contents", async () => {
    const path = resolve("./test/fixtures/msg.txt");
    const contents = await Deno.readTextFile(path);
    const url =
      "http://raw.githubusercontent.com/cmorten/deno-rollup/main/test/fixtures/msg.txt";

    expect(await loadUrl(new URL(url))).toEqual(contents);
  });

  it("loadUrl: when passed a remote HTTPS URL: it should return the contents", async () => {
    const path = resolve("./test/fixtures/msg.txt");
    console.log(path);
    const contents = await Deno.readTextFile(path);
    const url =
      "https://raw.githubusercontent.com/cmorten/deno-rollup/main/test/fixtures/msg.txt";

    expect(await loadUrl(new URL(url))).toEqual(contents);
  });
});
