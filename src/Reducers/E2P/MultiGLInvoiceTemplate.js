import {REQ_INVOICE_TEMPLATE_ACCESS,REQ_INVOICE_TEMPLATE_SUCCESS,REQ_INVOICE_TEMPLATE_FAILURE,REQ_INVOICE_TEMPLATE_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let ApprovalDetailsE2P = (state = initialstate, action) => {
    switch(action.type){

        case REQ_INVOICE_TEMPLATE_ACCESS:
        return Object.assign({}, state, action.payload)

        case REQ_INVOICE_TEMPLATE_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case REQ_INVOICE_TEMPLATE_FAILURE:
        return {...state, errMessage:action.payload}

        case REQ_INVOICE_TEMPLATE_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default ApprovalDetailsE2P;