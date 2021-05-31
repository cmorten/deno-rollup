import type {
  MergedRollupOptions,
  OutputOptions,
  RollupBuild,
  RollupCache,
  WatcherOptions,
} from "./mod.ts";
import type { GenericConfigObject } from "../types.ts";
import { rollup } from "./rollup.ts";
import { FileWatcher } from "./fileWatcher.ts";
import { createFilter } from "./createFilter.ts";
import { getDestination } from "./getDestination.ts";
import { mergeOptions } from "../mergeOptions.ts";
import { handleError } from "../logging.ts";
import { Watcher } from "./watcher.ts";

/**
 * Task
 *
 * @private
 */
export class Task {
  cache: RollupCache = { modules: [] };
  filter: (id: string) => boolean;

  private closed: boolean;
  private fileWatcher: FileWatcher;
  private invalidated = true;
  private options: MergedRollupOptions;
  private outputFiles: string[];
  private outputs: OutputOptions[];
  private skipWrite: boolean;
  private watcher: Watcher;

  constructor(watcher: Watcher, config: GenericConfigObject) {
    this.watcher = watcher;
    this.closed = false;

    this.skipWrite = Boolean(
      config.watch && (config.watch as GenericConfigObject).skipWrite,
    );

    this.options = mergeOptions(config);
    this.outputs = this.options.output;

    this.outputFiles = this.outputs.map(getDestination).filter(
      Boolean,
    ) as string[];

    const watchOptions: WatcherOptions = this.options.watch || {};
    this.filter = createFilter(watchOptions.include, watchOptions.exclude);

    this.fileWatcher = new FileWatcher(this);
  }

  close() {
    this.closed = true;
    this.fileWatcher.close();
  }

  invalidate({ path, kind }: { path: string; kind: string }) {
    this.invalidated = true;
    this.watcher.invalidate({ path, kind });
  }

  async run(): Promise<void> {
    if (!this.invalidated) {
      return;
    }

    this.invalidated = false;

    const options = {
      ...this.options,
      cache: this.cache,
    };

    const start = Date.now();

    this.watcher.emitter.emit("event", {
      code: "BUNDLE_START",
      input: this.options.input,
      output: this.outputFiles,
    });

    let result: RollupBuild | null = null;

    try {
      result = await rollup(options);

      this.cache = result.cache!;

      if (this.closed) {
        return;
      }

      if (!this.skipWrite) {
        await Promise.all(
          this.outputs.map((output) => result!.write(output)),
        );
      }

      this.watcher.emitter.emit("event", {
        code: "BUNDLE_END",
        duration: Date.now() - start,
        input: this.options.input,
        output: this.outputFiles,
        result,
      });
    } catch (error) {
      if (!this.closed && error.id) {
        this.cache.modules = this.cache.modules.filter((module) =>
          module.id !== error.id
        );
      }

      handleError(error, true);

      this.watcher.emitter.emit("event", {
        code: "ERROR",
        error,
        result,
      });
    }
  }
}
