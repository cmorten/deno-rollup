import { createFilter } from "../../src/rollup/createFilter.ts";
import { compile, path, preprocess } from "./deps.ts";

const PREFIX = "[rollup-plugin-svelte]";
const pkgExportErrors = new Set();

const pluginOptions = new Set([
  "emitCss",
  "exclude",
  "extensions",
  "include",
  "onwarn",
  "preprocess",
]);

/**
 * @param [options] {Partial<import('.').Options>}
 * @returns {import('rollup').Plugin}
 */
export default (options = {}) => {
  const { compilerOptions = {}, ...rest } = options;
  const extensions = rest.extensions || [".svelte"];
  const filter = createFilter(rest.include, rest.exclude);

  compilerOptions.format = "esm";

  for (const key in rest) {
    if (pluginOptions.has(key)) continue;
    console.warn(
      `${PREFIX} Unknown "${key}" option. Please use "compilerOptions" for any Svelte compiler configuration.`,
    );
  }

  // [filename]:[chunk]
  const cacheEmit = new Map();
  const { onwarn, emitCss = true } = rest;

  if (emitCss) {
    if (compilerOptions.css) {
      console.warn(
        `${PREFIX} Forcing \`"compilerOptions.css": false\` because "emitCss" was truthy.`,
      );
    }
    compilerOptions.css = false;
  }

  return {
    name: "svelte",

    /**
     * Resolve an import's full filepath.
     */
    resolveId(importee, importer) {
      if (cacheEmit.has(importee)) return importee;
      if (
        !importer ||
        importee[0] === "." ||
        importee[0] === "\0" ||
        path.isAbsolute(importee)
      ) {
        return null;
      }

      // if this is a bare import, see if there's a valid pkg.svelte
      const parts = importee.split("/");

      let dir,
        pkg,
        name = parts.shift();
      if (name && name[0] === "@") {
        name += `/${parts.shift()}`;
      }

      // use pkg.svelte
      if (parts.length === 0 && pkg.svelte) {
        return path.resolve(dir, pkg.svelte);
      }
    },

    /**
     * Returns CSS contents for a file, if ours
     */
    load(id) {
      return cacheEmit.get(id) || null;
    },

    /**
     * Transforms a `.svelte` file into a `.js` file.
     * NOTE: If `emitCss`, append static `import` to virtual CSS file.
     */
    async transform(code, id) {
      if (!filter(id)) return null;

      const extension = path.extname(id);
      if (!~extensions.indexOf(extension)) return null;

      const dependencies = [];
      const filename = path.relative(Deno.cwd(), id);
      const svelteOptions = { ...compilerOptions, filename };

      if (rest.preprocess) {
        const processed = await preprocess(code, rest.preprocess, { filename });
        if (processed.dependencies) {
          dependencies.push(...processed.dependencies);
        }
        if (processed.map) svelteOptions.sourcemap = processed.map;
        code = processed.code;
      }

      const compiled = compile(code, svelteOptions);

      (compiled.warnings || []).forEach((warning) => {
        if (!emitCss && warning.code === "css-unused-selector") return;
        if (onwarn) onwarn(warning, this.warn);
        else this.warn(warning);
      });

      if (emitCss && compiled.css.code) {
        const fname = id.replace(new RegExp(`\\${extension}$`), ".css");
        compiled.js.code += `\nimport ${JSON.stringify(fname)};\n`;
        cacheEmit.set(fname, compiled.css);
      }

      if (this.addWatchFile) {
        dependencies.forEach(this.addWatchFile);
      } else {
        compiled.js.dependencies = dependencies;
      }

      return compiled.js;
    },

    /**
     * All resolutions done; display warnings wrt `package.json` access.
     */
    generateBundle() {
      if (pkgExportErrors.size > 0) {
        console.warn(
          `\n${PREFIX} The following packages did not export their \`package.json\` file so we could not check the "svelte" field. If you had difficulties importing svelte components from a package, then please contact the author and ask them to export the package.json file.\n`,
        );
        console.warn(
          Array.from(pkgExportErrors, (s) => `- ${s}`).join("\n") + "\n",
        );
      }
    },
  };
};
