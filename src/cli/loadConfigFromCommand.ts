/**
 * Derived from <https://github.com/rollup/rollup/blob/v2.41.0/cli/run/loadConfigFromCommand.ts>
 */

import type { MergedRollupOptions } from "../../deps.ts";
import type { GenericConfigObject } from "../types.ts";
import { mergeOptions } from "../mergeOptions.ts";

const stdinName = "-";

// TODO: warnings

export function loadConfigFromCommand(
  commandOptions: GenericConfigObject = {},
): { options: MergedRollupOptions[] } {
  if (
    !commandOptions.input &&
    (commandOptions.stdin || !Deno.isatty(Deno.stdin.rid))
  ) {
    commandOptions.input = stdinName;
  }

  const options = [mergeOptions({ input: [] }, commandOptions)];

  return { options };
}
