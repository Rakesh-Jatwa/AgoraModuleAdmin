import {PO_APPROVAL_ACCESS,PO_APPROVAL_SUCCESS,PO_APPROVAL_FAILURE,PO_APPROVAL_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
}

let GetPoApprovallist = (state = initialstate, action) => {
    switch(action.type){

        case PO_APPROVAL_ACCESS:
        return Object.assign({}, state, action.payload)

        case PO_APPROVAL_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case PO_APPROVAL_FAILURE:
        return {...state, errMessage:action.payload}

        case PO_APPROVAL_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default GetPoApprovallist;