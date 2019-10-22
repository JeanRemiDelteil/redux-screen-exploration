import {NAVIGATE_TO} from './types';

const INITIAL_STATE = {
	path: '/',
	search: '',
	hash: '',
};


export const router = (state = INITIAL_STATE, action: { type: string, payload: any }) => {
	
	// noinspection JSRedundantSwitchStatement
	switch (action.type) {
		case NAVIGATE_TO:
			const location: Location = action.payload;
			
			return {
				path: location.pathname,
				search: location.search,
				hash: location.hash,
			};
		
	}
	
	return state;
};
