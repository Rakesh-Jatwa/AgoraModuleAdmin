import {AUTH_START,AUTH_SUCCESS,AUTH_FAILURE,TOKEN_EXPIRED, AUTH_LOGOUT, AUTH_ERROR } from '../Actions/Actions';
const initialstate = {
    authstatus:false,
    authmessage:'',
    token:'',
    loading:false,
}

let AuthReducer = (state = initialstate, action) => {
    switch(action.type){

        case AUTH_SUCCESS:
        return Object.assign({}, state, action.payload)

        case AUTH_START:
        return Object.assign({}, state, action.payload)

        case AUTH_FAILURE:
        return Object.assign({}, state, action.payload)

        case AUTH_ERROR:
        return {...state, authmessage:action.payload, loading:false}

        case TOKEN_EXPIRED:
        return {...state, authmessage:action.payload, loading:false}

        case AUTH_LOGOUT:
            return {...state, authmessage:action.payload, loading:false}

        default :
        return {...state};

    }
}
export default AuthReducer;