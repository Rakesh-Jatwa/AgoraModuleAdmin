import {STATE_ACCESS,STATE_SUCCESS,STATE_FAILURE,STATE_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let State = (state = initialstate, action) => {
    switch(action.type){

        case STATE_ACCESS:
        return Object.assign({}, state, action.payload)

        case STATE_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case STATE_FAILURE:
        return {...state, errMessage:action.payload}

        case STATE_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default State;