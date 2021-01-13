import { isAbsolute, relative } from "../deps.ts";

export function relativeId(id: string): string {
  if (!isAbsolute(id)) {
    return id;
  }

  return relative(Deno.cwd(), id);
}
