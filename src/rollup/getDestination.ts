import type { OutputOptions } from "./mod.ts";
import { dirname, resolve } from "../../deps.ts";

/**
 * getDestination
 * 
 * @param {OutputOptions} options
 * @returns {string}
 * @private
 */
export function getDestination(options: OutputOptions): string | never {
  const { dir, file } = options;

  if (dir) {
    return resolve(dir);
  } else if (file) {
    return resolve(dirname(file));
  }

  throw new Error(
    `You must specify "output.file" or "output.dir" for the build.`,
  );
}
