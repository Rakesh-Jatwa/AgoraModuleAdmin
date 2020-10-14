import {RFQ_QUT_LIST_ACCESS,RFQ_QUT_LIST_SUCCESS,RFQ_QUT_LIST_ERROR} from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false,
}

let RFQQuoteAccess = (state = initialstate, action) => {
    switch(action.type){

        case RFQ_QUT_LIST_ACCESS:
        return Object.assign({}, state, action.payload)

        case RFQ_QUT_LIST_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

      
        case RFQ_QUT_LIST_ERROR:
        return {...state, errMessage:action.payload, loading:false}

        default :
        return {...state};

    }
}
export default RFQQuoteAccess;