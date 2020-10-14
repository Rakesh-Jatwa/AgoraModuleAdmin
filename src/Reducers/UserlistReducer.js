import {USER_LIST_ACCESS,USER_LIST_FULL,USER_LIST_EMPTY,USER_LIST_ERROR} from '../Actions/Actions';
const initialstate = {
    userlist:[],
    statusText:'',
}

let UserlistReducer = (state = initialstate, action) => {
    switch(action.type){

        case USER_LIST_FULL:
        return Object.assign({}, state, action.payload)

        case USER_LIST_ACCESS:
        return {...state, statusText:action.payload}

        case USER_LIST_EMPTY:
        return Object.assign({}, state, action.payload)
        
        case USER_LIST_ERROR:
        return {...state, statusText:action.payload}

        default :
        return {...state};

    }
}
export default UserlistReducer;