import {INV_FUND_ACCESS,INV_FUND_SUCCESS,INV_FUND_FAILURE, INV_FUND_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:0,
}

let InvoiceFundType = (state = initialstate, action) => {
    switch(action.type){

        case INV_FUND_ACCESS:
        return Object.assign({}, state, action.payload)

        case INV_FUND_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case INV_FUND_FAILURE:
        return {...state, errMessage:action.payload}

        case INV_FUND_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default InvoiceFundType;