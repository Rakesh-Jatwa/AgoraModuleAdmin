import {VIEW_QUOTATION_ACCESS,VIEW_QUOTATION_SUCCESS,VIEW_QUOTATION_FAILURE,VIEW_QUOTATION_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false,
}

let ViewQuotation = (state = initialstate, action) => {
    switch(action.type){

        case VIEW_QUOTATION_ACCESS:
        return Object.assign({}, state, action.payload)

        case VIEW_QUOTATION_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case VIEW_QUOTATION_FAILURE:
        return {...state, errMessage:action.payload}

        case VIEW_QUOTATION_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default ViewQuotation;