import { FilterPattern, Plugin } from "../../mod.ts";

export interface RollupImageOptions {
  /**
   * All image files will be parsed by default,
   * but you can also specifically include files
   */
  include?: FilterPattern;
  /**
   * All image files will be parsed by default,
   * but you can also specifically exclude files
   */
  exclude?: FilterPattern;
  /**
   * If true, instructs the plugin to generate an
   * ES Module which exports a DOM Image which can
   * be used with a browser's DOM. Otherwise, the
   * plugin generates an ES Module which exports a
   * default const containing the Base64
   * representation of the image.
   * @default false
   */
  dom?: boolean;
}

/**
 * Imports JPG, PNG, GIF, SVG, and WebP files.
 */
export default function image(options?: RollupImageOptions): Plugin;
