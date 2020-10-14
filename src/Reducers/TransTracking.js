import {TRANS_TRACKING_ACCESS,TRANS_TRACKING_SUCCESS,TRANS_TRACKING_CANCEL, TRANS_TRACKING_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    loading:false,
    responseList:[],
    cancelresponseList:[],
    strMsgL:''
}

let TransTracking = (state = initialstate, action) => {
    switch(action.type){

        case TRANS_TRACKING_ACCESS:
        return Object.assign({}, state, action.payload)

        case TRANS_TRACKING_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case TRANS_TRACKING_CANCEL:
        return Object.assign({}, state, {cancelresponseList :action.payload.responseList, errMessage :action.payload.errMessage , errMessage :action.payload.status }, {loading:false})
        
        case TRANS_TRACKING_ERROR:
        return {...state, errMessage:action.payload,  loading:false}

        default :
        return {...state};

    }
}
export default TransTracking;