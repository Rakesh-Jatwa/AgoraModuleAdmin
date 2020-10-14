import {TAXCODE_RATE_ACCESS,TAXCODE_RATE_SUCCESS,TAXCODE_RATE_FAILURE,TAXCODE_RATE_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let TaxCodeRate = (state = initialstate, action) => {
    switch(action.type){

        case TAXCODE_RATE_ACCESS:
        return Object.assign({}, state, action.payload)

        case TAXCODE_RATE_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case TAXCODE_RATE_FAILURE:
        return {...state, errMessage:action.payload}

        case TAXCODE_RATE_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default TaxCodeRate;