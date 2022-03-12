import { expect } from "../../test/deps.ts";
import { bold, red, resolve, toFileUrl } from "../../deps.ts";
import { describe, it } from "../../test/mod.ts";
import { loadUrl } from "./loadUrl.ts";

const denoRunCommandPrefix = ["deno", "run", "--unstable", "--allow-env"];
const decoder = new TextDecoder();

describe("loadUrl", () => {
  it("loadUrl: when the protocol is not supported", async () => {
    const scriptPath = "./test/fixtures/loadUrlDataProtocol.ts";
    const expectedMessage = `${
      bold(red(`[!] ${bold("Not implemented: support for protocol 'data:'")}`))
    }\n\n`;

    const process = await Deno.run({
      cmd: [...denoRunCommandPrefix, scriptPath],
      stdout: "piped",
      stderr: "piped",
    });

    expect(await process.status()).toEqual({ code: 1, success: false });
    expect(decoder.decode(await process.output())).toEqual("");
    expect(decoder.decode(await process.stderrOutput())).toMatch(
      expectedMessage,
    );

    await process.close();
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
    const contents = await Deno.readTextFile(path);
    const url =
      "https://raw.githubusercontent.com/cmorten/deno-rollup/main/test/fixtures/msg.txt";

    expect(await loadUrl(new URL(url))).toEqual(contents);
  });
});
