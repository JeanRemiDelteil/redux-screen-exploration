#!/usr/bin/env node

const {src, dest, series, parallel} = require('gulp');
const clean = require('gulp-clean');
const {argv} = require('yargs');
const rollup = require('rollup');
const createRollupConfig = require('./rollup.config');
const {patchJSONs} = require('./plugin/loader-json-config');
const {runCommand} = require('./plugin/run-command');


/**
 * @type {BuildConfig}
 */
let settings;
let jsonPatched;
let TARGET;

async function getSettings() {
	TARGET = argv['target'] || 'dev';
	
	try {
		settings = require(`./config/${TARGET}.config`);
	}
	catch (e) {
		console.log(`\x1b[31mERROR: "\x1b[0m\x1b[41m\x1b[30m${TARGET}\x1b[31m\x1b[0m\x1b[31m" is not a valid target build\x1b[0m`);
		
		throw e;
	}
	jsonPatched = await patchJSONs(settings.inputDir, settings.patchJson || {});
	
	console.log(`\x1b[46m\x1b[30mTarget: ${TARGET} \x1b[0m`);
}


function cleanBuildFolder() {
	return src(`./output/${settings.outputDir}`, {
		read: false,
		allowEmpty: true,
	})
		.pipe(clean());
}

async function buildBundle() {
	
	// Babel browser config is defined in package.json 
	const rollupConfig = createRollupConfig({
		input: `../${settings.inputDir}/${settings.inputFile}`,
		outputDir: `./output${settings.outputDir}/`,
		production: settings.env === 'production',
		sourceMap: !!settings.sourceMap,
		jsonPatched,
	});
	
	const bundle = await rollup.rollup(rollupConfig.inputConfig);
	
	return bundle.write(rollupConfig.outputConfig);
}

async function watchBundle() {
	// Babel browser config is defined in package.json 
	const rollupConfig = createRollupConfig({
		input: `../${settings.inputDir}/${settings.inputFile}`,
		outputDir: `./output${settings.outputDir}/`,
		production: settings.env === 'production',
		sourceMap: !!settings.sourceMap,
		jsonPatched,
	});
	
	return rollup.watch({
		...rollupConfig.inputConfig,
		output: [rollupConfig.outputConfig],
		watch: {},
	});
}

function copy() {
	// TODO: use copy key from settings
	return src(`../${settings.inputDir}/firebase.json`)
		.pipe(dest(`./output/${settings.outputDir}/`));
}

function runServer() {
	runCommand(`cd ./output/${settings.outputDir} && superstatic --port 5000 --host localhost`);
}


exports.build = series(getSettings, cleanBuildFolder, copy, buildBundle);
exports.serve = series(getSettings, runServer);
exports.watch = series(getSettings, cleanBuildFolder, copy, parallel(watchBundle, runServer));
