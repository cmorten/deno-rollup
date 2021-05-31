import { handleError } from "./logging.ts";

/**
 * notImplemented
 *
 * @param {string} [msg]
 * @throws {Error}
 * @private
 */
export function notImplemented(msg?: string): never {
  const message = msg ? `Not implemented: ${msg}` : "Not implemented";
  throw handleError({ message });
}
