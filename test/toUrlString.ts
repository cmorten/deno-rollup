import { coreRollupVersion } from "../version.ts";

const ROLLUP_BASE_URL =
  `https://raw.githubusercontent.com/rollup/rollup/v${coreRollupVersion}/`;

export function toUrlString(directory: string) {
  return new URL(directory, ROLLUP_BASE_URL).href;
}
