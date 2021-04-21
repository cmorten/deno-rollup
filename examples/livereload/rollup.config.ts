import serve from 'https://deno.land/x/drollup_plugin_serve@1.1.0+0.1.3/mod.ts'
import live from 'https://deno.land/x/drollup_plugin_livereload@0.1.0/mod.ts'

export default {
  input: 'src/entry.ts',
  output: {
    file: 'src/dest.js',
    format: 'cjs',
  },
  plugins: [
    serve({ contentBase: 'src', port: Math.round(Math.random() * 10000) + 40000 }),
    live(['src']),
  ],
}