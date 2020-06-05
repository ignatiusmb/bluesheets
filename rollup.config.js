import babel from '@rollup/plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const input = 'src/index.js';
const banner = `/*! Aqua v${pkg.version} by @ignatiusmb - https://mauss.dev
 *  Copyright (c) ${new Date().getFullYear()} Ignatius Bagus
 *  MIT Licensed -> github.com/ignatiusmb/aqua
 *  ${pkg.homepage}
 */`;

export default [
	/* UMD Builds */
	{
		input,
		plugins: [
			babel({
				babelHelpers: 'bundled',
			}),
			cleanup({
				sourcemap: true,
			}),
			commonjs(),
			json(),
			resolve({
				browser: true,
			}),
		],
		output: {
			name: 'Aqua',
			file: 'lib/aqua.js',
			banner,
			format: 'umd',
			indent: false,
		},
	},
	{
		input,
		plugins: [
			babel({
				babelHelpers: 'bundled',
			}),
			commonjs(),
			json(),
			resolve({
				browser: true,
			}),
			terser({
				output: {
					preamble: banner,
				},
			}),
		],
		output: {
			name: 'Aqua',
			file: 'lib/aqua.min.js',
			format: 'umd',
			indent: false,
		},
	},
	/* ES6 Builds - esm + min */
	{
		input,
		plugins: [
			cleanup({
				sourcemap: true,
			}),
			commonjs(),
			json(),
			resolve(),
		],
		output: {
			name: 'Aqua',
			file: 'lib/aqua.esm.js',
			banner,
			format: 'esm',
			indent: false,
		},
	},
	{
		input,
		plugins: [
			commonjs(),
			json(),
			resolve(),
			terser({
				output: {
					preamble: banner,
				},
			}),
		],
		output: {
			name: 'Aqua',
			file: 'lib/aqua.esm.min.js',
			format: 'esm',
			indent: false,
		},
	},
];
