import {PAYMENT_METHOD_ACCESS,PAYMENT_METHOD_SUCCESS,PAYMENT_METHOD_FAILURE,PAYMENT_METHOD_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let PaymentTerm = (state = initialstate, action) => {
    switch(action.type){

        case PAYMENT_METHOD_ACCESS:
        return Object.assign({}, state, action.payload)

        case PAYMENT_METHOD_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case PAYMENT_METHOD_FAILURE:
        return {...state, errMessage:action.payload}

        case PAYMENT_METHOD_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default PaymentTerm;