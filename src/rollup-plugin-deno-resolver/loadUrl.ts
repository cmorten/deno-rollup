import { notImplemented } from "../notImplemented.ts";
import { Cache } from "../../deps.ts";

const decoder = new TextDecoder("utf-8");

/**
 * loadUrl
 *
 * @param {URL} url
 * @param {RequestInit} [fetchOpts]
 * @returns {Promise<string>}
 * @private
 */
export async function loadUrl(
  url: URL,
  fetchOpts?: RequestInit,
): Promise<string> | never {
  switch (url.protocol) {
    case "file:": {
      const out = await Deno.readFile(url);

      return decoder.decode(out);
    }
    case "http:":
    case "https:": {
      try {
        const file = await Cache.cache(url.href);

        return await Deno.readTextFile(file.path);
      } catch {
        const res = await fetch(url.href, fetchOpts);

        return await res.text();
      }
    }
    default: {
      return notImplemented(`support for protocol '${url.protocol}'`);
    }
  }
}
