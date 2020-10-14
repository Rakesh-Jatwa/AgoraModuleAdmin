import {FILL_TAX_CODE_ACCESS,FILL_TAX_CODE_SUCCESS,FILL_TAX_CODE_FAILURE,FILL_TAX_CODE_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let FillTaxCode = (state = initialstate, action) => {
    switch(action.type){

        case FILL_TAX_CODE_ACCESS:
        return Object.assign({}, state, action.payload)

        case FILL_TAX_CODE_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case FILL_TAX_CODE_FAILURE:
        return {...state, errMessage:action.payload}

        case FILL_TAX_CODE_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default FillTaxCode;