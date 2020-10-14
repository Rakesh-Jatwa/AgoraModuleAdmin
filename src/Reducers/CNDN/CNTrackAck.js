import {CN_TRACKING_ACK_ACCESS,CN_TRACKING_ACK_SUCCESS,CN_TRACKING_ACK_FAILURE,CN_TRACKING_ACK_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let CNTrackListing = (state = initialstate, action) => {
    switch(action.type){

        case CN_TRACKING_ACK_ACCESS:
        return Object.assign({}, state, action.payload)

        case CN_TRACKING_ACK_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case CN_TRACKING_ACK_FAILURE:
        return {...state, errMessage:action.payload}

        case CN_TRACKING_ACK_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default CNTrackListing;