# ChangeLog

## [2.52.7+0.19.1] - 02-07-2021

- chore: upgrade postcss plugin deps

## [2.52.7+0.19.0] - 02-07-2021

- [FEAT]: Adds a new rollup plugin called string derived from <https://github.com/TrySound/rollup-plugin-string> (#37)
- [#39] Upgraded to std@0.100.0 to work with deno 1.11.4 (#40) 
- chore: upgrade deps
- [#41] Updated the terser dependencies to 5.7.1 (#42) 
- feat: refactor terser example
- feat: add esbuild plugin
- fix: try full esm.sh urls

## [2.50.5+0.18.2] - 31-05-2021

- [NO-ISSUE] Fixes some bugs regarding css and svelte plugins (#36)

## [2.50.5+0.18.1] - 31-05-2021

- test: add subset of [Web Platform Tests](https://github.com/web-platform-tests/wpt/tree/master/import-maps/data-driven/resources) for importmap plugin with some compatibility improvements

## [2.50.5+0.18.0] - 31-05-2021

- chore: support Deno 1.10.2 and std 0.97.0
- feat: upgrade Rollup to 2.50.5

## [2.42.3+0.17.1] - 23-03-2021

- [#29] Rollup deno compiler options (#30)

## [2.42.3+0.17.0] - 22-03-2021

- [#26] Open 'rollup' to set custom Deno.CompilerOptions (#27)
- feat: support Deno 1.8.2 and std 0.91.0

## [2.41.0+0.16.1] - 10-03-2021

- fix: allow net for worker in terser plugin
- fix: race condition in terser plugin for terminating worker

## [2.41.0+0.16.0] - 10-03-2021

- feat: support Deno 1.8.1 and std 0.90.0
- feat: upgrade Rollup to 2.41.0
- feat: add terser plugin

## [2.39.1+0.15.0] - 06-03-2021

- feat: support Deno 1.8.0 and std 0.89.0
- feat: upgrade Rollup to 2.39.1

## [2.39.0+0.14.0] - 13-02-2021

- chore: upgrade std lib and rollup dependencies
- feat: add postcss plugin

## [2.38.5+0.13.0] - 12-02-2021

- feat: Add css plugin (#22)

## [2.38.5+0.12.0] - 12-02-2021

- [#19] Add svelte plugin (#21)

## [2.38.5+0.11.0] - 11-02-2021

- feat: upgrade deps
- ci: publish to nest.land registry
- docs: tidy up contribution docs

## [2.38.4+0.10.0] - 06-02-2021

- feat: add `virtual` plugin

## [2.38.4+0.9.1] - 03-02-2021

- docs: correct `external` option docs for `importmap` plugin

## [2.38.4+0.9.0] - 02-02-2021

- feat: add `importmap` plugin

## [2.38.4+0.8.0] - 31-01-2021

- feat: add `html`, `image`, `json` and `yaml` plugins
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

`Deno.emit(...)` appears to a bottleneck somewhere when resolving remote modules
resulting in very long compilation time. Retrieving the module manually and
passing as a source appears far more performant at the moment.

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
