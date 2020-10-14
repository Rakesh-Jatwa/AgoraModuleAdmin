import {POP_ACCESS,POP_SUCCESS,POP_FAILURE,POP_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let PurchaseOrder = (state = initialstate, action) => {
    switch(action.type){

        case POP_ACCESS:
        return Object.assign({}, state, action.payload, {loading:true})

        case POP_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case POP_FAILURE:
        return {...state, errMessage:action.payload, loading:false}

        case POP_ERROR:
        return {...state, errMessage:action.payload,  loading:false}
        
        default :
        return {...state};

    }
}
export default PurchaseOrder;