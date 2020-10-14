import {PRI_ACCESS_POPUP,PRI_SUCCESS_POPUP,PRI_FAILURE_POPUP,PRI_ERROR_POPUP } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:{},
    loading:false,
    status:true,
}

let PurchaseRequestItems = (state = initialstate, action) => {
    switch(action.type){

        case PRI_ACCESS_POPUP:
        return Object.assign({}, state, action.payload)

        case PRI_SUCCESS_POPUP:
        return Object.assign({}, state, action.payload, {loading:false, status:false})

        case PRI_FAILURE_POPUP:
        return {...state, errMessage:action.payload,status:true}

        case PRI_ERROR_POPUP:
        return {...state, errMessage:action.payload, status:true}

        default :
        return {...state};

    }
}
export default PurchaseRequestItems;