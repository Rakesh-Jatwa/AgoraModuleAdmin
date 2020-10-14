import {CNDN_INVOICE_ACCESS,CNDN_INVOICE_SUCCESS,CNDN_INVOICE_FAILURE,CNDN_INVOICE_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let CNDNInvoiceDetails = (state = initialstate, action) => {
    switch(action.type){

        case CNDN_INVOICE_ACCESS:
        return Object.assign({}, state, action.payload)

        case CNDN_INVOICE_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case CNDN_INVOICE_FAILURE:
        return {...state, errMessage:action.payload}

        case CNDN_INVOICE_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default CNDNInvoiceDetails;