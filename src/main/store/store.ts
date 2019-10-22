import {applyMiddleware, compose, createStore, Middleware, StoreEnhancer} from 'redux';
import {reducers} from './reducers';


// Redux store enhancers
let enhancers: StoreEnhancer[] = [];

// Redux store middleWares
const middlewares: Middleware[] = [];


// Only active for dev
if (process.env.NODE_ENV === 'development') {
	const devToolsExtension = (window as any)['__REDUX_DEVTOOLS_EXTENSION__'];
	
	if (typeof devToolsExtension === 'function') {
		enhancers = [
			...enhancers,
			devToolsExtension(),
		];
	}
}


const composedEnhancers = compose(
	applyMiddleware(...middlewares),
	...enhancers,
);


/**
 * Create redux store
 *
 * @type {Store}
 */
export const store = createStore(reducers, composedEnhancers);
