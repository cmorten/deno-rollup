import type {
  RollupWatcher,
  RollupWatchOptions,
  WatcherOptions,
} from "./mod.ts";
import type { GenericConfigObject } from "../types.ts";
import { Task } from "./task.ts";

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

/**
 * Watcher
 *
 * @private
 */
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
