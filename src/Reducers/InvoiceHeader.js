import {IVH_ACCESS,IVH_SUCCESS,IVH_FAILURE,IVH_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false,
}

let InvoiceHeader = (state = initialstate, action) => {
    switch(action.type){

        case IVH_ACCESS:
        return Object.assign({}, state, action.payload)

        case IVH_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case IVH_FAILURE:
        return {...state, errMessage:action.payload}

        case IVH_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default InvoiceHeader;