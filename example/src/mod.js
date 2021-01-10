import foo from "./foo.js";

export default () => {
  console.log(foo);
  console.log(Deno.cwd());
};
