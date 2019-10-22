import {Route} from './route.interface';
import {TemplateResult} from 'lit-html';

export class Router {
	
	private readonly _routes: Route[];
	private _path: string;
	private _currentRouteOutput: string | TemplateResult;
	
	
	constructor(routes: Route[]) {
		this._routes = routes || [];
		
		this._path = '';
		this._currentRouteOutput = '';
	}
	
	
	//<editor-fold desc="# Private methods">
	
	private static _loadRoute(route: Route, path: string) {
		return route.pattern.test(path);
	}
	
	private static _autoDefineLitElementClass(module: any) {
		Object.keys(module)
			.forEach(key => {
				const elemClass = module[key];
				if (!elemClass.is || !/^\w+(-\w+)+$/.test(elemClass.is)) return;
				
				customElements.define(module[key].is, module[key]);
			});
	}
	
	//</editor-fold>
	
	
	public process(path: string) {
		if (path === this._path) return this._currentRouteOutput;
		this._path = path;
		
		for (let i = 0; i < this._routes.length; i++) {
			const route = this._routes[i];
			const loadRoute = Router._loadRoute(route, path);
			
			if (!loadRoute) continue;
			
			// Do lazy imports
			route.importLazy && route.importLazy()
				.then((module) => {
					delete route.importLazy;
					
					Router._autoDefineLitElementClass(module);
				});
			
			this._currentRouteOutput = route.load(route, path);
			return this._currentRouteOutput;
		}
		
		return '';
	}
	
	
}
