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
  console.log({ source, importer });

  const sourceUrl = ensureUrl(source);

  console.log({ sourceUrl });

  if (sourceUrl) {
    return sourceUrl;
  }

  source = normalize(source);

  console.log({ normalizedSource: source });

  if (importer) {
    const importerUrl = ensureUrl(importer);

    console.log({ importerUrl });

    if (importerUrl) {
      const url = new URL(source, importerUrl);

      console.log({
        url,
        out: RE_HTTP_URL.test(url.href) ? url.href : normalize(url.pathname),
      });

      return RE_HTTP_URL.test(url.href) ? url.href : normalize(url.pathname);
    }

    if (isAbsolute(source)) {
      return source;
    }

    console.log({ joined: join(dirname(importer), source) });

    return join(dirname(importer), source);
  }

  return source;
}
