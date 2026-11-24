import { BASE } from './rollup.base';
import terser from "@rollup/plugin-terser";

BASE.plugins.push(terser({
    format: {
         comments: "all"
    }
}));
BASE.output.file = 'dist/data-flow.min.js';

export default BASE;
