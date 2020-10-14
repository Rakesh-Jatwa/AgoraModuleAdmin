import {E2P_CAN_APPROVE_ACCESS,E2P_CAN_APPROVE_SUCCESS,E2P_CAN_APPROVE_FAILURE,E2P_CAN_APPROVE_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let E2PCanApprove = (state = initialstate, action) => {
    switch(action.type){

        case E2P_CAN_APPROVE_ACCESS:
        return Object.assign({}, state, action.payload)

        case E2P_CAN_APPROVE_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case E2P_CAN_APPROVE_FAILURE:
        return {...state, errMessage:action.payload}

        case E2P_CAN_APPROVE_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default E2PCanApprove;