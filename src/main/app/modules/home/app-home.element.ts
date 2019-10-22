import {customElement, html, LitElement} from 'lit-element';


@customElement('app-home')
export class AppHome extends LitElement {
	
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
