/**
 * Derived from <https://github.com/rollup/rollup/blob/v2.39.0/cli/run/timings.ts>
 */

import type { SerializedTimings } from "../../deps.ts";
import { bold, underline } from "../../deps.ts";
import { logInfo } from "../logging.ts";

export function printTimings(timings: SerializedTimings) {
  Object.keys(timings).forEach((label) => {
    const appliedColor = label[0] === "#"
      ? (label[1] !== "#" ? underline : bold)
      : (text: string) => text;

    const [time, memory, total] = timings[label];
    const row = `${label}: ${time.toFixed(0)}ms, ${memory} / ${total}`;

    logInfo(appliedColor(row));
  });
}
