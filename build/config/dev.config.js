/**
 * @type {BuildConfig}
 */
module.exports = {
	inputFile: 'index.html',
	inputDir: './src',
	outputDir: '/dev',
	
	env: 'development',
	sourceMap: true,
	
	copy: [
		'src/firebase.json',
	],
	
	// changes here will need restarting watch to take effects
	patchJson: {
		// Patch the /src/main/config.json file
		'/main/config.json': {},
	},
};
