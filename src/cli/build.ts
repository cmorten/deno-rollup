import type { MergedRollupOptions } from "../rollup/mod.ts";
import { bold, cyan, green, ms } from "../../deps.ts";
import { relativeId } from "./relativeId.ts";
import { SOURCEMAPPING_URL } from "../rollup/write.ts";
import { rollup } from "../rollup/mod.ts";
import { printTimings } from "./printTimings.ts";

const encoder = new TextEncoder();

export async function build(
  inputOptions: MergedRollupOptions,
  silent = false,
): Promise<unknown> {
  const outputOptions = inputOptions.output;
  const useStdout = !outputOptions[0].file && !outputOptions[0].dir;
  const start = Date.now();
  const files = useStdout
    ? ["stdout"]
    : outputOptions.map((t) => relativeId(t.file || t.dir!));

  if (!silent) {
    let inputFiles: string | undefined;

    if (typeof inputOptions.input === "string") {
      inputFiles = inputOptions.input;
    } else if (inputOptions.input instanceof Array) {
      inputFiles = inputOptions.input.join(", ");
    } else if (
      typeof inputOptions.input === "object" && inputOptions.input !== null
    ) {
      inputFiles = Object.keys(inputOptions.input)
        .map((name) => (inputOptions.input as Record<string, string>)[name])
        .join(", ");
    }

    console.info(cyan(`\n${bold(inputFiles!)} → ${bold(files.join(", "))}...`));
  }

  const bundle = await rollup(inputOptions);

  if (useStdout) {
    const output = outputOptions[0];

    if (output.sourcemap && output.sourcemap !== "inline") {
      throw new Error(
        "only inline sourcemaps are supported when bundling to stdout",
      );
    }

    const { output: outputs } = await bundle.generate(output);

    for (const file of outputs) {
      let source: string | Uint8Array;

      if (file.type === "asset") {
        source = file.source;
      } else {
        source = file.code;

        if (output.sourcemap === "inline") {
          source += `\n//# ${SOURCEMAPPING_URL}=${file.map!.toUrl()}\n`;
        }
      }

      if (outputs.length > 1) {
        console.info(`\n${cyan(bold(`//→ ${file.fileName}:`))}\n`);
      }

      if (typeof source === "string") {
        source = encoder.encode(source);
      }

      Deno.stdout.write(source);
    }

    return;
  }

  await Promise.all(outputOptions.map(bundle.write));
  await bundle.close();

  if (!silent) {
    console.info(
      green(
        `created ${bold(files.join(", "))} in ${bold(ms(Date.now() - start))}`,
      ),
    );

    if (bundle && bundle.getTimings) {
      printTimings(bundle.getTimings());
    }
  }
}
