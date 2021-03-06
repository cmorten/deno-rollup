/**
 * Derived from <https://github.com/rollup/rollup/blob/v2.39.1/cli/run/index.ts>
 */

import type { IParseResult } from "../../deps.ts";
import { handleError } from "../logging.ts";
import { getAliasName } from "./getAliasName.ts";
import { environment } from "./environment.ts";
import { getConfigs } from "./getConfigs.ts";
import { build } from "./build.ts";
import { notImplemented } from "../notImplemented.ts";

export async function run(program: IParseResult) {
  let inputSource;

  if (program.args.length) {
    if (program.options.input) {
      handleError({
        code: "DUPLICATE_IMPORT_OPTIONS",
        message: "either use --input, or pass input path as argument",
      });
    }

    inputSource = program.args;
  } else if (typeof program.options.input === "string") {
    inputSource = [program.options.input];
  } else {
    inputSource = program.options.input;
  }

  if (inputSource && inputSource.length) {
    if (inputSource.some((input: string) => input.indexOf("=") !== -1)) {
      program.options.input = {};

      inputSource.forEach((input: string) => {
        const equalsIndex = input.indexOf("=");
        const value = input.substr(equalsIndex + 1);
        let key = input.substr(0, equalsIndex);

        if (!key) {
          key = getAliasName(input);
        }

        program.options.input[key] = value;
      });
    } else {
      program.options.input = inputSource;
    }
  }

  if (program.options.plugin) {
    // TODO: remove from the types + code elsewhere or implement
    return notImplemented("-p, --plugin option");
  }

  environment(program);

  if (program.options.watch) {
    const { watch } = await import("./watch.ts");

    watch(program);
  } else {
    try {
      const { options } = await getConfigs(program);

      for (const inputOptions of options) {
        await build(inputOptions, program.options.silent);
      }
    } catch (err) {
      handleError(err);
    }
  }
}
