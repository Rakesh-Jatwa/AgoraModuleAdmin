import {SPRL_ACCESS,SPRL_FAILURE,SPRL_ERROR, SPRL_SUCCESS } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    loading:false,
    responseList:[],
}

let SearchProductList = (state = initialstate, action) => {
    switch(action.type){

        case SPRL_ACCESS:
        return Object.assign({}, state, action.payload)

        case SPRL_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case SPRL_FAILURE:
        return {...state, errMessage:action.payload}

        case SPRL_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default SearchProductList;