// deno-lint-ignore-file no-explicit-any
import { OutputAsset, OutputBundle, OutputChunk, Plugin } from "../../mod.ts";

export interface RollupHtmlOptions {
  title?: string;
  attributes?: Record<string, any>;
  fileName?: string;
  meta?: Record<string, any>[];
  publicPath?: string;
  template?: (templateOptions: RollupHtmlTemplateOptions) => string;
}

export interface RollupHtmlTemplateOptions {
  title: string;
  attributes: Record<string, any>;
  publicPath: string;
  meta: Record<string, any>[];
  bundle: OutputBundle;
  files: Record<string, (OutputChunk | OutputAsset)[]>;
}

export function makeHtmlAttributes(attributes: Record<string, string>): string;

/**
 * A Rollup plugin which creates HTML files to serve Rollup bundles.
 * @param options - Plugin options.
 * @returns Plugin instance.
 */
export default function html(options?: RollupHtmlOptions): Plugin;
