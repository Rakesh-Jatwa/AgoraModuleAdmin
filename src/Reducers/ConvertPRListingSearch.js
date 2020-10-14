import {CPR_PRSEARCH_ACCESS,CPR_PRSEARCH_SUCCESS,CPR_PRSEARCH_FAILURE,CPR_PRSEARCH_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
}

let ConvertPRListingSearch = (state = initialstate, action) => {
    switch(action.type){

        case CPR_PRSEARCH_ACCESS:
        return Object.assign({}, state, action.payload)

        case CPR_PRSEARCH_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case CPR_PRSEARCH_FAILURE:
        return {...state, errMessage:action.payload}

        case CPR_PRSEARCH_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default ConvertPRListingSearch;