import {html, LitElement} from 'lit-element';


export class AppHome extends LitElement {
	
	static get is() {
		return 'app-home';
	}
	
	render() {
		return html`
<style>
	:host {}
</style>

<div>
	<h1>HOME</h1>
	
	<div>
		<!--suppress HtmlUnknownTarget -->
		<a href="/screen-a">screen-a</a>
	</div>
</div>`;
	}
	
}
