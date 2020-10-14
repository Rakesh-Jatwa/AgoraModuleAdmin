import {E2P_FIN_LIST_ACCESS,E2P_FIN_LIST_SUCCESS,E2P_FIN_LIST_FAILURE,E2P_FIN_LIST_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let ApprovalListFinance = (state = initialstate, action) => {
    switch(action.type){

        case E2P_FIN_LIST_ACCESS:
        return Object.assign({}, state, action.payload)

        case E2P_FIN_LIST_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case E2P_FIN_LIST_FAILURE:
        return {...state, errMessage:action.payload}

        case E2P_FIN_LIST_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default ApprovalListFinance;