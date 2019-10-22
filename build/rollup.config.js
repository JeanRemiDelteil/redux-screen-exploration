import createDefaultConfig from '@open-wc/building-rollup/modern-and-legacy-config';
import createModernConfig from '@open-wc/building-rollup/modern-config';
import commonjs from 'rollup-plugin-commonjs';
import rimraf from 'rimraf';
import runCmd from './plugin/rollup-plugin-run-command';
import {terser} from 'rollup-plugin-terser';
import jsonPlugin from 'rollup-plugin-json';
import virtualModule from './plugin/rollup-plugin-virtual-processed';
import copy from 'rollup-plugin-copy';
import visualizer from 'rollup-plugin-visualizer';
import {patchJSONs} from './plugin/loader-json-config';

async function getRollUpConfig() {
	const noLegacyBuild = process.env['noLegacyBuild'] || false;
	const serve = process.env['serve'] || false;
	const target = process.env['target'] || 'dev';
	const production = !process.env['ROLLUP_WATCH'];
	
	/**
	 * @type {BuildConfig}
	 */
	const config = {
		copy: [],
		patchJson: [],
		sourceMap: true,
		outputFolder: 'build/src/dev',
		...await import(`./config/${target}_config.js`),
	};
	const jsonPatched = await patchJSONs(config.patchJson || {});
	
	const generateSourceMap = config.sourceMap === undefined ? true : config.sourceMap;
	
	
	const rollUpConfigs = noLegacyBuild
		? [
			createModernConfig({
				input: './src/index.html',
				outputDir: `./${config.outputFolder}`,
			}),
		]
		: createDefaultConfig({
			input: './src/index.html',
			outputDir: `./${config.outputFolder}`,
		});
	
	// Pre build Clean up of the output folder
	await new Promise(res => rimraf(`./${config.outputFolder}/**`, res));
	
	return rollUpConfigs.map((rollUpConfig, index) => {
		
		const modernBuild = noLegacyBuild
			? index === 0
			: index === 1;
		
		return {
			...rollUpConfig,
			
			output: {
				...rollUpConfig.output,
				sourcemap: generateSourceMap,
			},
			
			'plugins': [
				// Import config from build config
				virtualModule(jsonPatched),
				
				// Resolve commonJS modules
				commonjs(),
				...rollUpConfig.plugins.filter(plugin => !/^terser$/.test(plugin.name)),
				
				
				jsonPlugin({
					exclude: ['node_modules/**'],
					preferConst: true,
				}),
				
				// Only copy files for first build
				modernBuild && copy({
					targets: [
						{
							src: [
								...config.copy,
							],
							dest: `./${config.outputFolder}`,
						},
					],
					copyOnce: true,
				}),
				
				// Minification
				production && terser({
					sourcemap: generateSourceMap,
				}),
				modernBuild && visualizer({
					template: 'treemap',
					bundlesRelative: true,
				}),
				
				serve
				&& index === rollUpConfigs.length - 1
				&& runCmd({
					cmd: `cd ./${config.outputFolder} && superstatic --port 5000 --host localhost`,
					runOnce: true,
				}),
			],
			
			'onwarn'(warning, rollupWarn) {
				// Shush CIRCULAR_DEPENDENCY for node_modules only
				if (warning.code === 'CIRCULAR_DEPENDENCY' && /^node_modules[\\/]/.test(warning['importer'])) return;
				
				rollupWarn(warning);
			},
		};
	});
}


// noinspection JSUnusedGlobalSymbols
export default getRollUpConfig();
