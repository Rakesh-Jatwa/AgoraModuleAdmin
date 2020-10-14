import {PO_LIST_ACCESS,PO_LIST_SUCCESS,PO_LIST_CANCEL_SUCCESS, PO_LIST_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    loading:false,
    responseList:[],
    cancelresponseList:[],
    strMsgL:''
}

let PoList = (state = initialstate, action) => {
    switch(action.type){

        case PO_LIST_ACCESS:
        return Object.assign({}, state, action.payload)

        case PO_LIST_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case PO_LIST_CANCEL_SUCCESS:
        return Object.assign({}, state, {cancelresponseList :action.payload.responseList, errMessage :action.payload.errMessage , errMessage :action.payload.status }, {loading:false})
        
        case PO_LIST_ERROR:
        return {...state, errMessage:action.payload,  loading:false}

        default :
        return {...state};

    }
}
export default PoList;