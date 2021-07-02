import type { BuildOptions } from "https://deno.land/x/esbuild@v0.12.14/mod.d.ts";
import type { FilterPattern, Plugin } from "../../mod.ts";
import {
  build,
  formatMessages,
  stop,
} from "https://deno.land/x/esbuild@v0.12.14/mod.js";
import { denoPlugin } from "https://deno.land/x/esbuild_deno_loader@0.1.1/mod.ts";
import { createFilter } from "../../src/rollup/createFilter.ts";

export interface RollupEsbuildOptions {
  /**
   * All files will be parsed by default,
   * but you can also specifically include files
   */
  include?: FilterPattern;
  /**
   * All files will be parsed by default,
   * but you can also specifically exclude files
   */
  exclude?: FilterPattern;
  /**
   * Esbuild transform options.
   */
  buildOptions: BuildOptions;
}

export function esbuild(options: RollupEsbuildOptions): Plugin {
  const filter = createFilter(options.include || ["**/*"], options.exclude);

  return {
    name: "esbuild",

    async load(id: string) {
      if (!filter(id)) {
        return;
      }

      const { outputFiles, warnings } = await build({
        entryPoints: [id],
        ...options.buildOptions,
        write: false,
        outdir: "out",
        incremental: false,
        watch: false,
        metafile: false,
        plugins: [denoPlugin(), ...(options.buildOptions.plugins ?? [])],
      });

      if (warnings.length) {
        const formattedWarnings = await formatMessages(warnings, {
          kind: "warning",
          color: true,
        });

        formattedWarnings.forEach((warning) => this.warn(warning));
      }

      return new TextDecoder().decode(outputFiles[0].contents);
    },

    closeBundle() {
      stop();
    },
  };
}
