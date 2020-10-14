import {REQ_APROV_DET_ACCESS,REQ_APROV_DET_SUCCESS,REQ_APROV_DET_FAILURE,REQ_APROV_DET_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let E2PApprovalDetails = (state = initialstate, action) => {
    switch(action.type){

        case REQ_APROV_DET_ACCESS:
        return Object.assign({}, state, action.payload)

        case REQ_APROV_DET_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case REQ_APROV_DET_FAILURE:
        return {...state, errMessage:action.payload}

        case REQ_APROV_DET_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default E2PApprovalDetails;