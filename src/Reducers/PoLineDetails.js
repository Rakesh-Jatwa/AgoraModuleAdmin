import {PO_LINE_DETAILS_ACCESS,PO_LINE_DETAILS_SUCCESS, PO_LINE_DETAILS_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    loading:false,
    responseList:[],
    cancelresponseList:[],
    strMsgL:''
}

let PoLineDetails = (state = initialstate, action) => {
    switch(action.type){

        case PO_LINE_DETAILS_ACCESS:
        return Object.assign({}, state, action.payload)

        case PO_LINE_DETAILS_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case PO_LINE_DETAILS_ERROR:
        return {...state, errMessage:action.payload,  loading:false}

        default :
        return {...state};

    }
}
export default PoLineDetails;