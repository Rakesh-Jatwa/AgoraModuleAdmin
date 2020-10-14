import {PRI_FFACCESS_POPUP,PRI_FFSUCCESS_POPUP,PRI_FFFAILURE_POPUP,PRI_FFERROR_POPUP } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:{},
    loading:false,
    status:true,
}

let PurchaseRequestItemsNc = (state = initialstate, action) => {
    switch(action.type){

        case PRI_FFACCESS_POPUP:
        return Object.assign({}, state, action.payload)

        case PRI_FFSUCCESS_POPUP:
        return Object.assign({}, state, action.payload, {loading:false, status:false})

        case PRI_FFFAILURE_POPUP:
        return {...state, errMessage:action.payload,status:true}

        case PRI_FFERROR_POPUP:
        return {...state, errMessage:action.payload, status:true}

        default :
        return {...state};

    }
}
export default PurchaseRequestItemsNc;