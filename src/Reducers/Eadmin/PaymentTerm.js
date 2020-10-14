import {PAYMENT_TERM_ACCESS,PAYMENT_TERM_SUCCESS,PAYMENT_TERM_FAILURE,PAYMENT_TERM_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let PaymentTerm = (state = initialstate, action) => {
    switch(action.type){

        case PAYMENT_TERM_ACCESS:
        return Object.assign({}, state, action.payload)

        case PAYMENT_TERM_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case PAYMENT_TERM_FAILURE:
        return {...state, errMessage:action.payload}

        case PAYMENT_TERM_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default PaymentTerm;