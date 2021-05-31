import { join, sep, toFileUrl } from "../../deps.ts";

/**
 * getUrlBase
 *
 * @returns {URL}
 * @private
 */
export function getUrlBase(): URL {
  return toFileUrl(join(Deno.cwd(), sep));
}
