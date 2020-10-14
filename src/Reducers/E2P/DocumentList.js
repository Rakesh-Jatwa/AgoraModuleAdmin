import {REQ_DOC_LIST_ACCESS,REQ_DOC_LIST_SUCCESS,REQ_DOC_LIST_FAILURE,REQ_DOC_LIST_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let E2PDocumentList = (state = initialstate, action) => {
    switch(action.type){

        case REQ_DOC_LIST_ACCESS:
        return Object.assign({}, state, action.payload)

        case REQ_DOC_LIST_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case REQ_DOC_LIST_FAILURE:
        return {...state, errMessage:action.payload}

        case REQ_DOC_LIST_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default E2PDocumentList;