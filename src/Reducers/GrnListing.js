import {GRNL_ACCESS,GRNL_SUCCESS,GRNL_FAILURE,GRNL_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
}

let GrnListing = (state = initialstate, action) => {
    switch(action.type){

        case GRNL_ACCESS:
        return Object.assign({}, state, action.payload)

        case GRNL_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GRNL_FAILURE:
        return {...state, errMessage:action.payload}

        case GRNL_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default GrnListing;