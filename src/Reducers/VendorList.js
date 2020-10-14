import {RFQ_VENDOR_LIST_ACCESS,RFQ_VENDOR_LIST_SUCCESS,RFQ_VENDOR_LIST_FAILURE,RFQ_VENDOR_LIST_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false,
}

let VendorList = (state = initialstate, action) => {
    switch(action.type){

        case RFQ_VENDOR_LIST_ACCESS:
        return Object.assign({}, state, action.payload)

        case RFQ_VENDOR_LIST_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case RFQ_VENDOR_LIST_FAILURE:
        return {...state, errMessage:action.payload}

        case RFQ_VENDOR_LIST_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default VendorList;