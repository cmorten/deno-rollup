// deno-lint-ignore-file no-explicit-any

/**
 * Code adapted from https://github.com/rollup/rollup/blob/master/test/utils.js
 */

import { dirname, join } from "../deps.ts";
import { listGitHub } from "./deps.ts";
import { toUrlString } from "./toUrlString.ts";
import { requireSham } from "./requireSham.ts";

(globalThis as any).require = requireSham;

type Test = (dir: string, config: any) => void;

export async function runTestSuiteWithSamples(
  suiteName: string,
  excludes: string[],
  runTest: Test,
) {
  await runSamples(suiteName, excludes, runTest);
}

async function runSamples(
  suiteName: string,
  excludes: string[],
  runTest: Test,
) {
  const samplesDir = `test/${suiteName}/samples/`;

  const directories = (await readGitHubDirSync(samplesDir))
    .reduce((directories, filePath) => {
      const currentDirectoryIndex = directories.length - 1;
      const currentDirectory = dirname(
        directories?.[currentDirectoryIndex]?.[0] || "",
      ).split(`/.`)[0];

      if (
        excludes.some((exclude) => filePath.includes(exclude))
      ) {
        return directories;
      } else if (
        currentDirectory !== "" &&
        filePath.startsWith(`${currentDirectory}/`)
      ) {
        directories[currentDirectoryIndex].push(filePath);
      } else {
        directories.push([filePath]);
      }

      return directories;
    }, [] as string[][]);

  for (const directory of directories) {
    await runTestsInDir(directory, runTest);
  }
}

async function readGitHubDirSync(samplesDir: string): Promise<string[]> {
  return await listGitHub.viaTreesApi({
    user: "rollup",
    repository: "rollup",
    directory: samplesDir,
    token: Deno.env.get("GITHUB_PAT"),
  });
}

async function runTestsInDir(filePaths: string[], runTest: Test) {
  const configPath = filePaths.find((filePath) =>
    filePath.includes("_config.js")
  );

  if (configPath) {
    await loadConfigAndRunTest(`${dirname(configPath)}/`, runTest);
  } else {
    throw new Error("could not find config file");
  }
}

async function loadConfigAndRunTest(dir: string, runTest: Test) {
  const __dirname = toUrlString(dir);
  (globalThis as any).__dirname = __dirname;

  try {
    const config = await loadConfig(join(dir, "_config.js"));

    if (
      config &&
      (!config.skipIfWindows || Deno.build.os !== "windows") &&
      (!config.onlyWindows || Deno.build.os === "windows")
    ) {
      await runTest(__dirname, config);
    }
  } catch (err) {
    throw err;
  }
}

async function loadConfig(configFile: string) {
  try {
    (globalThis as any).module = {};
    await import(toUrlString(configFile));

    const exports = (globalThis as any).module?.exports || {};
    delete (globalThis as any).module;

    return exports;
  } catch (err) {
    throw new Error(`Failed to load ${configFile}: ${err.message}`);
  }
}
