import {TemplateResult} from 'lit-html';

export interface Route {
	name: string;
	pattern: RegExp;
	
	load(route: Route, path: string): TemplateResult;
	
	importLazy(): Promise<any>;
}
