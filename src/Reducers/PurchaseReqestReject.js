import {PRRS_ACCESS,PRRS_SUCCESS,PRRS_FAILURE,PRRS_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false,
}

let PurchaseReqestReject = (state = initialstate, action) => {
    switch(action.type){

        case PRRS_ACCESS:
        return Object.assign({}, state, action.payload)

        case PRRS_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case PRRS_FAILURE:
        return {...state, errMessage:action.payload}

        case PRRS_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default PurchaseReqestReject;