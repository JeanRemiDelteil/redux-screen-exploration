import {customElement, html, LitElement} from 'lit-element';


@customElement('app-404')
export class App404 extends LitElement {
	
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
