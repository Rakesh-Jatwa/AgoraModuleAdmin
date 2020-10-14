import {DOC_ENQ_ACCESS,DOC_ENQ_SUCCESS,DOC_ENQ_FAILURE,DOC_ENQ_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let DocumentEnquiry = (state = initialstate, action) => {
    switch(action.type){

        case DOC_ENQ_ACCESS:
        return Object.assign({}, state, action.payload)

        case DOC_ENQ_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case DOC_ENQ_FAILURE:
        return {...state, errMessage:action.payload}

        case DOC_ENQ_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default DocumentEnquiry;