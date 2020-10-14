import {PREVIEW_GRN_ACCESS,PREVIEW_GRN_SUCCESS,PREVIEW_GRN_FAILURE,PREVIEW_GRN_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false,
}

let ViewGRN = (state = initialstate, action) => {
    switch(action.type){

        case PREVIEW_GRN_ACCESS:
        return Object.assign({}, state, action.payload)

        case PREVIEW_GRN_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case PREVIEW_GRN_FAILURE:
        return {...state, errMessage:action.payload}

        case PREVIEW_GRN_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};


        

    }
}
export default ViewGRN;