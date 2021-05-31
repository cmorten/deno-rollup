/**
 * Derived from <https://github.com/rollup/rollup/blob/v2.42.3/cli/run/index.ts>
 */

import type { IParseResult } from "../../deps.ts";

// TODO: the browser version of rollup probably isn't doing anything
// with these, so we should check if there is any expected
// behaviour for certain env vars that we need to polyfill.

export function environment(program: IParseResult) {
  if (program.options.environment) {
    for (const pair of program.options.environment) {
      const [key, ...value] = pair.split(":");

      if (value.length) {
        Deno.env.set(key, value.join(":"));
      } else {
        Deno.env.set(key, "true");
      }
    }
  }
}
