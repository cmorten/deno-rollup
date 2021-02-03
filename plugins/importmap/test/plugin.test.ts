import { expect } from "../../../test/deps.ts";
import { describe, it } from "../../../test/mod.ts";
import { __dirname } from "./dirname.ts";
import { dirname, join } from "../../../deps.ts";
import { rollup } from "../../../mod.ts";
import { rollupImportMapPlugin } from "../mod.ts";

const simple = join(__dirname, "./fixtures/modules/simple/main.js");
const basic = join(__dirname, "./fixtures/modules/basic/main.js");
const file = join(__dirname, "./fixtures/modules/file/main.js");
const map = join(__dirname, "./fixtures/simple.map.json");
const err = join(__dirname, "./fixtures/faulty.map.json");

const clean = (str: string) => str.split("\r").join("");

const assertMatchSnapshot = (code: string, snapshotName: string) => {
  const snapshot = Deno.readTextFileSync(
    join(__dirname, `./snapshots/${snapshotName}.txt`),
  );
  expect(clean(code)).toEqual(clean(snapshot));
};

describe("plugin", () => {
  it("plugin: target is refered to in external option - should reject process", async () => {
    const options = {
      input: simple,
      external: ["foo"],
      plugins: [rollupImportMapPlugin({
        maps: {
          imports: {
            "foo": "http://just.a.test.com",
          },
        },
        external: true,
        baseUrl: __dirname,
      })],
    };

    try {
      await rollup(options);
      throw new Error("should have thrown an error");
    } catch (err) {
      expect(err.message).toEqual(
        "import specifier must not be present in the Rollup external config",
      );
    }
  });
});

it("plugin: external true: basic module: should replace lit-element with CDN URL", async () => {
  const options = {
    input: basic,
    onwarn: () => {},
    plugins: [rollupImportMapPlugin({
      maps: {
        imports: {
          "lit-element": "https://unpkg.com/lit-element@2.4.0/lit-element.js",
        },
      },
      external: true,
      baseUrl: __dirname,
    })],
  };

  const bundle = await rollup(options);
  const { output } = await bundle.generate({});
  assertMatchSnapshot(output[0].code, "basic_example");
});

it("plugin: external true: simple module: should replace lit-element with CDN URL", async () => {
  const options = {
    input: simple,
    onwarn: () => {},
    plugins: [rollupImportMapPlugin({
      maps: {
        imports: {
          "lit-element": "https://unpkg.com/lit-element@2.4.0/lit-element.js",
        },
      },
      external: true,
      baseUrl: __dirname,
    })],
  };

  const bundle = await rollup(options);
  const { output } = await bundle.generate({});
  assertMatchSnapshot(output[0].code, "simple_example");
});

it("plugin: external true: import map maps non bare imports: should replace import statement with CDN URL", async () => {
  const options = {
    input: simple,
    onwarn: () => {},
    plugins: [rollupImportMapPlugin({
      maps: {
        imports: {
          "lit-element": "https://unpkg.com/lit-element@2.4.0/lit-element.js",
          "./utils/dom.js": "https://deno.land/fake/dom.js",
        },
      },
      external: true,
      baseUrl: __dirname,
    })],
  };

  const bundle = await rollup(options);
  const { output } = await bundle.generate({});
  assertMatchSnapshot(output[0].code, "non_bare_imports");
});

it("plugin: external true: import map maps address to a relative path: should replace import statement with relative path", async () => {
  const options = {
    input: simple,
    onwarn: () => {},
    plugins: [rollupImportMapPlugin({
      maps: {
        imports: {
          "lit-element": "./lit-element/v2",
        },
      },
      external: true,
      baseUrl: __dirname,
    })],
  };

  const bundle = await rollup(options);
  const { output } = await bundle.generate({});
  assertMatchSnapshot(output[0].code, "non_bare_imports_relative_path");
});

it("plugin: export true: import specifier is a interior package path: should replace with CDN URL", async () => {
  const options = {
    input: file,
    onwarn: () => {},
    plugins: [rollupImportMapPlugin({
      maps: {
        imports: {
          "lit-element": "https://unpkg.com/lit-element@2.4.0/lit-element.js",
          "lit-html/lit-html": "https://unpkg.com/lit-html@1.3.0/lit-html.js",
          "lit-html": "https://unpkg.com/lit-html@0.14.0/lit-html.js",
        },
      },
      external: true,
      baseUrl: __dirname,
    })],
  };

  const bundle = await rollup(options);
  const { output } = await bundle.generate({});
  assertMatchSnapshot(output[0].code, "interior_package_path");
});

it("plugin: import map maps address to a bare importer: should throw", async () => {
  const options = {
    input: simple,
    onwarn: () => {},
    plugins: [rollupImportMapPlugin({
      maps: {
        imports: {
          "lit-element": "lit-element/v2",
        },
      },
      external: true,
      baseUrl: __dirname,
    })],
  };

  try {
    await rollup(options);
    throw new Error("should have thrown an error");
  } catch (err) {
    expect(err.message).toEqual(
      `import specifier "lit-element" can not be mapped to a bare import statement "lit-element/v2".`,
    );
  }
});

it("plugin: external true: array of import map maps: should replace import statements with CDN URLs", async () => {
  const options = {
    input: simple,
    onwarn: () => {},
    plugins: [rollupImportMapPlugin({
      maps: [{
        imports: {
          "lit-element": "https://unpkg.com/lit-element@2.4.0/lit-element.js",
        },
      }, {
        imports: {
          "./utils/dom.js": "https://deno.land/fake/dom.js",
        },
      }],
      external: true,
      baseUrl: __dirname,
    })],
  };

  const bundle = await rollup(options);
  const { output } = await bundle.generate({});
  assertMatchSnapshot(output[0].code, "non_bare_imports");
});

it("plugin: external true: input is a filepath to a map file: should load map and replace import statements with CDN URLs", async () => {
  const options = {
    input: simple,
    onwarn: () => {},
    plugins: [
      rollupImportMapPlugin({ maps: map, external: true, baseUrl: __dirname }),
    ],
  };

  const bundle = await rollup(options);
  const { output } = await bundle.generate({});
  assertMatchSnapshot(output[0].code, "simple_example");
});

it("plugin: external true: input is a filepath to a map file and an inline map - should load map and replace import statements with CDN URLs", async () => {
  const options = {
    input: simple,
    onwarn: () => {},
    plugins: [rollupImportMapPlugin({
      maps: [
        map,
        {
          imports: {
            "./utils/dom.js": "https://deno.land/fake/dom.js",
          },
        },
      ],
      external: true,
      baseUrl: __dirname,
    })],
  };

  const bundle = await rollup(options);
  const { output } = await bundle.generate({});
  assertMatchSnapshot(output[0].code, "non_bare_imports");
});

it("plugin: input is a filepath to a non existing map file: should throw", async () => {
  const options = {
    input: simple,
    onwarn: () => {},
    plugins: [rollupImportMapPlugin({ maps: "./foo.map.json" })],
  };

  try {
    await rollup(options);
    throw new Error("should have thrown an error");
  } catch (err) {
    expect(err.message).toMatch(`(os error 2)`);
  }
});

it("plugin: input is a filepath to a faulty map file: should throw", async () => {
  const options = {
    input: simple,
    onwarn: () => {},
    plugins: [rollupImportMapPlugin({ maps: err })],
  };

  try {
    await rollup(options);
    throw new Error("should have thrown an error");
  } catch (err) {
    expect(err.message).toMatch(`Unexpected end of JSON input`);
  }
});
