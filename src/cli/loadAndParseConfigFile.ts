import type { MergedRollupOptions } from "../../deps.ts";
import type { GenericConfigObject } from "../types.ts";
import { loadConfigFile } from "./loadConfigFile.ts";
import { mergeOptions } from "../mergeOptions.ts";

export async function loadAndParseConfigFile(
  fileName: string,
  commandOptions: GenericConfigObject = {},
): Promise<{ options: MergedRollupOptions[] }> {
  const configs = await loadConfigFile(fileName, commandOptions);
  const options = configs.map((config) => mergeOptions(config, commandOptions));

  return { options };
}
