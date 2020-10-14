import {FILL_TAX_ACCESS,FILL_TAX_SUCCESS,FILL_TAX_FAILURE,FILL_TAX_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let FillTax = (state = initialstate, action) => {
    switch(action.type){

        case FILL_TAX_ACCESS:
        return Object.assign({}, state, action.payload)

        case FILL_TAX_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case FILL_TAX_FAILURE:
        return {...state, errMessage:action.payload}

        case FILL_TAX_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default FillTax;