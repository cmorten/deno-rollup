// deno-lint-ignore-file no-explicit-any

import { assert } from "./deps.ts";

// TODO: we should be comparing the full set of properties.

export function compareError(actual: any, expected: any) {
  assert.strictEqual(actual.code, expected.code);
}
