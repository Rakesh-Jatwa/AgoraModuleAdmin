import {CN_TRACKING_ACCESS,CN_TRACKING_SUCCESS,CN_TRACKING_FAILURE,CN_TRACKING_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let DNListing = (state = initialstate, action) => {
    switch(action.type){

        case CN_TRACKING_ACCESS:
        return Object.assign({}, state, action.payload)

        case CN_TRACKING_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case CN_TRACKING_FAILURE:
        return {...state, errMessage:action.payload}

        case CN_TRACKING_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default DNListing;