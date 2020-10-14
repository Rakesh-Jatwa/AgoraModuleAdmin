import {APPROVER_PRSEARCH_ACCESS,APPROVER_PRSEARCH_SUCCESS,APPROVER_PRSEARCH_FAILURE,APPROVER_PRSEARCH_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false,
}

let ConvertPRSearch = (state = initialstate, action) => {
    switch(action.type){

        case APPROVER_PRSEARCH_ACCESS:
        return Object.assign({}, state, action.payload)

        case APPROVER_PRSEARCH_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case APPROVER_PRSEARCH_FAILURE:
        return {...state, errMessage:action.payload}

        case APPROVER_PRSEARCH_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default ConvertPRSearch;