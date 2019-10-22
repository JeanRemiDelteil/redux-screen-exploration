const jsonPlugin = require('rollup-plugin-json');
const resolve = require('rollup-plugin-node-resolve');
const {terser} = require('rollup-plugin-terser');
const babel = require('rollup-plugin-babel');
const customMinifyCss = require('@open-wc/building-utils/custom-minify-css');
const indexHTML = require('rollup-plugin-index-html');
const {virtualModule} = require('./plugin/rollup-plugin-virtual-processed');


/**
 *
 * @param options
 * @param options.input
 * @param options.outputDir
 * @param {boolean} options.production
 * @param {boolean} options.sourceMap
 * @param options.indexHTMLPlugin
 * @param options.jsonPatched
 *
 * @returns {{inputConfig: {}, outputConfig: {}}}
 */
module.exports = function createRollupConfig(options) {
	
	return {
		inputConfig: {
			input: options.input,
			treeshake: !!options.production,
			plugins: [
				// parse input index.html as input and feed any modules found to rollup
				indexHTML({
					...(options.indexHTMLPlugin || {}),
					polyfills: {
						...((options.indexHTMLPlugin && options.indexHTMLPlugin.polyfills) || {}),
						dynamicImport: true,
						webcomponents: true,
					},
				}),
				
				// Import config from build config
				virtualModule(options.jsonPatched),
				
				// resolve bare import specifiers
				resolve({
					extensions: ['.js', '.mjs', '.ts'],
				}),
				
				jsonPlugin({
					exclude: ['node_modules/**'],
					preferConst: true,
				}),
				
				babel({
					extensions: ['.js', '.mjs', '.ts'],
					plugins: [
						"@babel/plugin-proposal-class-properties",
						["@babel/plugin-proposal-decorators", {"decoratorsBeforeExport": true}],
						'@babel/plugin-syntax-dynamic-import',
						'@babel/plugin-syntax-import-meta',
						// rollup rewrites import.meta.url, but makes them point to the file location after bundling
						// we want the location before bundling
						'bundled-import-meta',
						
						options.production && [
							'template-html-minifier',
							{
								modules: {
									'lit-html': ['html'],
									'lit-element': ['html', {name: 'css', encapsulation: 'style'}],
								},
								htmlMinifier: {
									collapseWhitespace: true,
									removeComments: true,
									caseSensitive: true,
									minifyCSS: customMinifyCss,
								},
							},
						],
					].filter(_ => !!_),
					
					presets: [
						"@babel/preset-typescript",
						[
							'@babel/preset-env',
							{
								targets: [
									"last 2 Chrome versions",
								],
								// preset-env compiles template literals for safari 12 due to a small bug which
								// doesn't affect most use cases. for example lit-html handles it: (https://github.com/Polymer/lit-html/issues/575)
								exclude: ['@babel/plugin-transform-template-literals'],
								useBuiltIns: false,
								modules: false,
							},
						],
					],
				}),
				
				// only minify if in production
				options.production && terser({
					sourcemap: options.sourceMap,
				}),
			],
		},
		outputConfig: {
			dir: options.outputDir,
			format: 'esm',
			sourcemap: options.sourceMap,
			dynamicImportFunction: 'importShim',
		},
	};
};
