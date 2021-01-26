import { bold, cyan, dim, ms, red } from "../deps.ts";
import { watch } from "../mod.ts";
import options from "./rollup.config.ts";

const watcher = await watch(options);

watcher.on("event", (event) => {
  if (event.code === "ERROR") {
    console.error(bold(red(event.code)));
  } else {
    let info = bold(cyan(event.code));

    if ("duration" in event && event.duration) {
      info += `: ${bold(dim(`completed in ${ms(event.duration)}`))}`;
    }

    console.info(info);
  }

  if (event.code === "BUNDLE_END") {
    event.result.close();
  }
});
