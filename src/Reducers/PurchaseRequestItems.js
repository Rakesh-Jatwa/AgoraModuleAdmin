import {PRI_ACCESS,PRI_SUCCESS,PRI_FAILURE,PRI_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:{},
}

let PurchaseRequestItems = (state = initialstate, action) => {
    switch(action.type){

        case PRI_ACCESS:
        return Object.assign({}, state, action.payload)

        case PRI_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case PRI_FAILURE:
        return {...state, errMessage:action.payload}

        case PRI_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default PurchaseRequestItems;