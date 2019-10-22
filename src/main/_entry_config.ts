import {env} from './config.json';


(window as any).process = {
	'env': {
		'NODE_ENV': env,
	},
};
