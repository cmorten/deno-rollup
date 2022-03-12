.PHONY: build ci fmt fmt-check lint test

FILES_TO_FORMAT = ./example/src ./example/rollup.build.ts ./example/rollup.config.ts ./example/rollup.watch.ts ./plugins/importmap/mod.ts ./plugins/importmap/deps.ts ./src ./test ./deps.ts ./mod.ts ./rollup.ts ./version.ts

build:
	@deno run --unstable --allow-read --allow-write --allow-net --allow-run --allow-env --reload mod.ts

ci:
	@make fmt-check
	@make lint
	@make build
	@make test

fmt:
	@deno fmt $(FILES_TO_FORMAT)

fmt-check:
	@deno fmt --check $(FILES_TO_FORMAT)

lint:
	@deno lint --unstable $(FILES_TO_FORMAT)

test:
	@deno test --allow-read --allow-write --allow-net --allow-run --allow-env --unstable ./src
	@deno test --allow-read --allow-write --allow-net --allow-run --allow-env --unstable ./plugins
