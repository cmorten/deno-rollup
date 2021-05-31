import type { OutputOptions, RollupBuild, RollupOutput } from "./mod.ts";
import { dirname, join } from "../../deps.ts";
import { supportUrlSources } from "./supportUrlSources.ts";
import { getDestination } from "./getDestination.ts";
import { handleError } from "../logging.ts";

export const SOURCEMAPPING_URL = "sourceMappingURL";

/**
 * write
 *
 * @param {RollupBuild} this
 * @param {OutputOptions} options
 * @returns {Promise<RollupOutput>}
 * @private
 */
export async function write(
  this: RollupBuild,
  options: OutputOptions,
): Promise<RollupOutput> {
  options = supportUrlSources(options);

  const rollupOutput = await this.generate(options);
  const destination = getDestination(options);

  if (!destination) {
    throw handleError(
      {
        message: `you must specify "output.file" or "output.dir" for the build`,
      },
    );
  }

  for (const outputFile of rollupOutput.output) {
    const fullPath = join(destination, outputFile.fileName);
    await Deno.mkdir(dirname(fullPath), { recursive: true });

    let source: string | Uint8Array;

    if (outputFile.type === "asset") {
      source = outputFile.source;
    } else {
      source = outputFile.code;

      if (options.sourcemap && outputFile.map) {
        let url: string;

        if (options.sourcemap === "inline") {
          url = outputFile.map.toUrl();
        } else {
          url = `${outputFile.fileName}.map`;

          await Deno.writeTextFile(
            `${fullPath}.map`,
            JSON.stringify(outputFile.map),
          );
        }

        if (options.sourcemap !== "hidden") {
          source += `//# ${SOURCEMAPPING_URL}=${url}\n`;
        }
      }
    }

    if (typeof source === "string") {
      await Deno.writeTextFile(fullPath, source);
    } else {
      await Deno.writeFile(fullPath, source);
    }
  }

  return rollupOutput;
}
