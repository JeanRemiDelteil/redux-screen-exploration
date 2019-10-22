const child_process = require('child_process');

module.exports.runCommand = function (cmd) {
	const child = child_process.exec(cmd);
	
	child.stdout.pipe(process.stdout);
};
