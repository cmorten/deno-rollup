import { isAbsolute, relative } from "../deps.ts";

/**
 * relativeId
 * 
 * @param {string} id
 * @returns {string}
 * @private
 */
export function relativeId(id: string): string {
  if (!isAbsolute(id)) {
    return id;
  }

  return relative(Deno.cwd(), id);
}
