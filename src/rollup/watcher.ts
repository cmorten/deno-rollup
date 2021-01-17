import type {
  MergedRollupOptions,
  OutputOptions,
  RollupBuild,
  RollupCache,
  RollupWatcher,
  RollupWatchOptions,
  WatcherOptions,
} from "./mod.ts";
import type { GenericConfigObject } from "../types.ts";
import { rollup } from "./rollup.ts";
import { FileWatcher } from "./fileWatcher.ts";
import { createFilter } from "./createFilter.ts";
import { getDestination } from "./getDestination.ts";
import { mergeOptions } from "../mergeOptions.ts";
import { handleError } from "../logging.ts";

const eventsRewrites: Record<string, Record<string, string | "warn" | null>> = {
  create: {
    create: "warn",
    modify: "create",
    remove: null,
  },
  remove: {
    create: "modify",
    remove: "warn",
    modify: "warn",
  },
  modify: {
    create: "warn",
    remove: "remove",
    modify: "modify",
  },
};

export class Watcher {
  emitter: RollupWatcher;

  private buildDelay = 50;
  private buildTimeout: number | null = null;
  private invalidatedIds: Map<string, string> = new Map();
  private rerun = false;
  private running: boolean;
  private tasks: Task[];
  private clearScreen = true;

  constructor(configs: RollupWatchOptions[], emitter: RollupWatcher) {
    this.emitter = emitter;
    emitter.close = this.close.bind(this);

    this.tasks = configs.map((config) =>
      new Task(this, config as GenericConfigObject)
    );

    for (const config of configs) {
      if (config.watch && config.watch.clearScreen === false) {
        this.clearScreen = false;
      }
    }

    this.buildDelay = configs.reduce(
      (buildDelay, { watch }) =>
        watch && typeof watch.buildDelay === "number"
          ? Math.max(buildDelay, (watch as WatcherOptions).buildDelay!)
          : buildDelay,
      this.buildDelay,
    );

    this.running = true;

    setTimeout(() => this.run());
  }

  close() {
    if (this.buildTimeout) {
      clearTimeout(this.buildTimeout);
    }

    for (const task of this.tasks) {
      task.close();
    }

    this.emitter.emit("close");
    this.emitter.removeAllListeners();
  }

  invalidate(file?: { path: string; kind: string }) {
    if (file) {
      const prevEvent = this.invalidatedIds.get(file.path);
      const event = prevEvent
        ? eventsRewrites[prevEvent][file.kind]
        : file.kind;

      if (event === null) {
        this.invalidatedIds.delete(file.path);
      } else {
        this.invalidatedIds.set(file.path, event);
      }
    }

    if (this.running) {
      this.rerun = true;

      return;
    }

    if (this.buildTimeout) {
      clearTimeout(this.buildTimeout);
    }

    this.buildTimeout = setTimeout(() => {
      this.buildTimeout = null;

      for (const [id, event] of this.invalidatedIds.entries()) {
        this.emitter.emit("change", id, { event });
      }

      this.invalidatedIds.clear();
      this.emitter.emit("restart");
      this.run();
    }, this.buildDelay);
  }

  private async run() {
    this.running = true;

    if (this.clearScreen) {
      console.clear();
    }

    this.emitter.emit("event", {
      code: "START",
    });

    for (const task of this.tasks) {
      await task.run();
    }

    this.running = false;

    this.emitter.emit("event", {
      code: "END",
    });

    if (this.rerun) {
      this.rerun = false;
      this.invalidate();
    }
  }
}

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
