import {RISEARCH_ACCESS,RISEARCH_SUCCESS,RISEARCH_FAILURE,RISEARCH_ERROR, RISEARCH_VERIFIED_SUCCESS } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    verified_list:[],
}

let RequesterInvoiceSearch = (state = initialstate, action) => {
    switch(action.type){

        case RISEARCH_ACCESS:
        return Object.assign({}, state, action.payload)

        case RISEARCH_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case RISEARCH_VERIFIED_SUCCESS:
        return Object.assign({}, state, {verified_list:action.payload.responseList}, {loading:false})

        case RISEARCH_FAILURE:
        return {...state, errMessage:action.payload}

        case RISEARCH_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default RequesterInvoiceSearch;