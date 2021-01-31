import { dirname, isAbsolute, join, normalize } from "../../deps.ts";
import { ensureUrl } from "./ensureUrl.ts";

const RE_HTTP_URL = /^(https?):\/\//;

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
      const url = new URL(source, importerUrl);

      return RE_HTTP_URL.test(url.href) ? url.href : url.pathname;
    }

    if (isAbsolute(source)) {
      return source;
    }

    return join(dirname(importer), source);
  }

  return source;
}
