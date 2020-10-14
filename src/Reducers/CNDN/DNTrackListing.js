import {DN_TRACKING_ACCESS,DN_TRACKING_SUCCESS,DN_TRACKING_SUCCESS_NEW, DN_TRACKING_SUCCESS_S,DN_TRACKING_SUCCESS_PAID, DN_TRACKING_FAILURE,DN_TRACKING_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    responseList_s:[],
    responseList_paid:[],
    loading:false
}

let DNTrackListing = (state = initialstate, action) => {
    switch(action.type){

        case DN_TRACKING_ACCESS:
        return Object.assign({}, state, action.payload)

        case DN_TRACKING_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case DN_TRACKING_SUCCESS_NEW:
        return Object.assign({}, state, action.payload, {loading:false})

        case DN_TRACKING_SUCCESS_S:
        return Object.assign({}, state, {responseList_s : action.payload}, {loading:false})

        case DN_TRACKING_SUCCESS_PAID:
        return Object.assign({}, state, {responseList_paid : action.payload}, {loading:false})

        case DN_TRACKING_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case DN_TRACKING_FAILURE:
        return {...state, errMessage:action.payload}

        case DN_TRACKING_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default DNTrackListing;