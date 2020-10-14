import {CANCEL_PR_LIST_ACCESS,CANCEL_PR_LIST_SUCCESS,CANCEL_PR_LIST_FAILURE,CANCEL_PR_LIST_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let CancelPrList = (state = initialstate, action) => {
    switch(action.type){

        case CANCEL_PR_LIST_ACCESS:
        return Object.assign({}, state, action.payload)

        case CANCEL_PR_LIST_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case CANCEL_PR_LIST_FAILURE:
        return {...state, errMessage:action.payload}

        case CANCEL_PR_LIST_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default CancelPrList;