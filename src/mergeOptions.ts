// deno-lint-ignore-file ban-types

import type { CommandConfigObject, GenericConfigObject } from "./types.ts";
import type {
  ExternalOption,
  MergedRollupOptions,
  OutputOptions,
  Plugin,
  RollupCache,
  WarningHandler,
  WarningHandlerWithDefault,
} from "../deps.ts";
import type { InputOptions } from "./rollup/mod.ts";
import { ensureArray } from "./ensureArray.ts";

export const onWarn: WarningHandler = (warning) =>
  console.warn(warning.message || warning);

export function mergeOptions(
  config: GenericConfigObject,
  rawCommandOptions: GenericConfigObject = { external: [] },
): MergedRollupOptions {
  const command = getCommandOptions(rawCommandOptions);

  const inputOptions = mergeInputOptions(
    config,
    command,
  ) as MergedRollupOptions;

  const outputOptionsArray = ensureArray(
    config.output,
  ) as GenericConfigObject[];

  if (outputOptionsArray.length === 0) {
    outputOptionsArray.push({});
  }

  const outputOptions = outputOptionsArray.map((singleOutputOptions) =>
    mergeOutputOptions(singleOutputOptions, command)
  );

  inputOptions.output = outputOptions;

  return inputOptions;
}

function getCommandOptions(
  rawCommandOptions: GenericConfigObject,
): CommandConfigObject {
  const external = (rawCommandOptions.external ?? []) as string[];

  const globals = (rawCommandOptions.globals as string[])?.reduce(
    (aggregatedGlobals, globalDefinition) => {
      const [id, variableName] = globalDefinition.split(":");
      aggregatedGlobals[id] = variableName;

      if (external.indexOf(id) === -1) {
        external.push(id);
      }

      return aggregatedGlobals;
    },
    {} as { [id: string]: string },
  );

  return {
    ...rawCommandOptions,
    external,
    globals,
  };
}

type CompleteInputOptions<U extends keyof InputOptions> = {
  [K in U]: InputOptions[K];
};

function mergeInputOptions(
  config: GenericConfigObject,
  overrides: CommandConfigObject,
): InputOptions {
  // deno-lint-ignore no-explicit-any
  const getOption = (name: string): any => overrides[name] ?? config[name];

  const inputOptions: CompleteInputOptions<keyof InputOptions> = {
    acorn: getOption("acorn"),
    acornInjectPlugins: config.acornInjectPlugins as
      | Function
      | Function[]
      | undefined,
    cache: config.cache as false | RollupCache | undefined,
    context: getOption("context"),
    experimentalCacheExpiry: getOption("experimentalCacheExpiry"),
    external: getExternal(config, overrides),
    inlineDynamicImports: getOption("inlineDynamicImports"),
    input: getOption("input") || [],
    manualChunks: getOption("manualChunks"),
    moduleContext: getOption("moduleContext"),
    onwarn: getOnWarn(config, onWarn),
    perf: getOption("perf"),
    plugins: ensureArray(config.plugins) as Plugin[],
    preserveEntrySignatures: getOption("preserveEntrySignatures"),
    preserveModules: getOption("preserveModules"),
    preserveSymlinks: getOption("preserveSymlinks"),
    shimMissingExports: getOption("shimMissingExports"),
    strictDeprecations: getOption("strictDeprecations"),
    treeshake: getObjectOption(config, overrides, "treeshake"),
    watch: getWatch(config, overrides, "watch"),
  };

  return inputOptions;
}

const getExternal = (
  config: GenericConfigObject,
  overrides: CommandConfigObject,
): ExternalOption => {
  const configExternal = config.external as ExternalOption | undefined;

  return typeof configExternal === "function"
    ? (source: string, importer: string | undefined, isResolved: boolean) =>
      configExternal(source, importer, isResolved) ||
      overrides.external.indexOf(source) !== -1
    : ensureArray(configExternal).concat(overrides.external);
};

const getOnWarn = (
  config: GenericConfigObject,
  defaultOnWarnHandler: WarningHandler,
): WarningHandler =>
  config.onwarn
    ? (warning) =>
      (config.onwarn as WarningHandlerWithDefault)(
        warning,
        defaultOnWarnHandler,
      )
    : defaultOnWarnHandler;

const getObjectOption = (
  config: GenericConfigObject,
  overrides: GenericConfigObject,
  name: string,
) => {
  const commandOption = normalizeObjectOptionValue(overrides[name]);
  const configOption = normalizeObjectOptionValue(config[name]);

  if (commandOption !== undefined) {
    return commandOption && { ...configOption, ...commandOption };
  }

  return configOption;
};

const getWatch = (
  config: GenericConfigObject,
  overrides: GenericConfigObject,
  name: string,
) => config.watch !== false && getObjectOption(config, overrides, name);

export const normalizeObjectOptionValue = (optionValue: unknown) => {
  if (!optionValue) {
    return optionValue;
  }

  if (Array.isArray(optionValue)) {
    return optionValue.reduce(
      (result, value) => value && result && { ...result, ...value },
      {},
    );
  }

  if (typeof optionValue !== "object") {
    return {};
  }

  return optionValue;
};

type CompleteOutputOptions<U extends keyof OutputOptions> = {
  [K in U]: OutputOptions[K];
};

function mergeOutputOptions(
  config: GenericConfigObject,
  overrides: GenericConfigObject,
): OutputOptions {
  // deno-lint-ignore no-explicit-any
  const getOption = (name: string): any => overrides[name] ?? config[name];

  const outputOptions: CompleteOutputOptions<keyof OutputOptions> = {
    amd: getObjectOption(config, overrides, "amd"),
    assetFileNames: getOption("assetFileNames"),
    banner: getOption("banner"),
    chunkFileNames: getOption("chunkFileNames"),
    compact: getOption("compact"),
    dir: getOption("dir"),
    dynamicImportFunction: getOption("dynamicImportFunction"),
    entryFileNames: getOption("entryFileNames"),
    esModule: getOption("esModule"),
    exports: getOption("exports"),
    extend: getOption("extend"),
    externalLiveBindings: getOption("externalLiveBindings"),
    file: getOption("file"),
    footer: getOption("footer"),
    format: getOption("format"),
    freeze: getOption("freeze"),
    globals: getOption("globals"),
    hoistTransitiveImports: getOption("hoistTransitiveImports"),
    indent: getOption("indent"),
    inlineDynamicImports: getOption("inlineDynamicImports"),
    interop: getOption("interop"),
    intro: getOption("intro"),
    manualChunks: getOption("manualChunks"),
    minifyInternalExports: getOption("minifyInternalExports"),
    name: getOption("name"),
    namespaceToStringTag: getOption("namespaceToStringTag"),
    noConflict: getOption("noConflict"),
    outro: getOption("outro"),
    paths: getOption("paths"),
    plugins: ensureArray(config.plugins) as Plugin[],
    preferConst: getOption("preferConst"),
    preserveModules: getOption("preserveModules"),
    preserveModulesRoot: getOption("preserveModulesRoot"),
    sourcemap: getOption("sourcemap"),
    sourcemapExcludeSources: getOption("sourcemapExcludeSources"),
    sourcemapFile: getOption("sourcemapFile"),
    sourcemapPathTransform: getOption("sourcemapPathTransform"),
    strict: getOption("strict"),
    systemNullSetters: getOption("systemNullSetters"),
  };

  return outputOptions;
}
