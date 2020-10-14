import {VNLS_SUCCESS,VNLS_FAILURE,VNLS_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:{},
}

let VendorNameListService = (state = initialstate, action) => {
    switch(action.type){

        case VNLS_SUCCESS:
        return Object.assign({}, state, action.payload)

        case VNLS_FAILURE:
        return {...state, authmessage:action.payload}

        case VNLS_ERROR:
        return {...state, authmessage:action.payload}

        default :
        return {...state};

    }
}
export default VendorNameListService;