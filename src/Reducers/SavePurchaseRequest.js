import {SPR_ACCESS,SPR_SUCCESS,SPR_FAILURE, SPR_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    loading:false,
    responseList:[],
    strMsgL:''
}

let SavePurchaseRequest = (state = initialstate, action) => {
    switch(action.type){

        case SPR_ACCESS:
        return Object.assign({}, state, action.payload)

        case SPR_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case SPR_FAILURE:
        return {...state, errMessage:action.payload, loading:false}

        case SPR_ERROR:
        return {...state, errMessage:action.payload, loading:false}

        default :
        return {...state};

    }
}
export default SavePurchaseRequest;