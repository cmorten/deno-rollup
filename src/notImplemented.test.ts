import { expect } from "../test/deps.ts";
import { describe, it } from "../test/mod.ts";
import { bold, red } from "../deps.ts";

const denoRunCommandPrefix = ["deno", "run", "--unstable", "--allow-env"];
const decoder = new TextDecoder();

describe("notImplemented", () => {
  it("notImplemented: when no message is provided: it should throw an error of 'Not implemented'", async () => {
    const scriptPath = "./test/fixtures/notImplementedWithoutMessage.ts";
    const expectedMessage = `${
      bold(red(`[!] ${bold("Not implemented")}`))
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

  it("notImplemented: when a message is provided: it should throw an error of 'Not implemented: ' followed by the message", async () => {
    const scriptPath = "./test/fixtures/notImplementedWithMessage.ts";
    const expectedMessage = `${
      bold(red(`[!] ${bold("Not implemented: Hello Deno!")}`))
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
});
