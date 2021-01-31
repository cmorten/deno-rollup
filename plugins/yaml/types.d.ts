import { FilterPattern, Plugin, TransformHook } from "../../mod.ts";

export interface RollupYamlOptions {
  /**
   * If single, specifies that the target YAML
   * documents contain only one document in the
   * target file(s). If more than one document
   * stream exists in the target YAML file(s),
   * set documentMode: 'multi'.
   * @default 'single'
   */
  documentMode?: string;
  /**
   * All YAML files will be parsed by default,
   * but you can also specifically include files
   */
  include?: FilterPattern;
  /**
   * All YAML files will be parsed by default,
   * but you can also specifically exclude files
   */
  exclude?: FilterPattern;
  /**
   * If true, specifies that the data in the
   * target YAML file(s) contain trusted data
   * and should be loaded normally. If false,
   * data is assumed to be untrusted and will be
   * loaded using safety methods.
   * @default true
   */
  safe?: boolean;
  /**
   * A function which can optionally mutate parsed
   * YAML. The function should return the mutated
   * object, or undefined which will make no
   * changes to the parsed YAML.
   */
  transform?: TransformHook;
}

/**
 * Convert YAML files to ES6 modules
 */
export default function yaml(options?: RollupYamlOptions): Plugin;
