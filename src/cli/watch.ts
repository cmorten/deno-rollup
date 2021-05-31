/**
 * Derived from <https://github.com/rollup/rollup/blob/v2.42.3/cli/run/watch-cli.ts>
 */

import type {
  IParseResult,
  MergedRollupOptions,
  RollupError,
} from "../../deps.ts";
import type { RollupWatcher } from "../rollup/mod.ts";
import { VERSION, watch as _watch } from "../rollup/mod.ts";
import { bold, cyan, green, ms, underline } from "../../deps.ts";
import { getConfigPath } from "./getConfigPath.ts";
import { loadAndParseConfigFile } from "./loadAndParseConfigFile.ts";
import { loadConfigFromCommand } from "./loadConfigFromCommand.ts";
import { printTimings } from "./printTimings.ts";
import { relativeId } from "../relativeId.ts";
import { handleError, logInfo } from "../logging.ts";

class ConfigWatcher {
  private closed = false;

  constructor(configFile: string, onChange: () => void) {
    this.createWatcher(configFile, onChange);
  }

  close() {
    this.closed = true;
  }

  private async createWatcher(configFile: string, onChange: () => void) {
    const watcher = Deno.watchFs(configFile);

    for await (const { kind } of watcher) {
      if (this.closed) {
        break;
      } else if (kind === "modify") {
        onChange();
      }
    }
  }
}

export async function watch(program: IParseResult) {
  Deno.env.set("ROLLUP_WATCH", "true");

  const isTTY = Deno.isatty(Deno.stderr.rid);
  const silent = program.options.silent;

  let configs: MergedRollupOptions[];
  let watcher: RollupWatcher;
  let configWatcher: ConfigWatcher;
  let reloadingConfig = false;
  let aborted = false;
  let configFileData: string | null = null;

  window.addEventListener("unload", () => {
    console.log("unload");
    if (watcher) {
      watcher.close();
    }
    if (configWatcher) {
      configWatcher.close();
    }
  });

  const configFile = program.options.config
    ? await getConfigPath(program.options.config)
    : null;

  if (configFile) {
    configWatcher = new ConfigWatcher(configFile, reloadConfigFile);

    await reloadConfigFile();
  } else {
    ({ options: configs } = await loadConfigFromCommand(program.options));

    start(configs);
  }

  async function reloadConfigFile() {
    try {
      const newConfigFileData = Deno.readTextFileSync(configFile!);

      if (newConfigFileData === configFileData) {
        return;
      }

      if (reloadingConfig) {
        aborted = true;

        return;
      }

      if (configFileData) {
        logInfo(`\nReloading updated config...`);
      }

      configFileData = newConfigFileData;
      reloadingConfig = true;

      ({ options: configs } = await loadAndParseConfigFile(
        configFile!,
        program.options,
      ));

      reloadingConfig = false;

      if (aborted) {
        aborted = false;
        reloadConfigFile();
      } else {
        if (watcher) {
          watcher.close();
        }

        start(configs);
      }
    } catch (err) {
      configs = [];
      reloadingConfig = false;
      handleError(err, true);
    }
  }

  function start(configs: MergedRollupOptions[]) {
    try {
      watcher = _watch(configs);
    } catch (err) {
      return handleError(err);
    }

    watcher.on("event", (event) => {
      switch (event.code) {
        case "ERROR": {
          handleError(event.error, true);

          break;
        }
        case "START": {
          if (!silent) {
            logInfo(underline(`rollup v${VERSION}`));
          }

          break;
        }
        case "BUNDLE_START": {
          if (!silent) {
            let input = event.input;

            if (typeof input !== "string") {
              input = Array.isArray(input)
                ? input.join(", ")
                : Object.keys(input as Record<string, string>)
                  .map((key) => (input as Record<string, string>)[key])
                  .join(", ");
            }

            logInfo(
              cyan(
                `bundles ${bold(input)} → ${
                  bold(event.output.map(relativeId).join(", "))
                }...`,
              ),
            );
          }

          break;
        }
        case "BUNDLE_END": {
          if (!silent) {
            logInfo(
              green(
                `created ${bold(event.output.map(relativeId).join(", "))} in ${
                  bold(
                    ms(event.duration),
                  )
                }`,
              ),
            );
          }

          if (event.result && event.result.getTimings) {
            printTimings(event.result.getTimings());
          }

          break;
        }
        case "END": {
          if (!silent && isTTY) {
            logInfo(
              `\n[${new Date().toUTCString()}] waiting for changes...`,
            );
          }

          break;
        }
      }

      if ("result" in event && event.result) {
        event.result.close().catch((error: RollupError) =>
          handleError(error, true)
        );
      }
    });
  }
}
