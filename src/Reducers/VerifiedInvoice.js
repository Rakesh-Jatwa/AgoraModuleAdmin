import {VERIFIED_ACCESS,VERIFIED_SUCCESS,VERIFIED_FAILURE,VERIFIED_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
}

let VerifiedInvoice = (state = initialstate, action) => {
    switch(action.type){

        case VERIFIED_ACCESS:
        return Object.assign({}, state, action.payload)

        case VERIFIED_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case VERIFIED_FAILURE:
        return {...state, errMessage:action.payload}

        case VERIFIED_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default VerifiedInvoice;