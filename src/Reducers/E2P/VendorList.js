import {VENDOR_LIST_ACCESS,VENDOR_LIST_SUCCESS,VENDOR_LIST_FAILURE,VENDOR_LIST_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let VendorList = (state = initialstate, action) => {
    switch(action.type){

        case VENDOR_LIST_ACCESS:
        return Object.assign({}, state, action.payload)

        case VENDOR_LIST_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case VENDOR_LIST_FAILURE:
        return {...state, errMessage:action.payload}

        case VENDOR_LIST_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default VendorList;