import { basename } from "path/mod.ts";
import { opine } from "opine";

export function main() {
  const app = opine();

  app.get("/", function (_req, res) {
    res.send(`Hello Deno! Your CWD is: '${basename(Deno.cwd())}'`);
  });

  app.listen(3000, () => console.log("server listening at http://0.0.0.0:3000"));
}

export default main;

if (import.meta.main) {
  main();
}
