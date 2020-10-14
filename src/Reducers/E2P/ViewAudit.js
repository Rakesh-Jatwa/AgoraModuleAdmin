import {E2P_AUDIT_ACCESS,E2P_AUDIT_SUCCESS,E2P_AUDIT_FAILURE,E2P_AUDIT_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let ViewAudit = (state = initialstate, action) => {
    switch(action.type){

        case E2P_AUDIT_ACCESS:
        return Object.assign({}, state, action.payload)

        case E2P_AUDIT_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case E2P_AUDIT_FAILURE:
        return {...state, errMessage:action.payload}

        case E2P_AUDIT_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default ViewAudit;