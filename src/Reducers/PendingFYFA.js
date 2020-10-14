import {PENDING_FYFA_ACCESS,PENDING_FYFA_SUCCESS,PENDING_FYFA_FAILURE,PENDING_FYFA_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
}

let PendingFYFA = (state = initialstate, action) => {
    switch(action.type){

        case PENDING_FYFA_ACCESS:
        return Object.assign({}, state, action.payload)

        case PENDING_FYFA_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case PENDING_FYFA_FAILURE:
        return {...state, errMessage:action.payload}

        case PENDING_FYFA_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default PendingFYFA;