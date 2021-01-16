import { Task } from "./watcher.ts";

export class FileWatcher {
  private task: Task;
  private closed = false;

  constructor(task: Task) {
    this.task = task;
    this.createWatcher();
  }

  close() {
    this.closed = true;
  }

  private async createWatcher() {
    const cwd = Deno.cwd();
    const watcher = Deno.watchFs([cwd]);

    const handleChange = ({ path, kind }: { path: string; kind: string }) => {
      this.task.invalidate({ path, kind });
    };

    for await (const { kind, paths } of watcher) {
      if (this.closed) {
        break;
      } else if (["any", "access"].includes(kind)) {
        continue;
      }

      for (const path of paths) {
        if (this.task.filter(path)) {
          handleChange({ path, kind });
        }
      }
    }
  }
}
