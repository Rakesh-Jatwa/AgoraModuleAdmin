import {POL_ACCESS,POL_SUCCESS,POL_FAILURE,POL_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let PoListing = (state = initialstate, action) => {
    switch(action.type){

        case POL_ACCESS:
        return Object.assign({}, state, action.payload)

        case POL_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case POL_FAILURE:
        return {...state, errMessage:action.payload, loading:false}

        case POL_ERROR:
        return {...state, errMessage:action.payload, loading:false}
        
        default :
        return {...state};

    }
}
export default PoListing;