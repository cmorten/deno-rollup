import { expect } from "../../test/deps.ts";
import { bold, red, toFileUrl } from "../../deps.ts";
import { describe, it } from "../../test/mod.ts";
import { exists } from "./exists.ts";

const denoRunCommandPrefix = ["deno", "run", "--unstable"];
const decoder = new TextDecoder();

describe("exists", () => {
  it("exists: when the protocol is not supported", async () => {
    const scriptPath = "./test/fixtures/existsDataProtocol.ts";
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

  it("exists: when passed a valid file URL: it should true", async () => {
    const tempFile = await Deno.makeTempFile();
    await Deno.writeTextFile(tempFile, "Hello Deno!");

    expect(await exists(toFileUrl(tempFile))).toEqual(true);

    await Deno.remove(tempFile);
  });

  it("exists: when passed a file URL which does not exist: it should false", async () => {
    expect(await exists(toFileUrl("/test-path/test-file.ts"))).toEqual(false);
  });

  it("exists: when passed a valid remote HTTP URL: it should return true", async () => {
    const url =
      "http://raw.githubusercontent.com/cmorten/deno-rollup/main/test/fixtures/msg.txt";

    expect(await exists(new URL(url))).toEqual(true);
  });

  it("exists: when passed a remote HTTP URL which does not exist: it should return false", async () => {
    const url =
      "http://raw.githubusercontent.com/cmorten/deno-rollup/main/test/fixtures/~~~.txt";

    expect(await exists(new URL(url))).toEqual(false);
  });

  it("exists: when passed a valid remote HTTPS URL: it should return true", async () => {
    const url =
      "https://raw.githubusercontent.com/cmorten/deno-rollup/main/test/fixtures/msg.txt";

    expect(await exists(new URL(url))).toEqual(true);
  });

  it("exists: when passed a remote HTTPS URL which does not exist: it should return false", async () => {
    const url =
      "https://raw.githubusercontent.com/cmorten/deno-rollup/main/test/fixtures/~~~.txt";

    expect(await exists(new URL(url))).toEqual(false);
  });
});
