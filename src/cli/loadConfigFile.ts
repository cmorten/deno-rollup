import type { GenericConfigObject } from "./types.ts";
import { toFileUrl } from "../../deps.ts";
import { handleError } from "../logging.ts";

export async function loadConfigFile(
  fileName: string,
  commandOptions: GenericConfigObject,
): Promise<GenericConfigObject[]> {
  const filePath = toFileUrl(fileName).href;
  const configFileExport = (await import(filePath)).default;

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

  return Array.isArray(config) ? config : [config];
}
