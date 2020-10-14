import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import RootReducer from '../Reducers';
import 'bootstrap/dist/css/bootstrap.min.css';
const logger = (store) => (next) => (action) => {
    console.log(action)
	return next(action);
} 
const AppStore = createStore(
    RootReducer,
    applyMiddleware(logger,thunk)
)
export default AppStore;