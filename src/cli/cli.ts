import { Command } from "../../deps.ts";
import { version } from "../../version.ts";
import { run } from "./run.ts";

// TODO: dot options for treeshake and watch

const program = await new Command()
  .name("rollup")
  .version(version)
  .description("Next-generation ES module bundler for Deno")
  .arguments("[entrypoint]")
  .option(
    "-c, --config [filename:string]",
    "Use this config file (if argument is used but value is unspecified, defaults to rollup.config.js)",
  )
  .option(
    "-d, --dir <dirname:string>",
    "Directory for chunks (if absent, prints to stdout)",
  )
  .option(
    "-e, --external <ids:string[]>",
    "Comma-separate list of module IDs to exclude",
  )
  .option(
    "-f, --format <format:string>",
    "Type of output (amd, cjs, es, iife, umd, system)",
  )
  .option(
    "-g, --globals <pairs:string[]>",
    "Comma-separate list of `moduleID:Global` pairs",
  )
  .option(
    "-i, --input <filename:string>",
    "Input (alternative to <entry file>)",
  )
  .option(
    "-m, --sourcemap [type:string]",
    "Generate sourcemap (`-m inline` for inline map)",
    { default: false },
  )
  .option("--no-sourcemap", "Do not generate sourcemap")
  .option(
    "-n, --name <name:string>",
    "Name for UMD export",
  )
  .option(
    "-o, --file <output>",
    "Single output file (if absent, prints to stdout)",
  )
  .option(
    "-p, --plugin <plugin>",
    "Use the plugin specified (may be repeated)",
  )
  .option(
    "-w, --watch",
    "Watch files in bundle and rebuild on changes",
  )
  .option(
    "--amd.id <id:string>",
    "ID for AMD module (default is anonymous)",
  )
  .option(
    "--amd.autoId",
    "Generate the AMD ID based off the chunk name",
  )
  .option(
    "--amd.basePath <prefix:string>",
    "Path to prepend to auto generated AMD ID",
  )
  .option(
    "--amd.define <name:string>",
    "Function to use in place of `define`",
  )
  .option(
    "--assetFileNames <pattern:string>",
    "Name pattern for emitted assets",
    { default: "assets/[name]-[hash][extname]" },
  )
  .option(
    "--banner <text:string>",
    "Code to insert at top of bundle (outside wrapper)",
  )
  .option(
    "--chunkFileNames <pattern:string>",
    "Name pattern for emitted secondary chunks",
    { default: "[name]-[hash].js" },
  )
  .option("--compact", "Minify wrapper code", { default: false })
  .option("--no-compact", "Do not minify wrapper code")
  .option("--context <variable:string>", "Specify top-level `this` value")
  .option(
    "--entryFileNames <pattern:string>",
    "Name pattern for emitted entry chunks",
    { default: "[name].js" },
  )
  .option(
    "--environment <values>",
    "Settings passed to config file (see example)",
  )
  .option("--esModule", "Add __esModule property", { default: true })
  .option("--no-esModule", "Do not add __esModule property")
  .option(
    "--exports <mode:string>",
    "Specify export mode (auto, default, named, none)",
    { default: "auto" },
  )
  .option("--extend", "Extend global variable defined by --name", {
    default: false,
  })
  .option("--no-extend", "Do not extend global variable defined by --name")
  .option(
    "--externalLiveBindings",
    "Generate code to support live bindings",
    { default: true },
  )
  .option(
    "--no-externalLiveBindings",
    "Do not generate code to support live bindings",
  )
  .option(
    "--footer <text:string>",
    "Code to insert at end of bundle (outside wrapper)",
  )
  .option("--freeze", "Freeze namespace objects", { default: true })
  .option("--no-freeze", "Do not freeze namespace objects")
  .option(
    "--hoistTransitiveImports",
    "Hoist transitive imports into entry chunks",
    { default: true },
  )
  .option(
    "--no-hoistTransitiveImports",
    "Do not hoist transitive imports into entry chunks",
  )
  .option("--indent", "Indent result", { default: true })
  .option("--no-indent", "Do not indent result")
  .option("--interop <value>", "Include interop block", { default: true })
  .option("--no-interop", "Do not include interop block")
  .option(
    "--inlineDynamicImports",
    "Create single bundle when using dynamic imports",
    { default: false },
  )
  .option(
    "--no-inlineDynamicImports",
    "Do not create single bundle when using dynamic imports",
  )
  .option(
    "--intro <text:string>",
    "Code to insert at top of bundle (inside wrapper)",
  )
  .option(
    "--minifyInternalExports",
    "Force or disable minification of internal exports",
  )
  .option(
    "--no-minifyInternalExports",
    "Do not force or disable minification of internal exports",
  )
  .option(
    "--namespaceToStringTag",
    "Create proper `.toString` methods for namespaces",
    { default: false },
  )
  .option(
    "--no-namespaceToStringTag",
    "Do not create proper `.toString` methods for namespaces",
  )
  .option("--noConflict", "Generate a noConflict method for UMD globals", {
    default: false,
  })
  .option(
    "--no-noConflict",
    "Do not generate a noConflict method for UMD globals",
  )
  .option(
    "--outro <text:string>",
    "Code to insert at end of bundle (inside wrapper)",
  )
  .option("--preferConst", "Use `const` instead of `var` for exports", {
    default: false,
  })
  .option("--no-preferConst", "Do not use `const` instead of `var` for exports")
  .option(
    "--preserveEntrySignatures",
    "Facade chunks for entry points",
    { default: "strict" },
  )
  .option(
    "--no-preserveEntrySignatures",
    "Avoid facade chunks for entry points",
  )
  .option("--preserveModules", "Preserve module structure", { default: false })
  .option("--no-preserveModules", "Do not reserve module structure")
  .option(
    "--preserveModulesRoot <directory:string>",
    "Put preserved modules under this path at root level",
  )
  .option("--preserveSymlinks", "Do not follow symlinks when resolving files", {
    default: false,
  })
  .option("--shimMissingExports", "Create shim variables for missing exports", {
    default: false,
  })
  .option(
    "--no-shimMissingExports",
    "Do not create shim variables for missing exports",
  )
  .option("--silent", "Do not print info and warnings")
  .option(
    "--sourcemapExcludeSources",
    "Do not include source code in source maps",
    { default: false },
  )
  .option(
    "--no-sourcemapExcludeSources",
    "Include source code in source maps",
  )
  .option(
    "--sourcemapFile <file:string>",
    "Specify bundle position for source maps",
  )
  .option("--stdin", "Specify file extension used for stdin input")
  .option("--no-stdin", 'Do not read "-" from stdin')
  .option("--strict", 'Emit `"use strict";` in the generated modules', {
    default: true,
  })
  .option("--no-strict", 'Do not emit `"use strict";` in the generated modules')
  .option("--strictDeprecations", "Throw errors for deprecated features", {
    default: false,
  })
  .option(
    "--no-strictDeprecations",
    "Don't throw errors for deprecated features",
  )
  .option("--systemNullSetters", "Replace empty SystemJS setters with `null`", {
    default: false,
  })
  .option(
    "--no-systemNullSetters",
    "Do not replace empty SystemJS setters with `null`",
  )
  .option(
    "--treeshake [treeshake:treeshake]",
    "Enable tree-shaking optimisations",
    {
      default: true,
    },
  )
  .option("--no-treeshake", "Disable tree-shaking optimisations")
  .option("--waitForBundleInput", "Wait for bundle input files")
  .option(
    "--experimentalCacheExpiry <runs:number>",
    "After how many runs cached assets that are no longer used by plugins should be removed",
    { default: 10 },
  )
  .option("--perf", "Collect performance timings", { default: false })
  .option("--no-perf", "Do not collect performance timings")
  .parse(Deno.args);

run(program);
