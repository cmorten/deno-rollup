import type { OutputOptions } from "./mod.ts";
import { dirname, resolve } from "../../deps.ts";
import { handleError } from "../logging.ts";

/**
 * getDestination
 * 
 * @param {OutputOptions} options
 * @returns {string}
 * @private
 */
export function getDestination(
  options: OutputOptions,
): string | never {
  const { dir, file } = options;

  if (dir) {
    return resolve(dir);
  } else if (file) {
    return resolve(dirname(file));
  }

  throw handleError(
    {
      message: `You must specify "output.file" or "output.dir" for the build.`,
    },
  );
}
