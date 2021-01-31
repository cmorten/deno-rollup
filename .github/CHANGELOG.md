# ChangeLog

## [2.38.2+0.8.0] - 31-01-2021

- feat: add `html`, `image`, `json` and `yaml` plugins.
- docs: add examples for using plugins
- fix: handling of file URLs

## [2.38.1+0.7.4] - 30-01-2021

- fix: handle deno resolver plugin errors correctly

## [2.38.0+0.7.3] - 26-01-2021

- fix: handle parsing of absolute ids
- fix: --no-noConflict cli flag

## [2.38.0+0.7.2] - 26-01-2021

- fix: remove double resolving of source url from importer (#14)

## [2.38.0+0.7.1] - 26-01-2021

- [#11] Support input subdirectories (#13) 
- [#10] Add `bundle.close()` to examples (#12)

## [2.38.0+0.7.0] - 24-01-2021

- [#8] Support URL sources in sourcemaps (#9)

## [2.38.0+0.6.1] - 24-01-2021

- [#5] Make example work remotely (#7)

## [2.38.0+0.6.0] - 23-01-2021

- feat: extend cli option support (#3)
- test: add rollup function tests (#2)

## [2.37.1+0.5.1] - 20-01-2021

- feat: perf improvements

`Deno.emit(...)` appears to a bottleneck somewhere when resolving remote modules resulting in very long compilation time. Retrieving the module manually and passing as a source appears far more performant at the moment.

## [2.37.1+0.5.0] - 20-01-2021

- fix: Deno.transpileOnly is being replaced by Deno.emit (#1)

## [2.36.2+0.4.1] - 17-01-2021

- fix: id resolution for absolute paths from url importers

## [2.36.2+0.4.0] - 17-01-2021

- Initial port of Rollup CLI `--watch` flag.

## [2.36.2+0.3.0] - 16-01-2021

- Initial port of Rollup `watch` method.

## [2.36.1+0.2.0] - 14-01-2021

- Initial port of Rollup CLI for Deno.

## [2.36.1+0.1.0] - 10-01-2021

- Initial port of Rollup for Deno, providing the `rollup` method.
