import { combineReducers } from 'redux';
import userInfo from './provider';

const rootReducer = combineReducers({
    userInfo,
});

export default rootReducer;
