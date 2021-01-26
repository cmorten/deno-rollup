// deno-lint-ignore-file no-explicit-any

import { expect } from "../../test/deps.ts";
import { describe, it } from "../../test/mod.ts";
import { join, resolve, sep, toFileUrl } from "../../deps.ts";
import { denoResolver } from "./denoResolver.ts";

const relative = join("test", "fixtures", "hello.ts");
const relativeJs = join("test", "fixtures", "hello.js");
const relativeImporter = join("test", "fixtures", "entry.ts");
const relativeFromImporter = "hello.ts";
const dotSlashRelative = `.${sep}${relative}`;
const dotSlashSlashRelative = `.${sep}${sep}${relative}`;
const absolute = resolve(relative);
const fileUrl = toFileUrl(absolute).href;
const httpUrl =
  "http://raw.githubusercontent.com/cmorten/deno-rollup/main/test/fixtures/msg.txt";
const httpsUrl =
  "https://raw.githubusercontent.com/cmorten/deno-rollup/main/test/fixtures/msg.txt";
const missingExtension = join("test", "fixtures", "hello");

describe("denoResolver", () => {
  it("denoResolver: it should return an object with a name of rollup-plugin-deno-resolver", () => {
    expect(denoResolver().name).toEqual("rollup-plugin-deno-resolver");
  });

  it("denoResolver: it should return an object with a resolveId function", () => {
    expect(denoResolver().resolveId).toBeInstanceOf(Function);
  });

  it("denoResolver: it should return an object with a load function", () => {
    expect(denoResolver().load).toBeInstanceOf(Function);
  });

  describe("resolveId", () => {
    const resolveId = denoResolver().resolveId as any;

    [
      {
        description: "relative source",
        source: relative,
        importer: undefined,
        expectedId: relative,
      },
      {
        description: "dot slash relative source",
        source: dotSlashRelative,
        importer: undefined,
        expectedId: relative,
      },
      {
        description: "unnormalized relative source",
        source: dotSlashSlashRelative,
        importer: undefined,
        expectedId: relative,
      },
      {
        description: "absolute source",
        source: absolute,
        importer: undefined,
        expectedId: absolute,
      },
      {
        description: "file URL source",
        source: fileUrl,
        importer: undefined,
        expectedId: fileUrl,
      },
      {
        description: "http URL source",
        source: httpUrl,
        importer: undefined,
        expectedId: httpUrl,
      },
      {
        description: "https URL source",
        source: httpsUrl,
        importer: undefined,
        expectedId: httpsUrl,
      },
      {
        description: "source missing extension",
        source: missingExtension,
        importer: undefined,
        expectedId: `${missingExtension}.js`,
      },
      {
        description: "relative source with relative importer",
        source: relativeFromImporter,
        importer: relativeImporter,
        expectedId: relative,
      },
      {
        description: "absolute source with relative importer",
        source: absolute,
        importer: relativeImporter,
        expectedId: absolute,
      },
      {
        description: "file URL source any importer",
        source: fileUrl,
        importer: "test-importer",
        expectedId: fileUrl,
      },
      {
        description: "http URL source any importer",
        source: httpUrl,
        importer: "test-importer",
        expectedId: httpUrl,
      },
      {
        description: "https URL source any importer",
        source: httpsUrl,
        importer: "test-importer",
        expectedId: httpsUrl,
      },
      {
        description: "unsupported source any importer",
        source: "https://://",
        importer: "test-importer",
        expectedId: null,
      },
      {
        description: "not found source any importer",
        source: "~~~",
        importer: "test-importer",
        expectedId: null,
      },
    ].forEach(({ description, source, importer, expectedId }) => {
      it(`denoResolver: resolveId: ${description}`, async () => {
        expect(await resolveId(source, importer)).toEqual(expectedId);
      });
    });

    it("denoResolver: resolveId: should throw for an unsupported source with no importer", async () => {
      let thrownError;

      try {
        await resolveId("https://://", undefined);
      } catch (err) {
        thrownError = err;
      }
      expect(thrownError.message).toEqual(
        "Could not resolve entry module (https://://).",
      );
    });

    it("denoResolver: resolveId: should throw for a not found source with no importer", async () => {
      let thrownError;

      try {
        await resolveId("~~~", undefined);
      } catch (err) {
        thrownError = err;
      }
      expect(thrownError.message).toEqual(
        "Could not resolve entry module (~~~).",
      );
    });
  });

  describe("load", () => {
    const load = denoResolver().load as any;

    it("denoResolver: load: it should return null for an unsupported id", async () => {
      expect(await load("https://://", undefined)).toBeNull();
    });

    [
      {
        description: "relative javascript id",
        id: relativeJs,
        expectedCode: `const a = [];\nconsole.log("Hello Deno!");\n`,
      },
      {
        description: "relative typescript id",
        id: relative,
        expectedCode: `const a = [];\nconsole.log("Hello Deno!");\n`,
      },
      {
        description: "absolute typescript id",
        id: absolute,
        expectedCode: `const a = [];\nconsole.log("Hello Deno!");\n`,
      },
      {
        description: "file URL typescript id",
        id: fileUrl,
        expectedCode: `const a = [];\nconsole.log("Hello Deno!");\n`,
      },
      {
        description: "http URL id",
        id: httpUrl,
        expectedCode: `Hello Deno!`,
      },
      {
        description: "https URL id",
        id: httpsUrl,
        expectedCode: `Hello Deno!`,
      },
    ].forEach(({ description, id, expectedCode }) => {
      it(`denoResolver: load: ${description}`, async () => {
        expect(await load(id)).toEqual(expectedCode);
      });
    });
  });
});
