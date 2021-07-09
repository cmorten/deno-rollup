import type { RollupBuild, RollupOptions } from "./mod.ts";
import { rollup as _rollup } from "../../deps.ts";
import { write } from "./write.ts";
import { generate } from "./generate.ts";
import { denoResolver } from "../rollup-plugin-deno-resolver/mod.ts";
import { ensureArray } from "../ensureArray.ts";
import { error } from "../error.ts";

/**
 * rollup
 *
 * The `rollup` function receives an input options object as parameter
 * and returns a Promise that resolves to a `bundle` object with various
 * properties and methods as shown below. During this step, Rollup will
 * build the module graph and perform tree-shaking, but will not
 * generate any output.
 *
 * On a `bundle` object, you can call `bundle.generate` multiple times with
 * different output options objects to generate different bundles
 * in-memory. If you directly want to write them to disk, use `bundle.write`
 * instead.
 *
 * Once you're finished with the `bundle` object, you should call
 * `bundle.close()`, which will let plugins clean up their external
 * processes or services via the `closeBundle` hook.
 *
 * @param {RollupOptions} options
 * @returns {Promise<RollupBuild>}
 * @public
 */
export async function rollup(
  options: RollupOptions,
): Promise<RollupBuild> {
  const denoResolverPlugin = denoResolver(options.denoResolver);
  delete options.denoResolver;

  options = {
    ...options,
    plugins: options.plugins
      ? [
        ...ensureArray(options.plugins),
        denoResolverPlugin,
      ]
      : [denoResolverPlugin],
  };

  try {
    const bundle = await _rollup(options);

    return new Proxy(bundle, {
      get: (target, prop, receiver) => {
        const value = Reflect.get(target, prop, receiver);

        if (prop === "write") {
          return write.bind(target);
        } else if (prop === "generate") {
          return generate.bind(target);
        }

        return value;
      },
    });
  } catch (err) {
    if (err?.plugin === denoResolverPlugin.name) {
      const { plugin: _plugin, code: _code, pluginCode, ...rest } = err;

      return error({
        code: pluginCode,
        ...rest,
      });
    }

    throw err;
  }
}
