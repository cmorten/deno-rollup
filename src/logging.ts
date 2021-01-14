import type { RollupError } from "./rollup/mod.ts";
import { bold, cyan, dim, red } from "../deps.ts";
import { relativeId } from "./relativeId.ts";

// Log to stderr to keep rollup main.js > bundle.js from breaking
export const logInfo = console.error.bind(console);
export const logError = console.error.bind(console);
export const logOutput = console.log.bind(console);

export function handleError(err: RollupError): never {
  let message = err.message || err;

  if (err.name) {
    message = `${err.name}: ${message}`;
  }

  logError(bold(red(`[!] ${bold(message.toString())}`)));

  if (err.url) {
    logError(cyan(err.url));
  }

  if (err.loc) {
    logError(
      `${
        relativeId((err.loc.file || err.id)!)
      } (${err.loc.line}:${err.loc.column})`,
    );
  } else if (err.id) {
    logError(relativeId(err.id));
  }

  if (err.frame) {
    logError(dim(err.frame));
  }

  if (err.stack) {
    logError(dim(err.stack));
  }

  logError("");

  Deno.exit(1);
}
