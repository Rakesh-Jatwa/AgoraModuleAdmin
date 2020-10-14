import {QUOTE_LIST_ACCESS,QUOTE_LIST_SUCCESS,QUOTE_LIST_FAILURE,QUOTE_LIST_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let QuoteList = (state = initialstate, action) => {
    switch(action.type){

        case QUOTE_LIST_ACCESS:
        return Object.assign({}, state, action.payload)

        case QUOTE_LIST_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case QUOTE_LIST_FAILURE:
        return {...state, errMessage:action.payload, loading:false}

        case QUOTE_LIST_ERROR:
        return {...state, errMessage:action.payload, loading:false}
        
        default :
        return {...state};

    }
}
export default QuoteList;