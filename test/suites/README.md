# Suites

These test suites are derived from the
[rollup test directory](https://github.com/rollup/rollup/tree/master/test), and
fall into two categories:

1. samples directly imported from the rollup GitHub using a require sham to
   provide compatibility with commonjs;
2. samples ported to ESM locally due to limitations in the above technique.

This is a work in progress as there are simply hundreds of rollup tests.

The aim is to provide some level of coverage and security, while accepting that
these do not guarantee complete compatibility. Where new issues / bugs arise and
there is an existing test which passes, it should be excluded from the first
category and moved to the second, with the full sample and all edge-cases
tested.
