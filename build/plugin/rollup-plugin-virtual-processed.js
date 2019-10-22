const path = require('path');

/**
 * Edited from https://github.com/rollup/rollup-plugin-virtual
 *
 * Original has
 * const PREFIX = `\0virtual:`;
 *
 * \0 prevent other plugins to process the file,
 * effectively preventing me to insert virtual JSON files !
 */
const PREFIX = `virtual:`;

function virtual(modules) {
	const resolvedIds = new Map();
	
	Object.keys(modules).forEach(id => {
		resolvedIds.set(path.resolve(id), modules[id]);
	});
	
	return {
		name: 'virtual',
		
		resolveId(id, importer) {
			if (id in modules) return PREFIX + id;
			
			if (importer) {
				if (importer.startsWith(PREFIX)) importer = importer.slice(PREFIX.length);
				
				const resolved = path.resolve(path.dirname(importer), id);
				if (resolvedIds.has(resolved)) return PREFIX + resolved;
			}
		},
		
		load(id) {
			if (id.startsWith(PREFIX)) {
				id = id.slice(PREFIX.length);
				
				return id in modules ? modules[id] : resolvedIds.get(id);
			}
		},
	};
}

module.exports.virtualModule = virtual;
