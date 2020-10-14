import {VENDOR_BILL_DETAILS_ACCESS,VENDOR_BILL_DETAILS_SUCCESS,VENDOR_BILL_DETAILS_FAILURE,VENDOR_BILL_DETAILS_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
}

let VendorDetailsMethod = (state = initialstate, action) => {
    switch(action.type){

        case VENDOR_BILL_DETAILS_ACCESS:
        return Object.assign({}, state, action.payload)

        case VENDOR_BILL_DETAILS_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case VENDOR_BILL_DETAILS_FAILURE:
        return {...state, errMessage:action.payload}

        case VENDOR_BILL_DETAILS_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default VendorDetailsMethod;