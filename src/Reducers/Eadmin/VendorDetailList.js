import {VENDOR_DETAIL_ACCESS,VENDOR_DETAIL_SUCCESS,VENDOR_DETAIL_FAILURE,VENDOR_DETAIL_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let VendorDetailList = (state = initialstate, action) => {
    switch(action.type){

        case VENDOR_DETAIL_ACCESS:
        return Object.assign({}, state, action.payload)

        case VENDOR_DETAIL_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case VENDOR_DETAIL_FAILURE:
        return {...state, errMessage:action.payload}

        case VENDOR_DETAIL_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default VendorDetailList;