import {GPD_ACCESS,GPD_SUCCESS,GPD_FAILURE, GPD_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let ProductDetails = (state = initialstate, action) => {
    switch(action.type){

        case GPD_ACCESS:
        return Object.assign({}, state, action.payload)

        case GPD_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GPD_FAILURE:
        return {...state, errMessage:action.payload, loading:false}

        case GPD_ERROR:
        return {...state, errMessage:action.payload, loading:false}

        default :
        return {...state};

    }
}
export default ProductDetails;