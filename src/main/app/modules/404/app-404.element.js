import {html, LitElement} from 'lit-element';


export class App404 extends LitElement {
	
	static get is() {
		return 'app-404';
	}
	
	render() {
		return html`
<style>
	:host {
		display: flex;
		width: 100%;
		justify-content: center;
		align-items: center;
	}
</style>

<div>
	<h1>404</h1>
	<a href="/">Go home</a>
</div>`;
	}
	
}
