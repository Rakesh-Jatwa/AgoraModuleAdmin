import {IV_ACCESS,IV_SUCCESS,IV_FAILURE,IV_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false,
}

let InvoiceVerify = (state = initialstate, action) => {
    switch(action.type){

        case IV_ACCESS:
        return Object.assign({}, state, action.payload)

        case IV_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case IV_FAILURE:
        return {...state, errMessage:action.payload, loading:false}

        case IV_ERROR:
        return {...state, errMessage:action.payload, loading:false}
        
        default :
        return {...state};

    }
}
export default InvoiceVerify;