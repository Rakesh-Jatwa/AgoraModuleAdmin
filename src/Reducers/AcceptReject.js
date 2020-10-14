import {AR_ACCESS,AR_SUCCESS,AR_FAILURE,AR_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let AcceptReject = (state = initialstate, action) => {
    switch(action.type){

        case AR_ACCESS:
        return Object.assign({}, state, action.payload)

        case AR_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case AR_FAILURE:
        return {...state, errMessage:action.payload}

        case AR_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default AcceptReject;