export const BASE = {
  input: 'src/index.js',
  watch: {
    include: 'src/**',
  },
  output: {
    file: 'dist/data-flow.js',
    format: 'cjs',
    intro: '!function(document, window) {',
    outro: '}(document, window);'
  },
  plugins: []
};
