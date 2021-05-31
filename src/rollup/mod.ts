import type {
  InputOptions as _InputOptions,
  OutputOptions,
  RollupWatcherEvent,
} from "../../deps.ts";
import { VERSION } from "../../deps.ts";
import { DenoResolverOptions } from "../rollup-plugin-deno-resolver/denoResolver.ts";
import { rollup } from "./rollup.ts";
import { watch } from "./watch.ts";

/**
 * @public
 */
export { rollup, VERSION, watch };

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
  RollupOutput,
  RollupWarning,
  RollupWatcherEvent,
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
} from "../../deps.ts";

interface TypedEventEmitter<
  // deno-lint-ignore no-explicit-any
  T extends { [event: string]: (...args: any) => any },
> {
  addListener<K extends keyof T>(event: K, listener: T[K]): this;
  emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): boolean;
  eventNames(): Array<keyof T>;
  getMaxListeners(): number;
  listenerCount(type: keyof T): number;
  listeners<K extends keyof T>(event: K): Array<T[K]>;
  off<K extends keyof T>(event: K, listener: T[K]): this;
  on<K extends keyof T>(event: K, listener: T[K]): this;
  once<K extends keyof T>(event: K, listener: T[K]): this;
  prependListener<K extends keyof T>(event: K, listener: T[K]): this;
  prependOnceListener<K extends keyof T>(event: K, listener: T[K]): this;
  rawListeners<K extends keyof T>(event: K): Array<T[K]>;
  removeAllListeners<K extends keyof T>(event?: K): this;
  removeListener<K extends keyof T>(event: K, listener: T[K]): this;
  setMaxListeners(n: number): this;
}

/**
 * @public
 */
export interface RollupWatcher extends
  TypedEventEmitter<{
    change: (id: string, change: { event: string }) => void;
    close: () => void;
    event: (event: RollupWatcherEvent) => void;
    restart: () => void;
  }> {
  close(): void;
}

/**
 * @public
 */
export interface InputOptions extends _InputOptions {
  denoResolver?: DenoResolverOptions;
}

/**
 * @public
 */
export interface RollupOptions extends InputOptions {
  // This is included for compatibility with config files but ignored by rollup.rollup
  output?: OutputOptions | OutputOptions[];
}

/**
 * @public
 */
export interface WatcherOptions {
  buildDelay?: number;
  clearScreen?: boolean;
  exclude?: string | RegExp | (string | RegExp)[];
  include?: string | RegExp | (string | RegExp)[];
  skipWrite?: boolean;
}

/**
 * @public
 */
export interface RollupWatchOptions extends InputOptions {
  output?: OutputOptions | OutputOptions[];
  watch?: WatcherOptions | false;
}

/**
 * @public
 */
export type { FilterPattern } from "./createFilter.ts";
