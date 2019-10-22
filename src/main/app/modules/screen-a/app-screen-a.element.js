import {html, LitElement} from 'lit-element';
import {connect} from '../../../store/store';
import {getLocationPath} from '../../../store/reducers/router/selectors';


export class AppScreenA extends connect(LitElement) {
	
	static get is() {
		return 'app-screen-a';
	}
	
	static get properties() {
		return {
			route: {
				type: Object,
			},
		};
	}
	
	
	stateChanged(state) {
		console.log(getLocationPath(state));
	}
	
	render() {
		return html`
<style>
	:host{
		display: flex;
		width: 100%;
	}
	
	main {
		display: flex;
		width: 100%;
	}
</style>

<main>
	<h1>Screen A</h1>
</main>
`;
		
	}
}
