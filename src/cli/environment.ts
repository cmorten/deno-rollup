import type { IParseResult } from "../../deps.ts";

export function environment(program: IParseResult) {
  if (program.options.environment) {
    for (const pair of program.options.environment) {
      const [key, ...value] = pair.split(":");

      if (value.length) {
        Deno.env.set(key, value.join(":"));
      } else {
        Deno.env.set(key, "true");
      }
    }
  }
}
