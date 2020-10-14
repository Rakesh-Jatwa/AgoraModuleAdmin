import {VENDOR_MAP_ACCESS,VENDOR_MAP_SUCCESS,VENDOR_MAP_FAILURE,VENDOR_MAP_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let VendorMapList = (state = initialstate, action) => {
    switch(action.type){

        case VENDOR_MAP_ACCESS:
        return Object.assign({}, state, action.payload)

        case VENDOR_MAP_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case VENDOR_MAP_FAILURE:
        return {...state, errMessage:action.payload}

        case VENDOR_MAP_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default VendorMapList;