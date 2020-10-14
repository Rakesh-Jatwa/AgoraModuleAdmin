import {E2P_APPROVAL_DETAILS_ACCESS,E2P_APPROVAL_DETAILS_SUCCESS,E2P_APPROVAL_DETAILS_FAILURE,E2P_APPROVAL_DETAILS_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let ApprovalDetailsE2P = (state = initialstate, action) => {
    switch(action.type){

        case E2P_APPROVAL_DETAILS_ACCESS:
        return Object.assign({}, state, action.payload)

        case E2P_APPROVAL_DETAILS_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case E2P_APPROVAL_DETAILS_FAILURE:
        return {...state, errMessage:action.payload}

        case E2P_APPROVAL_DETAILS_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default ApprovalDetailsE2P;