import {
  dirname,
  fromFileUrl,
  isAbsolute,
  join,
  normalize,
} from "../../deps.ts";
import { ensureUrl } from "./ensureUrl.ts";

const RE_HTTP_URL = /^(https?):\/\//;
const RE_WIN_DEVICE = /^([A-Za-z]:)(\\+|\/)/;

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
      const devicelessSource = source.replace(RE_WIN_DEVICE, "$2");
      const url = new URL(devicelessSource, importerUrl);

      return RE_HTTP_URL.test(url.href) ? url.href : fromFileUrl(url);
    }

    if (isAbsolute(source)) {
      return source;
    }

    return join(dirname(importer), source);
  }

  return source;
}
