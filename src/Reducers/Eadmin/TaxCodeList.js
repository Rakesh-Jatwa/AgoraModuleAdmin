import {TAXCODE_LIST_ACCESS,TAXCODE_LIST_SUCCESS,TAXCODE_LIST_FAILURE,TAXCODE_LIST_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let TaxCodeList = (state = initialstate, action) => {
    switch(action.type){

        case TAXCODE_LIST_ACCESS:
        return Object.assign({}, state, action.payload)

        case TAXCODE_LIST_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case TAXCODE_LIST_FAILURE:
        return {...state, errMessage:action.payload}

        case TAXCODE_LIST_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};
        
    }
}
export default TaxCodeList;