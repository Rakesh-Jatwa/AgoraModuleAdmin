import {SPRA_ACCESS,SPRA_SUCCESS,SPRA_FAILURE,SPRA_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false,
}

let PurchaseRequestItems = (state = initialstate, action) => {
    switch(action.type){

        case SPRA_ACCESS:
        return Object.assign({}, state, action.payload)

        case SPRA_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case SPRA_FAILURE:
        return {...state, errMessage:action.payload, loading:false}

        case SPRA_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default PurchaseRequestItems;