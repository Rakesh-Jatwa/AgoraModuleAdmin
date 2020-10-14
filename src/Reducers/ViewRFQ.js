import {VIEW_RFQ_ACCESS,VIEW_RFQ_SUCCESS,VIEW_RFQ_FAILURE,VIEW_RFQ_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false,
}

let ViewRFQ = (state = initialstate, action) => {
    switch(action.type){

        case VIEW_RFQ_ACCESS:
        return Object.assign({}, state, action.payload)

        case VIEW_RFQ_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case VIEW_RFQ_FAILURE:
        return {...state, errMessage:action.payload}

        case VIEW_RFQ_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default ViewRFQ;