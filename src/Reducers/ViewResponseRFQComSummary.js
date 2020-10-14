import {GET_OUT_RFQ_SUM_SUCCESS,GET_OUT_RFQ_SUM_FAILURE,GET_OUT_RFQ_SUM_ERROR, GET_OUT_RFQ_SUM_ACCESS } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    loading:false,
    responseList:[],
}

let ViewResponseRFQComSummary = (state = initialstate, action) => {
    switch(action.type){

        case GET_OUT_RFQ_SUM_ACCESS:
        return Object.assign({}, state, action.payload)

        case GET_OUT_RFQ_SUM_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GET_OUT_RFQ_SUM_FAILURE:
        return {...state, errMessage:action.payload}

        case GET_OUT_RFQ_SUM_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default ViewResponseRFQComSummary;