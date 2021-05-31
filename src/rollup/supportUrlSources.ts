import type { OutputOptions } from "./mod.ts";
import { normalize } from "../../deps.ts";

const RE_PATH_MALFORMED_HTTP_URL = /(.*)(https?:\/)([^\/]?)/;
const RE_PATH_MALFORMED_FILE_URL = /(.*)(file:\/)([^\/]?)/;

/**
 * supportUrlSources
 *
 * @param {OutputOptions} options
 * @returns {OutputOptions}
 * @private
 */
export function supportUrlSources(
  options: OutputOptions,
): OutputOptions {
  return {
    ...options,
    sourcemapPathTransform(relativeSourcePath: string, sourcemapPath: string) {
      if (RE_PATH_MALFORMED_HTTP_URL.test(relativeSourcePath)) {
        relativeSourcePath = relativeSourcePath.replace(
          RE_PATH_MALFORMED_HTTP_URL,
          "$2/$3",
        );
      } else if (RE_PATH_MALFORMED_FILE_URL.test(relativeSourcePath)) {
        relativeSourcePath = relativeSourcePath.replace(
          RE_PATH_MALFORMED_FILE_URL,
          "$2//$3",
        );
      }

      sourcemapPath = normalize(sourcemapPath);

      return options.sourcemapPathTransform
        ? options.sourcemapPathTransform(relativeSourcePath, sourcemapPath)
        : relativeSourcePath;
    },
  };
}
