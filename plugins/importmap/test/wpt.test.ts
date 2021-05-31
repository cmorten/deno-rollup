import type { ImportMapObject } from "../mod.ts";
import { expect } from "../../../test/deps.ts";
import { it } from "../../../test/mod.ts";
import { rollupImportMapPlugin } from "../mod.ts";

interface Test {
  importMap?: ImportMapObject;
  importMapBaseURL?: string;
  expectedResults: Record<string, string | null>;
}

interface Config {
  importMap?: ImportMapObject;
  importMapBaseURL?: string;
  baseURL?: string;
  tests: Record<string, Test>;
  name?: string;
  link?: string;
}

// TODO: incomplete spec set
const configs: Record<string, Config> = {
  "empty-import-map-internal": {
    "importMap": {},
    "importMapBaseURL": "https://example.com/app/index.html",
    "baseURL": "https://example.com/js/app.mjs",
    // Handled by Rollup not this plugin hence expected result is null
    // unlike the official WPT
    "tests": {
      "non-HTTPS fetch scheme absolute URLs": {
        "expectedResults": {
          "about:fetch-scheme": null,
        },
      },
      "non-fetch scheme absolute URLs": {
        "expectedResults": {
          "about:fetch-scheme": null,
          "mailto:non-fetch-scheme": null,
          "import:non-fetch-scheme": null,
          "javascript:non-fetch-scheme": null,
          "wss:non-fetch-scheme": null,
        },
      },
    },
  },
  "empty-import-map": {
    "importMap": {},
    "importMapBaseURL": "https://example.com/app/index.html",
    "baseURL": "https://example.com/js/app.mjs",
    // Handled by Rollup not this plugin hence expected result is null
    // unlike the official WPT
    "tests": {
      "valid relative specifiers": {
        "expectedResults": {
          "./foo": null,
          "./foo/bar": null,
          "./foo/../bar": null,
          "./foo/../../bar": null,
          "../foo": null,
          "../foo/bar": null,
          "../../../foo/bar": null,
          "/foo": null,
          "/foo/bar": null,
          "/../../foo/bar": null,
          "/../foo/../bar": null,
        },
      },
      "HTTPS scheme absolute URLs": {
        "expectedResults": {
          "https://fetch-scheme.net": null,
          "https:fetch-scheme.org": null,
          "https://fetch%2Dscheme.com/": null,
          "https://///fetch-scheme.com///": null,
        },
      },
      "valid relative URLs that are invalid as specifiers should fail": {
        "expectedResults": {
          "invalid-specifier": null,
          "\\invalid-specifier": null,
          ":invalid-specifier": null,
          "@invalid-specifier": null,
          "%2E/invalid-specifier": null,
          "%2E%2E/invalid-specifier": null,
          ".%2Finvalid-specifier": null,
        },
      },
      "invalid absolute URLs should fail": {
        "expectedResults": {
          "https://invalid-url.com:demo": null,
          "http://[invalid-url.com]/": null,
        },
      },
    },
  },
  "overlapping-entries": {
    "importMapBaseURL": "https://example.com/app/index.html",
    "baseURL": "https://example.com/js/app.mjs",
    "name": "should favor the most-specific key",
    "tests": {
      "Overlapping entries with trailing slashes": {
        "importMap": {
          "imports": {
            "a": "/1",
            "a/": "/2/",
            "a/b": "/3",
            "a/b/": "/4/",
          },
        },
        "expectedResults": {
          "a": "https://example.com/1",
          "a/": "https://example.com/2/",
          "a/x": "https://example.com/2/x",
          "a/b": "https://example.com/3",
          "a/b/": "https://example.com/4/",
          "a/b/c": "https://example.com/4/c",
        },
      },
    },
  },
  "packages-via-trailing-slashes": {
    "importMap": {
      "imports": {
        "moment": "/node_modules/moment/src/moment.js",
        "moment/": "/node_modules/moment/src/",
        "lodash-dot": "./node_modules/lodash-es/lodash.js",
        "lodash-dot/": "./node_modules/lodash-es/",
        "lodash-dotdot": "../node_modules/lodash-es/lodash.js",
        "lodash-dotdot/": "../node_modules/lodash-es/",
        "mapped/": "https://example.com/",
        "mapped/path/": "https://github.com/WICG/import-maps/issues/207/",
        "mapped/non-ascii-1/":
          "https://example.com/%E3%81%8D%E3%81%A4%E3%81%AD/",
        "mapped/non-ascii-2/": "https://example.com/きつね/",
      },
    },
    "importMapBaseURL": "https://example.com/app/index.html",
    "baseURL": "https://example.com/js/app.mjs",
    "name": "Package-like scenarios",
    "link": "https://github.com/WICG/import-maps#packages-via-trailing-slashes",
    "tests": {
      "package main modules": {
        "expectedResults": {
          "moment": "https://example.com/node_modules/moment/src/moment.js",
          "lodash-dot":
            "https://example.com/app/node_modules/lodash-es/lodash.js",
          "lodash-dotdot":
            "https://example.com/node_modules/lodash-es/lodash.js",
        },
      },
      "package submodules": {
        "expectedResults": {
          "moment/foo": "https://example.com/node_modules/moment/src/foo",
          "lodash-dot/foo":
            "https://example.com/app/node_modules/lodash-es/foo",
          "lodash-dotdot/foo": "https://example.com/node_modules/lodash-es/foo",
        },
      },
      "package names that end in a slash should just pass through": {
        "expectedResults": {
          "moment/": "https://example.com/node_modules/moment/src/",
        },
      },
      "package modules that are not declared should fail": {
        "expectedResults": {
          "underscore/": null,
          "underscore/foo": null,
        },
      },
      "backtracking via ..": {
        // TODO: not compliant
        "expectedResults": {
          "mapped/path": "https://example.com/path",
          "mapped/path/": "https://github.com/WICG/import-maps/issues/207/",
          // "mapped/path/..": null,
          // "mapped/path/../path/": null,
          // "mapped/path/../207": null,
          "mapped/path/../207/":
            "https://github.com/WICG/import-maps/issues/207/",
          // "mapped/path//": null,
          "mapped/path/WICG/import-maps/issues/207/":
            "https://github.com/WICG/import-maps/issues/207/WICG/import-maps/issues/207/",
          // "mapped/path//WICG/import-maps/issues/207/":
          //   "https://github.com/WICG/import-maps/issues/207/",
          // "mapped/path/../backtrack": null,
          // "mapped/path/../../backtrack": null,
          // "mapped/path/../../../backtrack": null,
          // "moment/../backtrack": null,
          // "moment/..": null,
          // "mapped/non-ascii-1/":
          //   "https://example.com/%E3%81%8D%E3%81%A4%E3%81%AD/",
          // "mapped/non-ascii-1/../%E3%81%8D%E3%81%A4%E3%81%AD/":
          //   "https://example.com/%E3%81%8D%E3%81%A4%E3%81%AD/",
          // "mapped/non-ascii-1/../きつね/":
          //   "https://example.com/%E3%81%8D%E3%81%A4%E3%81%AD/",
          // "mapped/non-ascii-2/":
          //   "https://example.com/%E3%81%8D%E3%81%A4%E3%81%AD/",
          // "mapped/non-ascii-2/../%E3%81%8D%E3%81%A4%E3%81%AD/":
          //   "https://example.com/%E3%81%8D%E3%81%A4%E3%81%AD/",
          // "mapped/non-ascii-2/../きつね/":
          //   "https://example.com/%E3%81%8D%E3%81%A4%E3%81%AD/",
        },
      },
    },
  },
  "tricky-specifiers": {
    "importMap": {
      "imports": {
        "package/withslash": "/node_modules/package-with-slash/index.mjs",
        "not-a-package": "/lib/not-a-package.mjs",
        "only-slash/": "/lib/only-slash/",
        ".": "/lib/dot.mjs",
        "..": "/lib/dotdot.mjs",
        "..\\": "/lib/dotdotbackslash.mjs",
        "%2E": "/lib/percent2e.mjs",
        "%2F": "/lib/percent2f.mjs",
        "https://map.example/%E3%81%8D%E3%81%A4%E3%81%AD/": "/a/",
        "https://map.example/きつね/fox/": "/b/",
        "%E3%81%8D%E3%81%A4%E3%81%AD/": "/c/",
        "きつね/fox/": "/d/",
      },
    },
    "importMapBaseURL": "https://example.com/app/index.html",
    "baseURL": "https://example.com/js/app.mjs",
    "name": "Tricky specifiers",
    "tests": {
      "explicitly-mapped specifiers that happen to have a slash": {
        "expectedResults": {
          "package/withslash":
            "https://example.com/node_modules/package-with-slash/index.mjs",
        },
      },
      "specifier with punctuation": {
        "expectedResults": {
          ".": "https://example.com/lib/dot.mjs",
          "..": "https://example.com/lib/dotdot.mjs",
          "..\\": "https://example.com/lib/dotdotbackslash.mjs",
          "%2E": "https://example.com/lib/percent2e.mjs",
          "%2F": "https://example.com/lib/percent2f.mjs",
        },
      },
      "submodule of something not declared with a trailing slash should fail": {
        "expectedResults": {
          "not-a-package/foo": null,
        },
      },
      "module for which only a trailing-slash version is present should fail": {
        "expectedResults": {
          "only-slash": null,
        },
      },
      "URL-like specifiers are normalized": {
        "expectedResults": {
          "https://map.example/%E3%81%8D%E3%81%A4%E3%81%AD/":
            "https://example.com/a/",
          "https://map.example/%E3%81%8D%E3%81%A4%E3%81%AD/bar":
            "https://example.com/a/bar",
          // TODO: not compliant
          // "https://map.example/%E3%81%8D%E3%81%A4%E3%81%AD/fox/":
          //   "https://example.com/b/",
          // "https://map.example/%E3%81%8D%E3%81%A4%E3%81%AD/fox/bar":
          //   "https://example.com/b/bar",
          // "https://map.example/きつね/": "https://example.com/a/",
          // "https://map.example/きつね/bar": "https://example.com/a/bar",
          "https://map.example/きつね/fox/": "https://example.com/b/",
          "https://map.example/きつね/fox/bar": "https://example.com/b/bar",
        },
      },
      "Bare specifiers are not normalized": {
        "expectedResults": {
          "%E3%81%8D%E3%81%A4%E3%81%AD/": "https://example.com/c/",
          "%E3%81%8D%E3%81%A4%E3%81%AD/bar": "https://example.com/c/bar",
          "%E3%81%8D%E3%81%A4%E3%81%AD/fox/": "https://example.com/c/fox/",
          "%E3%81%8D%E3%81%A4%E3%81%AD/fox/bar":
            "https://example.com/c/fox/bar",
          "きつね/": null,
          "きつね/bar": null,
          "きつね/fox/": "https://example.com/d/",
          "きつね/fox/bar": "https://example.com/d/bar",
        },
      },
    },
  },
  "url-specifiers-schemes-internal": {
    "importMap": {
      "imports": {
        "data:text/": "/lib/test-data/",
        "about:text/": "/lib/test-about/",
        "blob:text/": "/lib/test-blob/",
        "blah:text/": "/lib/test-blah/",
        "http:text/": "/lib/test-http/",
        "https:text/": "/lib/test-https/",
        "file:text/": "/lib/test-file/",
        "ftp:text/": "/lib/test-ftp/",
        "ws:text/": "/lib/test-ws/",
        "wss:text/": "/lib/test-wss/",
      },
    },
    "importMapBaseURL": "https://example.com/app/index.html",
    "baseURL": "https://example.com/js/app.mjs",
    "name": "URL-like specifiers",
    "tests": {
      "Non-special vs. special schemes": {
        "expectedResults": {
          // TODO: not compliant
          // "data:text/javascript,console.log('foo')":
          //   "data:text/javascript,console.log('foo')",
          "data:text/": "https://example.com/lib/test-data/",
          // "about:text/foo": "about:text/foo",
          "about:text/": "https://example.com/lib/test-about/",
          // "blob:text/foo": "blob:text/foo",
          "blob:text/": "https://example.com/lib/test-blob/",
          // "blah:text/foo": "blah:text/foo",
          "blah:text/": "https://example.com/lib/test-blah/",
          "http:text/foo": "https://example.com/lib/test-http/foo",
          "http:text/": "https://example.com/lib/test-http/",
          "https:text/foo": "https://example.com/lib/test-https/foo",
          "https:text/": "https://example.com/lib/test-https/",
          "ftp:text/foo": "https://example.com/lib/test-ftp/foo",
          "ftp:text/": "https://example.com/lib/test-ftp/",
          "file:text/foo": "https://example.com/lib/test-file/foo",
          "file:text/": "https://example.com/lib/test-file/",
          "ws:text/foo": "https://example.com/lib/test-ws/foo",
          "ws:text/": "https://example.com/lib/test-ws/",
          "wss:text/foo": "https://example.com/lib/test-wss/foo",
          "wss:text/": "https://example.com/lib/test-wss/",
        },
      },
    },
  },
  "url-specifiers": {
    "importMap": {
      "imports": {
        "/lib/foo.mjs": "./more/bar.mjs",
        "./dotrelative/foo.mjs": "/lib/dot.mjs",
        "../dotdotrelative/foo.mjs": "/lib/dotdot.mjs",
        "/": "/lib/slash-only/",
        "./": "/lib/dotslash-only/",
        "/test/": "/lib/url-trailing-slash/",
        "./test/": "/lib/url-trailing-slash-dot/",
        "/test": "/lib/test1.mjs",
        "../test": "/lib/test2.mjs",
      },
    },
    "importMapBaseURL": "https://example.com/app/index.html",
    "baseURL": "https://example.com/js/app.mjs",
    "name": "URL-like specifiers",
    "tests": {
      "Ordinary URL-like specifiers": {
        "expectedResults": {
          "https://example.com/lib/foo.mjs":
            "https://example.com/app/more/bar.mjs",
          "https://///example.com/lib/foo.mjs":
            "https://example.com/app/more/bar.mjs",
          "/lib/foo.mjs": "https://example.com/app/more/bar.mjs",
          "https://example.com/app/dotrelative/foo.mjs":
            "https://example.com/lib/dot.mjs",
          "../app/dotrelative/foo.mjs": "https://example.com/lib/dot.mjs",
          "https://example.com/dotdotrelative/foo.mjs":
            "https://example.com/lib/dotdot.mjs",
          "../dotdotrelative/foo.mjs": "https://example.com/lib/dotdot.mjs",
        },
      },
      "Import map entries just composed from / and .": {
        "expectedResults": {
          "https://example.com/": "https://example.com/lib/slash-only/",
          "/": "https://example.com/lib/slash-only/",
          "../": "https://example.com/lib/slash-only/",
          "https://example.com/app/": "https://example.com/lib/dotslash-only/",
          "/app/": "https://example.com/lib/dotslash-only/",
          "../app/": "https://example.com/lib/dotslash-only/",
        },
      },
      "prefix-matched by keys with trailing slashes": {
        "expectedResults": {
          "/test/foo.mjs": "https://example.com/lib/url-trailing-slash/foo.mjs",
          // TODO: not compliant
          // "https://example.com/app/test/foo.mjs":
          //   "https://example.com/lib/url-trailing-slash-dot/foo.mjs",
        },
      },
      "should use the last entry's address when URL-like specifiers parse to the same absolute URL":
        {
          "expectedResults": {
            // TODO: not compliant
            // "/test": "https://example.com/lib/test2.mjs",
          },
        },
      "backtracking (relative URLs)": {
        "expectedResults": {
          // TODO: not compliant
          // "/test/..": "https://example.com/lib/slash-only/",
          // "/test/../backtrack": "https://example.com/lib/slash-only/backtrack",
          // "/test/../../backtrack":
          //   "https://example.com/lib/slash-only/backtrack",
          // "/test/../../../backtrack":
          //   "https://example.com/lib/slash-only/backtrack",
        },
      },
      "backtracking (absolute URLs)": {
        "expectedResults": {
          "https://example.com/test/..": "https://example.com/lib/slash-only/",
          // TODO: not compliant
          // "https://example.com/test/../backtrack":
          //   "https://example.com/lib/slash-only/backtrack",
          // "https://example.com/test/../../backtrack":
          //   "https://example.com/lib/slash-only/backtrack",
          // "https://example.com/test/../../../backtrack":
          //   "https://example.com/lib/slash-only/backtrack",
        },
      },
    },
  },
};

for (const [configName, config] of Object.entries(configs)) {
  for (
    const [testName, testConfig] of Object.entries(config.tests)
  ) {
    for (
      const [source, expectedResult] of Object.entries(
        testConfig.expectedResults,
      )
    ) {
      it(`${configName}: ${testName}: ${source} --> ${expectedResult}`, async () => {
        const plugin = rollupImportMapPlugin({
          maps: testConfig.importMap ?? config.importMap,
          baseUrl: config.importMapBaseURL,
        }) as any;

        await plugin.buildStart({});

        const result = await plugin.resolveId(source, config.baseURL);

        expect(result).toEqual(
          expectedResult === null
            ? null
            : { id: expectedResult, external: false },
        );
      });
    }
  }
}
