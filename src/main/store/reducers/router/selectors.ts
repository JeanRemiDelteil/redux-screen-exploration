import {IState} from '../state.interface';

export const getLocationPath = (state: IState) => state.router.path;
