import {CN_LISTING_ACCESS,CN_LISTING_SUCCESS,CN_LISTING_FAILURE,CN_LISTING_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let CNListing = (state = initialstate, action) => {
    switch(action.type){

        case CN_LISTING_ACCESS:
        return Object.assign({}, state, action.payload)

        case CN_LISTING_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case CN_LISTING_FAILURE:
        return {...state, errMessage:action.payload}

        case CN_LISTING_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default CNListing;