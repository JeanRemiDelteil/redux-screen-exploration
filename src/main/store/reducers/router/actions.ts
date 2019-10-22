import {NAVIGATE_TO} from './types';

export const navigateTo = (location: Location) => ({
	type: NAVIGATE_TO,
	payload: location,
});
