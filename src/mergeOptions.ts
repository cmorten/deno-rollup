/**
 * Derived from <https://github.com/rollup/rollup/blob/v2.42.3/src/utils/options/mergeOptions.ts>
 */

import type { CommandConfigObject, GenericConfigObject } from "./types.ts";
import type {
  ExternalOption,
  MergedRollupOptions,
  NormalizedGeneratedCodeOptions,
  NormalizedOutputOptions,
  NormalizedTreeshakingOptions,
  OutputOptions,
  Plugin,
  RollupCache,
  RollupWarning,
  WarningHandler,
  WarningHandlerWithDefault,
} from "../deps.ts";
import type { InputOptions } from "./rollup/mod.ts";
import { ensureArray } from "./ensureArray.ts";
import { error } from "./error.ts";

type ObjectOptionWithPresets =
  | Partial<NormalizedTreeshakingOptions>
  | Partial<NormalizedGeneratedCodeOptions>;

export const objectifyOptionWithPresets = <T extends ObjectOptionWithPresets>(
  presets: Record<string, T>,
  optionName: string,
  additionalValues: string,
) =>
  (value: unknown): Record<string, unknown> => {
    if (typeof value === "string") {
      const preset = presets[value];

      if (preset) {
        return preset;
      }

      error(
        {
          code: "INVALID_OPTION",
          message: `Invalid value ${
            value !== undefined ? `${JSON.stringify(value)} ` : ""
          }for option "${optionName}" - valid values are ${additionalValues}${(
            Object.keys(presets).join(", ")
          )}. You can also supply an object for more fine-grained control}.`,
        },
      );
    }

    return value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  };

/**
 * defaultOnWarn
 *
 * @param {any} warning
 * @private
 */
const defaultOnWarn: WarningHandler = (warning: RollupWarning) =>
  console.warn(warning.message || warning);

/**
 * warnUnknownOptions
 *
 * @param {GenericConfigObject} passedOptions
 * @param {string[]} validOptions
 * @param {string} optionType
 * @param {WarningHandler} warn
 * @param {RegExp} ignoredKeys
 * @private
 */
function warnUnknownOptions(
  passedOptions: GenericConfigObject,
  validOptions: string[],
  optionType: string,
  warn: WarningHandler,
  ignoredKeys = /$./,
): void {
  const validOptionSet = new Set(validOptions);
  const unknownOptions = Object.keys(passedOptions).filter(
    (key) => !(validOptionSet.has(key) || ignoredKeys.test(key)),
  );
  if (unknownOptions.length > 0) {
    warn({
      code: "UNKNOWN_OPTION",
      message: `Unknown ${optionType}: ${
        unknownOptions.join(", ")
      }. Allowed options: ${
        [
          ...validOptionSet,
        ]
          .sort()
          .join(", ")
      }`,
    });
  }
}

export const commandAliases: { [key: string]: string } = {
  c: "config",
  d: "dir",
  e: "external",
  f: "format",
  g: "globals",
  h: "help",
  i: "input",
  m: "sourcemap",
  n: "name",
  o: "file",
  p: "plugin",
  v: "version",
  w: "watch",
};

/**
 * mergeOptions
 *
 * @param {GenericConfigObject} config
 * @param {GenericConfigObject} rawCommandOptions
 * @returns {MergedRollupOptions}
 * @private
 */
export function mergeOptions(
  config: GenericConfigObject,
  rawCommandOptions: GenericConfigObject = { external: [], globals: undefined },
  defaultOnWarnHandler: WarningHandler = defaultOnWarn,
): MergedRollupOptions {
  const command = getCommandOptions(rawCommandOptions);

  const inputOptions = mergeInputOptions(
    config,
    command,
    defaultOnWarnHandler,
  ) as MergedRollupOptions;

  const warn = inputOptions.onwarn as WarningHandler;

  if (command.output) {
    Object.assign(command, command.output);
  }

  const outputOptionsArray = ensureArray(
    config.output,
  ) as GenericConfigObject[];

  if (outputOptionsArray.length === 0) {
    outputOptionsArray.push({});
  }

  const outputOptions = outputOptionsArray.map((singleOutputOptions) =>
    mergeOutputOptions(singleOutputOptions, command, warn)
  );

  warnUnknownOptions(
    command,
    Object.keys(inputOptions).concat(
      Object.keys(outputOptions[0]).filter((option) =>
        option !== "sourcemapPathTransform"
      ),
      Object.keys(commandAliases),
      "config",
      "environment",
      "plugin",
      "silent",
      "failAfterWarnings",
      "stdin",
      "waitForBundleInput",
    ),
    "CLI flags",
    warn,
    /^_$|output$|config/,
  );

  inputOptions.output = outputOptions;

  return inputOptions;
}

// deno-lint-ignore no-explicit-any
type ObjectValue<Base> = Base extends Record<string, any> ? Base : never;

const treeshakePresets: {
  [
    key in NonNullable<
      ObjectValue<InputOptions["treeshake"]>["preset"]
    >
  ]: NormalizedTreeshakingOptions;
} = {
  recommended: {
    annotations: true,
    correctVarValueBeforeDeclaration: false,
    moduleSideEffects: () => true,
    propertyReadSideEffects: true,
    tryCatchDeoptimization: true,
    unknownGlobalSideEffects: false,
  },
  safest: {
    annotations: true,
    correctVarValueBeforeDeclaration: true,
    moduleSideEffects: () => true,
    propertyReadSideEffects: true,
    tryCatchDeoptimization: true,
    unknownGlobalSideEffects: true,
  },
  smallest: {
    annotations: true,
    correctVarValueBeforeDeclaration: false,
    moduleSideEffects: () => false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
    unknownGlobalSideEffects: false,
  },
};

/**
 * getCommandOptions
 *
 * @param {GenericConfigObject} rawCommandOptions
 * @returns {CommandConfigObject}
 * @private
 */
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

/**
 * mergeInputOptions
 *
 * @param {GenericConfigObject} config
 * @param {CommandConfigObject} overrides
 * @returns {InputOptions}
 * @private
 */
function mergeInputOptions(
  config: GenericConfigObject,
  overrides: CommandConfigObject,
  defaultOnWarnHandler: WarningHandler,
): InputOptions {
  // deno-lint-ignore no-explicit-any
  const getOption = (name: string): any => overrides[name] ?? config[name];

  const inputOptions: CompleteInputOptions<keyof InputOptions> = {
    acorn: getOption("acorn"),
    acornInjectPlugins: config.acornInjectPlugins as
      | (() => unknown)[]
      | (() => unknown)
      | undefined,
    cache: config.cache as false | RollupCache | undefined,
    context: getOption("context"),
    experimentalCacheExpiry: getOption("experimentalCacheExpiry"),
    external: getExternal(config, overrides),
    inlineDynamicImports: getOption("inlineDynamicImports"),
    input: getOption("input") || [],
    makeAbsoluteExternalsRelative: getOption("makeAbsoluteExternalsRelative"),
    manualChunks: getOption("manualChunks"),
    maxParallelFileReads: getOption("maxParallelFileReads"),
    moduleContext: getOption("moduleContext"),
    onwarn: getOnWarn(config, defaultOnWarnHandler),
    perf: getOption("perf"),
    plugins: ensureArray(config.plugins) as Plugin[],
    preserveEntrySignatures: getOption("preserveEntrySignatures"),
    preserveModules: getOption("preserveModules"),
    preserveSymlinks: getOption("preserveSymlinks"),
    shimMissingExports: getOption("shimMissingExports"),
    strictDeprecations: getOption("strictDeprecations"),
    treeshake: getObjectOption(
      config,
      overrides,
      "treeshake",
      objectifyOptionWithPresets(
        treeshakePresets,
        "treeshake",
        "false, true, ",
      ),
    ),
    watch: getWatch(config, overrides, "watch"),
    denoResolver: getObjectOption(config, overrides, "denoResolver"),
  };

  warnUnknownOptions(
    config,
    Object.keys(inputOptions),
    "input options",
    inputOptions.onwarn as WarningHandler,
    /^output$/,
  );

  return inputOptions;
}

/**
 * getExternal
 *
 * @param {GenericConfigObject} config
 * @param {CommandConfigObject} overrides
 * @returns {ExternalOption}
 * @private
 */
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

/**
 * getOnWarn
 *
 * @param {GenericConfigObject} config
 * @param {WarningHandler} defaultOnWarnHandler
 * @returns {WarningHandler}
 * @private
 */
const getOnWarn = (
  config: GenericConfigObject,
  defaultOnWarnHandler: WarningHandler,
): WarningHandler =>
  config.onwarn
    ? (warning: RollupWarning) =>
      (config.onwarn as WarningHandlerWithDefault)(
        warning,
        defaultOnWarnHandler,
      )
    : defaultOnWarnHandler;

/**
 * getObjectOption
 *
 * @param {GenericConfigObject} config
 * @param {CommandConfigObject} overrides
 * @param {string} name
 * @returns {any}
 * @private
 */
const getObjectOption = (
  config: GenericConfigObject,
  overrides: GenericConfigObject,
  name: string,
  objectifyValue: (value: unknown) => Record<string, unknown> | undefined = (
    value,
  ) =>
    (typeof value === "object" ? value : {}) as
      | Record<string, unknown>
      | undefined,
) => {
  const commandOption = normalizeObjectOptionValue(
    overrides[name],
    objectifyValue,
  );
  const configOption = normalizeObjectOptionValue(config[name], objectifyValue);

  if (commandOption !== undefined) {
    return commandOption && { ...configOption, ...commandOption };
  }

  return configOption;
};

/**
 * getWatch
 *
 * @param {GenericConfigObject} config
 * @param {GenericConfigObject} overrides
 * @param {string} name
 * @returns {any}
 * @private
 */
const getWatch = (
  config: GenericConfigObject,
  overrides: GenericConfigObject,
  name: string,
) => config.watch !== false && getObjectOption(config, overrides, name);

/**
 * normalizeObjectOptionValue
 *
 * @param {any} optionValue
 * @returns {any}
 * @private
 */
export const normalizeObjectOptionValue = (
  optionValue: unknown,
  objectifyValue: (value: unknown) => Record<string, unknown> | undefined,
) => {
  if (!optionValue) {
    return optionValue as undefined;
  }

  if (Array.isArray(optionValue)) {
    return optionValue.reduce(
      (result, value) => value && result && { ...result, ...value },
      {},
    );
  }

  return objectifyValue(optionValue);
};

type CompleteOutputOptions<U extends keyof OutputOptions> = {
  [K in U]: OutputOptions[K];
};

const generatedCodePresets: {
  [
    key in NonNullable<
      ObjectValue<OutputOptions["generatedCode"]>["preset"]
    >
  ]: NormalizedOutputOptions["generatedCode"];
} = {
  es2015: {
    arrowFunctions: true,
    constBindings: true,
    objectShorthand: true,
    reservedNamesAsProps: true,
  },
  es5: {
    arrowFunctions: false,
    constBindings: false,
    objectShorthand: false,
    reservedNamesAsProps: true,
  },
};

/**
 * mergeOutputOptions
 *
 * @param {GenericConfigObject} config
 * @param {GenericConfigObject} overrides
 * @returns {OutputOptions}
 * @private
 */
function mergeOutputOptions(
  config: GenericConfigObject,
  overrides: GenericConfigObject,
  warn: WarningHandler,
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
    generatedCode: getObjectOption(
      config,
      overrides,
      "generatedCode",
      objectifyOptionWithPresets(
        generatedCodePresets,
        "output.generatedCode",
        "",
      ),
    ),
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
    sanitizeFileName: getOption("sanitizeFileName"),
    sourcemap: getOption("sourcemap"),
    sourcemapExcludeSources: getOption("sourcemapExcludeSources"),
    sourcemapFile: getOption("sourcemapFile"),
    sourcemapPathTransform: getOption("sourcemapPathTransform"),
    strict: getOption("strict"),
    systemNullSetters: getOption("systemNullSetters"),
    validate: getOption("validate"),
  };

  warnUnknownOptions(
    config,
    Object.keys(outputOptions),
    "output options",
    warn,
  );

  return outputOptions;
}
