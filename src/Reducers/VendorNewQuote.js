import {NEW_QUOTE_DETAILS_ACCESS,NEW_QUOTE_DETAILS_SUCCESS,NEW_QUOTE_DETAILS_FAILURE,NEW_QUOTE_DETAILS_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false,
}



let VendorNewQuote = (state = initialstate, action) => {
    switch(action.type){

        case NEW_QUOTE_DETAILS_ACCESS:
        return Object.assign({}, state, action.payload)

        case NEW_QUOTE_DETAILS_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case NEW_QUOTE_DETAILS_FAILURE:
        return {...state, errMessage:action.payload}

        case NEW_QUOTE_DETAILS_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default VendorNewQuote;