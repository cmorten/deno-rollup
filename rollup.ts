// @deno-types="https://unpkg.com/rollup@2.36.1/dist/rollup.d.ts"
import {
  rollup,
  VERSION,
} from "https://unpkg.com/rollup@2.36.1/dist/es/rollup.browser.js";
import type {
  OutputChunk,
  OutputOptions,
  RollupBuild,
  RollupOptions,
  RollupOutput,
} from "https://unpkg.com/rollup@2.36.1/dist/rollup.d.ts";
import {
  dirname,
  join,
  resolve,
} from "https://deno.land/std@0.83.0/path/mod.ts";

/**
 * getTargetDir
 * 
 * @param {OutputOptions} options
 * @returns {string}
 * @private
 */
function getTargetDir(options: OutputOptions): string {
  const { dir, file } = options;

  if (dir) {
    return resolve(dir);
  } else if (file) {
    return resolve(dirname(file));
  }

  return Deno.cwd();
}

/**
 * write
 * 
 * @param {RollupBuild} this 
 * @param {OutputOptions} options 
 * @returns {Promise<RollupOutput>}
 * @private
 */
async function write(
  this: RollupBuild,
  options: OutputOptions,
): Promise<RollupOutput> {
  const rollupOutput = await this.generate(options);
  const targetDirectory = getTargetDir(options);
  await Deno.mkdir(targetDirectory, { recursive: true });

  for (const outputFile of rollupOutput.output) {
    const fullPath = join(targetDirectory, outputFile.fileName);

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
            join(targetDirectory, `${outputFile.fileName}.map`),
            JSON.stringify(outputFile.map),
          );
        }

        if (options.sourcemap !== "hidden") {
          source += `//# sourceMappingURL=${url}\n`;
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

/**
 * rollupProxy
 * 
 * @param {RollupOptions} options 
 * @returns {Promise<RollupBuild>}
 * @private
 */
async function rollupProxy(options: RollupOptions): Promise<RollupBuild> {
  const bundle = await rollup(options);

  return new Proxy(bundle, {
    get: (target, prop, receiver) => {
      const value = Reflect.get(target, prop, receiver);

      if (prop === "write") {
        return write.bind(target);
      }

      return value;
    },
  });
}

/**
 * @public
 */
export { rollup as _rollup, rollupProxy as rollup, VERSION };

/**
 * Prevent `warning: Compiled module not found` by re-exporting
 * types explicitly.
 * 
 * @public
 */
export type {
  AddonHook,
  AddonHookFunction,
  AmdOptions,
  AsyncPluginHooks,
  ChangeEvent,
  ChokidarOptions,
  CustomPluginOptions,
  DecodedSourceMapOrMissing,
  EmitAsset,
  EmitChunk,
  EmitFile,
  EmittedAsset,
  EmittedChunk,
  EmittedFile,
  ExistingDecodedSourceMap,
  ExistingRawSourceMap,
  ExternalOption,
  FilePlaceholder,
  FirstPluginHooks,
  GetInterop,
  GetManualChunk,
  GetModuleInfo,
  GlobalsOption,
  HasModuleSideEffects,
  InputOption,
  InputOptions,
  InternalModuleFormat,
  InteropType,
  IsExternal,
  IsPureModule,
  LoadHook,
  ManualChunksOption,
  MergedRollupOptions,
  MinimalPluginContext,
  ModuleFormat,
  ModuleJSON,
  ModuleParsedHook,
  ModuleSideEffectsOption,
  NormalizedAmdOptions,
  NormalizedInputOptions,
  NormalizedOutputOptions,
  NormalizedTreeshakingOptions,
  OptionsPaths,
  OutputAsset,
  OutputBundle,
  OutputBundleWithPlaceholders,
  OutputChunk,
  OutputOptions,
  OutputPlugin,
  ParallelPluginHooks,
  Plugin,
  PluginCache,
  PluginContext,
  PluginContextMeta,
  PluginHooks,
  PluginImpl,
  PluginValueHooks,
  PreRenderedAsset,
  PreRenderedChunk,
  PreserveEntrySignaturesOption,
  PureModulesOption,
  RenderChunkHook,
  RenderedChunk,
  RenderedModule,
  ResolveAssetUrlHook,
  ResolvedId,
  ResolvedIdMap,
  ResolveDynamicImportHook,
  ResolveFileUrlHook,
  ResolveIdHook,
  ResolveIdResult,
  ResolveImportMetaHook,
  RollupBuild,
  RollupCache,
  RollupError,
  RollupLogProps,
  RollupOptions,
  RollupOutput,
  RollupWarning,
  RollupWatcher,
  RollupWatcherEvent,
  RollupWatchOptions,
  SequentialPluginHooks,
  SerializablePluginCache,
  SerializedTimings,
  SourceDescription,
  SourceMap,
  SourceMapInput,
  SourcemapPathTransformOption,
  SourceMapSegment,
  SyncPluginHooks,
  TransformHook,
  TransformModuleJSON,
  TransformPluginContext,
  TransformResult,
  TreeshakingOptions,
  WarningHandler,
  WarningHandlerWithDefault,
  WatchChangeHook,
  WatcherOptions,
} from "https://unpkg.com/rollup@2.36.1/dist/rollup.d.ts";
