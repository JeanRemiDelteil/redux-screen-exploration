/**
 * @type {BuildConfig}
 */
module.exports = {
	outputFolder: 'build/src/dev',
	
	copy: [
		'src/firebase.json',
	],
	
	// changes here will need restarting watch to take effects
	// Patch the /src/main/config.json file
	config: {},
};
