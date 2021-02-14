/**
 * Derived from <https://github.com/rollup/rollup/blob/v2.39.0/cli/run/index.ts>
 */

import type { IParseResult, MergedRollupOptions } from "../../deps.ts";
import { getConfigPath } from "./getConfigPath.ts";
import { loadAndParseConfigFile } from "./loadAndParseConfigFile.ts";
import { loadConfigFromCommand } from "./loadConfigFromCommand.ts";

export async function getConfigs(
  program: IParseResult,
): Promise<{ options: MergedRollupOptions[] }> {
  if (program.options.config) {
    const configFile = await getConfigPath(program.options.config);

    return await loadAndParseConfigFile(configFile, program.options);
  }

  return loadConfigFromCommand(program.options);
}
