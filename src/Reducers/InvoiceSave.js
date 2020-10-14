import {IN_SAVE_ACCESS,IN_SAVE_SUCCESS,IN_SAVE_FAILURE,IN_SAVE_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false,
}

let InvoiceSave = (state = initialstate, action) => {
    switch(action.type){

        case IN_SAVE_ACCESS:
        return Object.assign({}, state, action.payload)

        case IN_SAVE_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case IN_SAVE_FAILURE:
        return {...state, errMessage:action.payload}

        case IN_SAVE_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default InvoiceSave;