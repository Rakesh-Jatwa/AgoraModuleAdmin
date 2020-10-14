import {PO_TRACKING_ACCESS,PO_TRACKING_SUCCESS,PO_TRACKING_CANCEL, PO_TRACKING_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    loading:false,
    responseList:[],
    cancelresponseList:[],
    strMsgL:''
}

let PoTracking = (state = initialstate, action) => {
    switch(action.type){

        case PO_TRACKING_ACCESS:
        return Object.assign({}, state, action.payload)

        case PO_TRACKING_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case PO_TRACKING_CANCEL:
        return Object.assign({}, state, {cancelresponseList :action.payload.responseList, errMessage :action.payload.errMessage , errMessage :action.payload.status }, {loading:false})
        
        case PO_TRACKING_ERROR:
        return {...state, errMessage:action.payload,  loading:false}

        default :
        return {...state};

    }
}
export default PoTracking;