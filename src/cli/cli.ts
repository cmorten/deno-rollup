import { Command } from "../../deps.ts";
import { version } from "../../version.ts";
import { run } from "./run.ts";

const program = await new Command()
  .name("rollup")
  .version(version)
  .description("Next-generation ES module bundler for Deno")
  .arguments("[entrypoint]")
  .option(
    "-c, --config [filename]",
    "Use this config file (if argument is used but value is unspecified, defaults to rollup.config.js)",
  )
  .option(
    "-d, --dir <dirname>",
    "Directory for chunks (if absent, prints to stdout)",
  )
  .option(
    "-e, --external <ids:string[]>",
    "Comma-separate list of module IDs to exclude",
  )
  .option(
    "-f, --format <format>",
    "Type of output (amd, cjs, es, iife, umd, system)",
  )
  .option(
    "-g, --globals <pairs:string[]>",
    "Comma-separate list of `moduleID:Global` pairs",
  )
  .option(
    "-i, --input <filename>",
    "Input (alternative to <entry file>)",
  )
  .option(
    "-m, --sourcemap [type]",
    "Generate sourcemap (`-m inline` for inline map)",
  )
  .option(
    "-n, --name <name>",
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
    "--amd.id <id>",
    "ID for AMD module (default is anonymous)",
  )
  .option(
    "--amd.autoId",
    "Generate the AMD ID based off the chunk name",
  )
  .option(
    "--amd.basePath <prefix>",
    "Path to prepend to auto generated AMD ID",
  )
  .option(
    "--amd.define <name>",
    "Function to use in place of `define`",
  )
  .option(
    "--assetFileNames <pattern>",
    "Name pattern for emitted assets",
  )
  .option(
    "--banner <text>",
    "Code to insert at top of bundle (outside wrapper)",
  )
  .option(
    "--chunkFileNames <pattern>",
    "Name pattern for emitted secondary chunks",
  )
  .option("--compact", "Minify wrapper code")
  .option("--context <variable>", "Specify top-level `this` value")
  .option("--entryFileNames <pattern>", "Name pattern for emitted entry chunks")
  .option(
    "--environment <values>",
    "Settings passed to config file (see example)",
  )
  .option("--no-esModule", "Do not add __esModule property")
  .option(
    "--exports <mode>",
    "Specify export mode (auto, default, named, none)",
  )
  .option("--extend", "Extend global variable defined by --name")
  .option(
    "--no-externalLiveBindings",
    "Do not generate code to support live bindings",
  )
  .option(
    "--footer <text>",
    "Code to insert at end of bundle (outside wrapper)",
  )
  .option("--no-freeze", "Do not freeze namespace objects")
  .option(
    "--no-hoistTransitiveImports",
    "Do not hoist transitive imports into entry chunks",
  )
  .option("--no-indent", "Don't indent result")
  .option("--no-interop", "Do not include interop block")
  .option(
    "--inlineDynamicImports",
    "Create single bundle when using dynamic imports",
  )
  .option("--intro <text>", "Code to insert at top of bundle (inside wrapper)")
  .option(
    "--minifyInternalExports",
    "Force or disable minification of internal exports",
  )
  .option(
    "--namespaceToStringTag",
    "Create proper `.toString` methods for namespaces",
  )
  .option("--noConflict", "Generate a noConflict method for UMD globals")
  .option("--outro <text>", "Code to insert at end of bundle (inside wrapper)")
  .option("--preferConst", "Use `const` instead of `var` for exports")
  .option(
    "--no-preserveEntrySignatures",
    "Avoid facade chunks for entry points",
  )
  .option("--preserveModules", "Preserve module structure")
  .option(
    "--preserveModulesRoot",
    "Put preserved modules under this path at root level",
  )
  .option("--preserveSymlinks", "Do not follow symlinks when resolving files")
  .option("--shimMissingExports", "Create shim variables for missing exports")
  .option("--silent", "Don't print info and warnings")
  .option(
    "--sourcemapExcludeSources",
    "Do not include source code in source maps",
  )
  .option("--sourcemapFile <file>", "Specify bundle position for source maps")
  .option("--stdin", "Specify file extension used for stdin input")
  .option("--no-stdin", 'Do not read "-" from stdin')
  .option("--no-strict", 'Don\'t emit `"use strict";` in the generated modules')
  .option("--systemNullSetters", "Replace empty SystemJS setters with `null`")
  .option("--no-treeshake", "Disable tree-shaking optimisations")
  .option("--waitForBundleInput", "Wait for bundle input files")
  .parse(Deno.args);

run(program);
