// deno-lint-ignore-file no-explicit-any

import type { OutputOptions } from "./mod.ts";
import { expect } from "../../test/deps.ts";
import { describe, it } from "../../test/mod.ts";
import { join, sep } from "../../deps.ts";
import { supportUrlSources } from "./supportUrlSources.ts";

const mockRelativeSourcePath = join(
  "test-relative-source-path",
  "test-path.js",
);
const mockHttpMalformedRelativeSourcePath =
  "http:/test-malformed-http-url/test-path.js";
const mockHttpsMalformedRelativeSourcePath =
  "https:/test-malformed-https-url/test-path.js";
const mockFileMalformedRelativeSourcePath =
  "file:/test-malformed-file-url/test-path.js";
const mockSourcemapPath = join("test-sourcemap-path", "test-path");
const mockUnnormalizedSourcemapPath =
  `test-sourcemap-path${sep}${sep}test-path`;

describe("supportUrlSources", () => {
  it("supportUrlSources: it should return an object with all properties other than sourcemapPathTransform unchanged", () => {
    const mockOptions: OutputOptions = {
      dir: "test-dir",
    };
    const result = supportUrlSources(mockOptions);

    Object.entries(mockOptions).forEach(([key, value]) => {
      expect(value).toBe((result as any)[key]);
    });
  });

  it("supportUrlSources: it should return an object with a sourcemapPathTransform method", () => {
    expect(supportUrlSources({}).sourcemapPathTransform).toBeInstanceOf(
      Function,
    );
  });

  it("supportUrlSources: when the passed options don't have a sourcemapPathTransform: and a well formed relative source path and sourcemap path are provided: it should return the relative source path unchanged", () => {
    const { sourcemapPathTransform } = supportUrlSources({});

    expect(sourcemapPathTransform!(mockRelativeSourcePath, mockSourcemapPath))
      .toEqual(mockRelativeSourcePath);
  });

  it("supportUrlSources: when the passed options don't have a sourcemapPathTransform: and a malformed relative source path http url is provided: it should return the corrected relative source path", () => {
    const { sourcemapPathTransform } = supportUrlSources({});

    expect(
      sourcemapPathTransform!(
        mockHttpMalformedRelativeSourcePath,
        mockSourcemapPath,
      ),
    )
      .toEqual(mockHttpMalformedRelativeSourcePath.replace(":/", "://"));
  });

  it("supportUrlSources: when the passed options don't have a sourcemapPathTransform: and a malformed relative source path https url is provided: it should return the corrected relative source path", () => {
    const { sourcemapPathTransform } = supportUrlSources({});

    expect(
      sourcemapPathTransform!(
        mockHttpsMalformedRelativeSourcePath,
        mockSourcemapPath,
      ),
    )
      .toEqual(mockHttpsMalformedRelativeSourcePath.replace(":/", "://"));
  });

  it("supportUrlSources: when the passed options don't have a sourcemapPathTransform: and a malformed relative source path file url is provided: it should return the corrected relative source path", () => {
    const { sourcemapPathTransform } = supportUrlSources({});

    expect(
      sourcemapPathTransform!(
        mockFileMalformedRelativeSourcePath,
        mockSourcemapPath,
      ),
    )
      .toEqual(mockFileMalformedRelativeSourcePath.replace(":/", ":///"));
  });

  it("supportUrlSources: when the passed options have a sourcemapPathTransform: and a well formed relative source path and sourcemap path are provided: it should call the passed sourcemapPathTransform with the relative source path and sourcemap path unchanged", () => {
    const mockSourcemapPathTransform = (
      relativeSourcePath: string,
      sourcemapPath: string,
    ) => {
      expect(relativeSourcePath).toEqual(mockRelativeSourcePath);
      expect(sourcemapPath).toEqual(mockSourcemapPath);

      return relativeSourcePath;
    };

    const { sourcemapPathTransform } = supportUrlSources({
      sourcemapPathTransform: mockSourcemapPathTransform,
    });

    sourcemapPathTransform!(mockRelativeSourcePath, mockSourcemapPath);
  });

  it("supportUrlSources: when the passed options have a sourcemapPathTransform: and a malformed relative source path http url is provided: it should call the passed sourcemapPathTransform with the corrected relative source path and sourcemap path", () => {
    const mockSourcemapPathTransform = (
      relativeSourcePath: string,
      sourcemapPath: string,
    ) => {
      expect(relativeSourcePath).toEqual(
        mockHttpMalformedRelativeSourcePath.replace(":/", "://"),
      );
      expect(sourcemapPath).toEqual(mockSourcemapPath);

      return relativeSourcePath;
    };

    const { sourcemapPathTransform } = supportUrlSources({
      sourcemapPathTransform: mockSourcemapPathTransform,
    });

    sourcemapPathTransform!(
      mockHttpMalformedRelativeSourcePath,
      mockSourcemapPath,
    );
  });

  it("supportUrlSources: when the passed options have a sourcemapPathTransform: and a malformed relative source path https url is provided: it should call the passed sourcemapPathTransform with the corrected relative source path and sourcemap path", () => {
    const mockSourcemapPathTransform = (
      relativeSourcePath: string,
      sourcemapPath: string,
    ) => {
      expect(relativeSourcePath).toEqual(
        mockHttpsMalformedRelativeSourcePath.replace(":/", "://"),
      );
      expect(sourcemapPath).toEqual(mockSourcemapPath);

      return relativeSourcePath;
    };

    const { sourcemapPathTransform } = supportUrlSources({
      sourcemapPathTransform: mockSourcemapPathTransform,
    });

    sourcemapPathTransform!(
      mockHttpsMalformedRelativeSourcePath,
      mockSourcemapPath,
    );
  });

  it("supportUrlSources: when the passed options have a sourcemapPathTransform: and a malformed relative source path file url is provided: it should call the passed sourcemapPathTransform with the corrected relative source path and sourcemap path", () => {
    const mockSourcemapPathTransform = (
      relativeSourcePath: string,
      sourcemapPath: string,
    ) => {
      expect(relativeSourcePath).toEqual(
        mockFileMalformedRelativeSourcePath.replace(":/", ":///"),
      );
      expect(sourcemapPath).toEqual(mockSourcemapPath);

      return relativeSourcePath;
    };

    const { sourcemapPathTransform } = supportUrlSources({
      sourcemapPathTransform: mockSourcemapPathTransform,
    });

    sourcemapPathTransform!(
      mockFileMalformedRelativeSourcePath,
      mockSourcemapPath,
    );
  });

  it("supportUrlSources: when the passed options have a sourcemapPathTransform: and an unnormalized sourcemap path is provided: it should call the passed sourcemapPathTransform with the relative source path and normalized sourcemap path", () => {
    const mockSourcemapPathTransform = (
      relativeSourcePath: string,
      sourcemapPath: string,
    ) => {
      expect(relativeSourcePath).toEqual(
        mockRelativeSourcePath,
      );
      expect(sourcemapPath).toEqual(mockSourcemapPath);

      return relativeSourcePath;
    };

    const { sourcemapPathTransform } = supportUrlSources({
      sourcemapPathTransform: mockSourcemapPathTransform,
    });

    sourcemapPathTransform!(
      mockRelativeSourcePath,
      mockUnnormalizedSourcemapPath,
    );
  });
});
