import type { GenericConfigObject } from "./types.ts";
import { toFileUrl } from "../../deps.ts";

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
    throw new Error(
      "config file must export an commandOptions object, or an array of commandOptions objects https://rollupjs.org/guide/en/#configuration-file",
    );
  }

  return Array.isArray(config) ? config : [config];
}
