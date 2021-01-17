// deno-lint-ignore-file ban-types
import type {
  ExternalOption,
  InputOption,
  ManualChunksOption,
  OutputOptions,
  Plugin,
  PreserveEntrySignaturesOption,
  RollupCache,
  RollupWatcherEvent,
  TreeshakingOptions,
  WarningHandlerWithDefault,
} from "../../deps.ts";
import { VERSION } from "../../deps.ts";
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
  RollupOptions,
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
export interface InputOptions {
  acorn?: Object;
  acornInjectPlugins?: Function | Function[];
  cache?: false | RollupCache;
  context?: string;
  experimentalCacheExpiry?: number;
  external?: ExternalOption;
  /** @deprecated Use the "inlineDynamicImports" output option instead. */
  inlineDynamicImports?: boolean;
  input?: InputOption;
  /** @deprecated Use the "manualChunks" output option instead. */
  manualChunks?: ManualChunksOption;
  moduleContext?: ((id: string) => string | null | undefined) | {
    [id: string]: string;
  };
  onwarn?: WarningHandlerWithDefault;
  perf?: boolean;
  plugins?: Plugin[];
  preserveEntrySignatures?: PreserveEntrySignaturesOption;
  /** @deprecated Use the "preserveModules" output option instead. */
  preserveModules?: boolean;
  preserveSymlinks?: boolean;
  shimMissingExports?: boolean;
  strictDeprecations?: boolean;
  treeshake?: boolean | TreeshakingOptions;
  watch?: WatcherOptions | false;
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
