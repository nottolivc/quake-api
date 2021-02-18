import { createStore } from 'redux';
import { countReducer } from '../reducers/reducer';

export const store = createStore(reducer);