import {VENDOR_DETAILS_SUCCESS,VENDOR_DETAILS_FAILURE,VENDOR_DETAILS_ERROR, VENDOR_DETAILS_ACCESS } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    loading:false,
    responseList:[],
}

let VendorDetails = (state = initialstate, action) => {
    switch(action.type){

        case VENDOR_DETAILS_ACCESS:
            return Object.assign({}, state, action.payload)

        case VENDOR_DETAILS_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case VENDOR_DETAILS_FAILURE:
        return {...state, errMessage:action.payload}

        case VENDOR_DETAILS_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default VendorDetails;