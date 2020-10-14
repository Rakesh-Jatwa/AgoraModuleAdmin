import {GET_OUT_RFQ_ACCESS,GET_OUT_RFQ_SUCCESS,GET_OUT_RFQ_FAILURE, GET_OUT_RFQ_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    loading:false,
    responseList:[],
    strMsgL:''
}

let OutstandingRfq = (state = initialstate, action) => {
    switch(action.type){

        case GET_OUT_RFQ_ACCESS:
        return Object.assign({}, state, action.payload)

        case GET_OUT_RFQ_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GET_OUT_RFQ_FAILURE:
        return {...state, errMessage:action.payload, loading:false}

        case GET_OUT_RFQ_ERROR:
        return {...state, errMessage:action.payload, loading:false}

        default :
        return {...state};

    }
}
export default OutstandingRfq;