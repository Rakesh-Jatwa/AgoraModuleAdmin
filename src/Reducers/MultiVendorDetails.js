import {MULTIPLE_VENDOR_ACCESS,MULTIPLE_VENDOR_SUCCESS,MULTIPLE_VENDOR_FAILURE, MULTIPLE_VENDOR_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:{},
}

let MultiVendorDetails = (state = initialstate, action) => {
    switch(action.type){

        case MULTIPLE_VENDOR_ACCESS:
        return Object.assign({}, state, action.payload)

        case MULTIPLE_VENDOR_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case MULTIPLE_VENDOR_FAILURE:
        return {...state, errMessage:action.payload}

        case MULTIPLE_VENDOR_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default MultiVendorDetails;