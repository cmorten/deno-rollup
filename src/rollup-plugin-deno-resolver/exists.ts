import { notImplemented } from "../notImplemented.ts";

export async function exists(
  url: URL,
  fetchOpts?: RequestInit,
): Promise<boolean> {
  switch (url.protocol) {
    case "file:": {
      try {
        const { isFile } = await Deno.stat(url);

        return isFile;
      } catch {
        return false;
      }
    }
    case "http:":
    case "https:": {
      try {
        const res = await fetch(url.href, fetchOpts);

        // Prevent leaking fetchResponseBody resource
        // TODO: given we are now duplicating loadUrl,
        // we should instead cache and re-using in the
        // load() for the plugin.
        await res.arrayBuffer();

        return res.ok;
      } catch {
        return false;
      }
    }
    default: {
      return notImplemented(`support for protocol '${url.protocol}'`);
    }
  }
}
