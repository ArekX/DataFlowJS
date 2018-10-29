import { BASE } from './rollup.base';
import { uglify } from "rollup-plugin-uglify";

BASE.plugins.push(uglify({
    output: {
         comments: "all"
    }
}));
BASE.output.file = 'dist/data-flow.min.js';

export default BASE;
