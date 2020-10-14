import {PRI_NCACCESS_POPUP,PRI_NCSUCCESS_POPUP,PRI_NCFAILURE_POPUP,PRI_NCERROR_POPUP } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:{},
    loading:false,
    status:true,
}

let PurchaseRequestItemsNc = (state = initialstate, action) => {
    switch(action.type){

        case PRI_NCACCESS_POPUP:
        return Object.assign({}, state, action.payload)

        case PRI_NCSUCCESS_POPUP:
        return Object.assign({}, state, action.payload, {loading:false, status:false})

        case PRI_NCFAILURE_POPUP:
        return {...state, errMessage:action.payload,status:true}

        case PRI_NCERROR_POPUP:
        return {...state, errMessage:action.payload, status:true}

        default :
        return {...state};

    }
}
export default PurchaseRequestItemsNc;