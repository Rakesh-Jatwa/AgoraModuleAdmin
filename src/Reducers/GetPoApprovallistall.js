import {PO_APPROVAL_ACCESS_ALL,PO_APPROVAL_SUCCESS_ALL,PO_APPROVAL_FAILURE_ALL,PO_APPROVAL_ERROR_ALL } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
}

let GetPoApprovallistall = (state = initialstate, action) => {
    switch(action.type){

        case PO_APPROVAL_ACCESS_ALL:
        return Object.assign({}, state, action.payload)

        case PO_APPROVAL_SUCCESS_ALL:
        return Object.assign({}, state, action.payload, {loading:false})

        case PO_APPROVAL_FAILURE_ALL:
        return {...state, errMessage:action.payload}

        case PO_APPROVAL_ERROR_ALL:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default GetPoApprovallistall;