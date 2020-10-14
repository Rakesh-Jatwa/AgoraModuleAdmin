import {E2P_PENDING_FYFA_ACCESS,E2P_PENDING_FYFA_SUCCESS,E2P_PENDING_FYFA_FAILURE,E2P_PENDING_FYFA_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let E2PPendingFYFA = (state = initialstate, action) => {
    switch(action.type){

        case E2P_PENDING_FYFA_ACCESS:
        return Object.assign({}, state, action.payload)

        case E2P_PENDING_FYFA_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case E2P_PENDING_FYFA_FAILURE:
        return {...state, errMessage:action.payload}

        case E2P_PENDING_FYFA_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default E2PPendingFYFA;