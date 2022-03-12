import { expect } from "../../test/deps.ts";
import { describe, it } from "../../test/mod.ts";
import { join, resolve } from "../../deps.ts";
import { getConfigPath } from "./getConfigPath.ts";

const denoRunCommandPrefix = ["deno", "run", "--allow-read", "--allow-env"];
const decoder = new TextDecoder();

describe("getConfigPath", () => {
  it("getConfigPath: when passed a config path: it should return the resolved path", async () => {
    const configPath = "./test-path/test.config.ts";
    expect(await getConfigPath(configPath)).toEqual(resolve(configPath));
  });

  it("getConfigPath: when passed true: and a recognised js config file exists in the CWD: it should return the resolved path to the js config file", async () => {
    const cwd = resolve("./test/fixtures/directoryWithJsConfig/");
    const scriptName = join(cwd, "getConfigPathWithTrue.ts");
    const expectedOutput = join(cwd, "rollup.config.js");

    const process = await Deno.run({
      cmd: [...denoRunCommandPrefix, scriptName],
      cwd,
      stdout: "piped",
      stderr: "piped",
    });

    expect(await process.status()).toEqual({ code: 0, success: true });
    expect(decoder.decode(await process.output())).toEqual(
      `${expectedOutput}\n`,
    );
    expect(decoder.decode(await process.stderrOutput())).toMatch(
      "",
    );

    await process.close();
  });

  it("getConfigPath: when passed true: and no recognised js config file exists in the CWD: it should return the resolved path to the ts config file", async () => {
    const cwd = resolve("./test/fixtures/directoryWithTsConfig/");
    const scriptName = join(cwd, "getConfigPathWithTrue.ts");
    const expectedOutput = join(cwd, "rollup.config.ts");

    const process = await Deno.run({
      cmd: [...denoRunCommandPrefix, scriptName],
      cwd,
      stdout: "piped",
      stderr: "piped",
    });

    expect(await process.status()).toEqual({ code: 0, success: true });
    expect(decoder.decode(await process.output())).toEqual(
      `${expectedOutput}\n`,
    );
    expect(decoder.decode(await process.stderrOutput())).toMatch(
      "",
    );

    await process.close();
  });
});
