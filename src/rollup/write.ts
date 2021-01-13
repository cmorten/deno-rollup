import type { OutputOptions, RollupBuild, RollupOutput } from "./mod.ts";
import { join } from "../../deps.ts";
import { getDestination } from "./getDestination.ts";

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
  const rollupOutput = await this.generate(options);
  const destination = getDestination(options);

  await Deno.mkdir(destination, { recursive: true });

  for (const outputFile of rollupOutput.output) {
    const fullPath = join(destination, outputFile.fileName);

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
            join(destination, `${outputFile.fileName}.map`),
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
