import type { OutputOptions } from "./mod.ts";
import { dirname, resolve } from "../../deps.ts";

/**
 * getDestination
 *
 * @param {OutputOptions} options
 * @returns {string|null}
 * @private
 */
export function getDestination(
  options: OutputOptions,
): string | null {
  const { dir, file } = options;

  if (dir) {
    return resolve(dir);
  } else if (file) {
    return resolve(dirname(file));
  }

  return null;
}
