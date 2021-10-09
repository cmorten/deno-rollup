import { myString } from "./std.ts";
import { basename } from "https://deno.land/std@0.110.0/path/mod.ts";

export async function main(): Promise<void> {
  console.log(myString);
  console.log((await import("./dyn.ts")).default);
  console.log(`Current directory: ${basename(Deno.cwd())}.`);
}

export default main;

if (import.meta.main) {
  main();
}
