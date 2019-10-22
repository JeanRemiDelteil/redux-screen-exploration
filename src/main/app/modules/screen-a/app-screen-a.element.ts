import {customElement, html, LitElement} from 'lit-element';
import {connect} from 'pwa-helpers/connect-mixin';
import {getLocationPath} from '../../../store/reducers/router/selectors';
import {store} from '../../../store/store';
import {IState} from '../../../store/reducers/state.interface';


@customElement('app-screen-a')
export class AppScreenA extends connect(store)(LitElement) {
	
	stateChanged(state: IState) {
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
