export interface GenericConfigObject {
  [key: string]: unknown;
}

export interface CommandConfigObject extends GenericConfigObject {
  external: (string | RegExp)[];
  globals: { [id: string]: string } | undefined;
}
