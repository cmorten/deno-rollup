import type { MergedRollupOptions } from "../rollup/mod.ts";
import type { GenericConfigObject } from "../types.ts";
import { mergeOptions } from "../mergeOptions.ts";

const stdinName = "-";

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
