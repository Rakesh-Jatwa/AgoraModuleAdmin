import {REQ_INVOICE_ACCESS,REQ_INVOICE_SUCCESS,REQ_INVOICE_FAILURE,REQ_INVOICE_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    verified_list:[],
    fyfa_list:[],
}

let RequesterInvoiceSearch = (state = initialstate, action) => {
    switch(action.type){

        case REQ_INVOICE_ACCESS:
        return Object.assign({}, state, action.payload)

        case REQ_INVOICE_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case REQ_INVOICE_FAILURE:
        return {...state, errMessage:action.payload}

        case REQ_INVOICE_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default RequesterInvoiceSearch;