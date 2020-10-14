import {PO_LINE_ACCESS,PO_LINE_SUCCESS, PO_LINE_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    loading:false,
    responseList:[],
    cancelresponseList:[],
    strMsgL:''
}

let PoLineItem = (state = initialstate, action) => {
    switch(action.type){

        case PO_LINE_ACCESS:
        return Object.assign({}, state, action.payload)

        case PO_LINE_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case PO_LINE_ERROR:
        return {...state, errMessage:action.payload,  loading:false}

        default :
        return {...state};

    }
}
export default PoLineItem;