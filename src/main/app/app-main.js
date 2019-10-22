import {html, LitElement} from 'lit-element';
import {installRouter} from 'pwa-helpers/router';
import {connect} from '../store/store';
import {navigateTo} from '../store/reducers/router/actions';
import {getLocationPath} from '../store/reducers/router/selectors';
import {Router} from '../lib/router/Router';


const router = new Router([
	{
		name: 'screenA',
		pattern: /^\/screen-a\/?$/,
		
		load: () => html`<app-screen-a></app-screen-a>`,
		importLazy: () => import('./modules/screen-a/app-screen-a.element'),
	},
	{
		name: 'Home',
		pattern: /^\/$/,
		
		load: () => html`<app-home></app-home>`,
		importLazy: () => import('./modules/home/app-home.element'),
	},
	{
		name: '404',
		pattern: /./,
		
		load: () => html`<app-404></app-404>`,
		importLazy: () => import('./modules/404/app-404.element'),
	},
]);


export class AppMain extends connect(LitElement) {
	
	static get is() {
		return 'app-main';
	}
	
	static get properties() {
		return {
			route: {
				type: Object,
			},
		};
	}
	
	
	constructor() {
		super();
		
		// Init routes
		this._router = router;
		
		installRouter((location) => this.store.dispatch(navigateTo(location)));
	}
	
	
	render() {
		// noinspection CssUnresolvedCustomProperty
		return html`
<style>
	:host {
		display: flex;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		
		--app-primary-color: var(--paper-indigo-500);
		--app-primary-text-color: white;
		--app-secondary-color: #0081f5;
		--app-secondary-text-color: white;
		--app-background-color: #f1e7e2;
		
		background-color: var(--app-background-color);
	}
	
	main {
		display: flex;
		width: 100%;
	}
</style>

<main>
	<!-- Display current Route -->
	${this.route || ''}
</main>
`;
	}
	
	stateChanged(state) {
		this.route = this._router.process(getLocationPath(state));
	}
	
}
