/**
 * Derived from <https://github.com/rollup/rollup/blob/v2.42.3/cli/run/loadConfigFile.ts>
 */

import type { GenericConfigObject } from "../types.ts";
import { toFileUrl } from "../../deps.ts";
import { ensureArray } from "../ensureArray.ts";
import { handleError } from "../logging.ts";

export async function loadConfigFile(
  fileName: string,
  commandOptions: GenericConfigObject,
): Promise<GenericConfigObject[]> {
  const filePath = toFileUrl(fileName).href;
  const configFileExport =
    (await import(`${filePath}?cachebust=${+(new Date())}`)).default;

  return getConfigList(configFileExport, commandOptions);
}

async function getConfigList(
  configFileExport: unknown,
  commandOptions: GenericConfigObject,
): Promise<GenericConfigObject[]> {
  const config = typeof configFileExport === "function"
    ? await configFileExport(commandOptions)
    : configFileExport;

  if (Object.keys(config).length === 0) {
    handleError({
      code: "MISSING_CONFIG",
      message:
        "config file must export an options object, or an array of options objects",
      url: "https://rollupjs.org/guide/en/#configuration-files",
    });
  }

  return ensureArray(config);
}
