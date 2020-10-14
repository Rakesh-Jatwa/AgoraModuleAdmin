import {USER_REMOVE_ACCESS,USER_REMOVE_SUCCESS,USER_REMOVE_ERROR} from '../Actions/Actions';
const initialstate = {
    statusText:'',
}
let RemoveUser = (state = initialstate, action) => {
    switch(action.type){

        case USER_REMOVE_ERROR:
        return {...state, statusText:action.payload}

        case USER_REMOVE_SUCCESS:
        return {...state, statusText:action.payload}

        case USER_REMOVE_ACCESS:
        return {...state, statusText:action.payload}

        default :
        return {...state};

    }
}
export default RemoveUser;