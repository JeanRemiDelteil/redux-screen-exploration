/**
 * @param {string} path
 * @param {{}} patch
 */
async function patchJSON(path, patch) {
	const originalData = require(`../../${path}`);
	
	return {
		...originalData,
		...patch,
	};
}

/**
 * @param {string} inputDir
 * @param {Object<string, {}>} patches
 */
module.exports = {
	patchJSONs: async function (inputDir, patches) {
		const res = {};
		
		for (const path of Object.keys(patches)) {
			res['../' + inputDir + path] = JSON.stringify(await patchJSON(inputDir + path, patches[path]));
		}
		
		return res;
	},
};
