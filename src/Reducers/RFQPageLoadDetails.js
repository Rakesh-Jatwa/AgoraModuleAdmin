import {GET_RRFQ_PAGE_DETAILS_SUCCESS,GET_RRFQ_PAGE_DETAILS_FAILURE,GET_RRFQ_PAGE_DETAILS_ERROR, GET_RRFQ_PAGE_DETAILS_ACCESS } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    loading:false,
    responseList:[],
}

let RFQPageLoadDetails = (state = initialstate, action) => {
    switch(action.type){

        case GET_RRFQ_PAGE_DETAILS_ACCESS:
        return Object.assign({}, state, action.payload)

        case GET_RRFQ_PAGE_DETAILS_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GET_RRFQ_PAGE_DETAILS_FAILURE:
        return {...state, errMessage:action.payload}

        case GET_RRFQ_PAGE_DETAILS_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default RFQPageLoadDetails;