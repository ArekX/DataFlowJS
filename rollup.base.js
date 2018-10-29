export const BASE = {
  input: 'src/index.js',
  watch: {
    include: 'src/**',
  },
  output: {
    file: 'dist/data-flow.js',
    format: 'cjs',
    intro: `
    /** DataFlow JS v1.0.8 by Aleksandar Panic. License: MIT **/
    !function(document, window) {
    `,
    outro: '}(document, window);'
  },
  plugins: []
};
