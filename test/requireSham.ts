// deno-lint-ignore-file no-explicit-any

import {
  acorn,
  assert,
  createRequire,
  magicString,
  posixPath,
  sourceMap,
  url,
} from "./deps.ts";
import { extname } from "../deps.ts";
import { ensureUrl } from "../src/rollup-plugin-deno-resolver/ensureUrl.ts";
import * as optionList from "./optionList.ts";

function assertIncludes(actual: any, expected: any) {
  try {
    assert.ok(
      actual.includes(expected),
      `${JSON.stringify(actual)}\nincludes\n${JSON.stringify(expected)}`,
    );
  } catch (err) {
    err.actual = actual;
    err.expected = expected;

    throw err;
  }
}

function withoutExt(path: string) {
  return path.substr(0, path.length - extname(path).length);
}

const _require = createRequire(import.meta.url);

/**
 * A minimal and limited sham around Deno's require
 * polyfill, designed around providing capabilities
 * for rollup's tests, and not as a production ready
 * require polyfill.
 * 
 * @param {string} path the import path
 */
export function requireSham(path: string): any {
  if (path === "assert") {
    return assert;
  } else if (path === "path") {
    return new Proxy(posixPath, {
      get: (target, prop, receiver) => {
        const value = Reflect.get(target, prop, receiver);

        if ((["join", "resolve"] as any[]).includes(prop)) {
          return function (...args: any[]) {
            const originalOut = value(...args);
            const outUrl = ensureUrl(originalOut);

            return outUrl ?? originalOut;
          };
        } else if (prop === "isAbsolute") {
          return function (arg: any) {
            const originalOut = value(arg);
            const outUrl = ensureUrl(arg);

            if (outUrl) {
              return true;
            }

            return originalOut;
          };
        }

        return value;
      },
    });
  } else if (path === "magic-string") {
    return magicString;
  } else if (path === "url") {
    return url;
  } else if (path === "source-map") {
    return sourceMap;
  } else if (path === "acorn") {
    return acorn;
  } else if (withoutExt(path) === "../../../utils") {
    return {
      assertIncludes,
    };
  } else if (withoutExt(path) === "../../../misc/optionList") {
    return optionList;
  }

  return _require(path);
}
