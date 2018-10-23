import { BASE } from './rollup.base';
import { uglify } from "rollup-plugin-uglify";

BASE.plugins.push(uglify());

export default BASE;
