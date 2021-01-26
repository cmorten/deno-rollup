import { dirname, join, normalize } from "../../deps.ts";
import { ensureUrl } from "./ensureUrl.ts";

/**
 * resolveId
 * 
 * @param {string} source 
 * @param {string} [importer]
 * @returns {string}
 * @private
 */
export function resolveId(source: string, importer?: string): string {
  const sourceUrl = ensureUrl(source);

  if (sourceUrl) {
    return sourceUrl;
  }

  source = normalize(source);

  if (importer) {
    const importerUrl = ensureUrl(importer);

    if (importerUrl) {
      return new URL(source, importerUrl).href;
    }

    return join(dirname(importer), source);
  }

  return source;
}
