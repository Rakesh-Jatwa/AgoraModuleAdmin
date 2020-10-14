import {GPOA_ACCESS,GPOA_SUCCESS,GPOA_FAILURE,GPOA_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
}

let GetPoAllApprovallist = (state = initialstate, action) => {
    switch(action.type){

        case GPOA_ACCESS:
        return Object.assign({}, state, action.payload)

        case GPOA_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GPOA_FAILURE:
        return {...state, errMessage:action.payload}

        case GPOA_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default GetPoAllApprovallist;