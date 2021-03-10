import "https://unpkg.com/source-map@0.7.3/dist/source-map.js";
import "https://unpkg.com/terser@5.3.1/dist/bundle.min.js";

export const transform = async (code, options) => {
  const result = await self.Terser.minify(code, options);

  return {
    result,
    nameCache: options.nameCache,
  };
};
