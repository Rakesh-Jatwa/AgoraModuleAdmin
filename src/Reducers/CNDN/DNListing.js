import {DN_LISTING_ACCESS,DN_LISTING_SUCCESS,DN_LISTING_FAILURE,DN_LISTING_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let DNListing = (state = initialstate, action) => {
    switch(action.type){

        case DN_LISTING_ACCESS:
        return Object.assign({}, state, action.payload)

        case DN_LISTING_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case DN_LISTING_FAILURE:
        return {...state, errMessage:action.payload}

        case DN_LISTING_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default DNListing;