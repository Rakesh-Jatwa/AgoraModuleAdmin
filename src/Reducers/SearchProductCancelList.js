import {SPRCL_ACCESS,SPRCL_FAILURE,SPRCL_ERROR, SPRCL_SUCCESS } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    loading:false,
    responseList:[],
}

let SearchProductCancelList = (state = initialstate, action) => {
    switch(action.type){

        case SPRCL_ACCESS:
        return Object.assign({}, state, action.payload)

        case SPRCL_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case SPRCL_FAILURE:
        return {...state, errMessage:action.payload}

        case SPRCL_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default SearchProductCancelList;