import type { OutputOptions, RollupBuild, RollupOutput } from "./mod.ts";
import { supportUrlSources } from "./supportUrlSources.ts";

/**
 * generate
 *
 * @param {RollupBuild} this
 * @param {OutputOptions} options
 * @returns {Promise<RollupOutput>}
 * @private
 */
export async function generate(
  this: RollupBuild,
  options: OutputOptions,
): Promise<RollupOutput> {
  options = supportUrlSources(options);

  return await this.generate(options);
}
