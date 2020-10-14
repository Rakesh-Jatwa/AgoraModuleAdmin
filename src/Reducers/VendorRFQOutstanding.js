import {VEN_RFQ_OUT_SUCCESS,VEN_RFQ_OUT_FAILURE,VEN_RFQ_OUT_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:{},
}

let VendorRFQOutstanding = (state = initialstate, action) => {
    switch(action.type){

        case VEN_RFQ_OUT_SUCCESS:
        return Object.assign({}, state, action.payload)

        case VEN_RFQ_OUT_FAILURE:
        return {...state, authmessage:action.payload}

        case VEN_RFQ_OUT_ERROR:
        return {...state, authmessage:action.payload}

        default :
        return {...state};
    }
}
export default VendorRFQOutstanding;