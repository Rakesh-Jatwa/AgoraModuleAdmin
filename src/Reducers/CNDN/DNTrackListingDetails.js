import {DN_TRACKING_DETAILS_ACCESS,DN_TRACKING_DETAILS_SUCCESS,DN_TRACKING_DETAILS_FAILURE,DN_TRACKING_DETAILS_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let DNTrackListingDetails = (state = initialstate, action) => {
    switch(action.type){

        case DN_TRACKING_DETAILS_ACCESS:
        return Object.assign({}, state, action.payload)

        case DN_TRACKING_DETAILS_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case DN_TRACKING_DETAILS_FAILURE:
        return {...state, errMessage:action.payload}

        case DN_TRACKING_DETAILS_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};
    }
}
export default DNTrackListingDetails;