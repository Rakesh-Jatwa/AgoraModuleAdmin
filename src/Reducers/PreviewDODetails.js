import {PREVIEW_DO_ACCESS,PREVIEW_DO_SUCCESS,PREVIEW_DO_FAILURE,PREVIEW_DO_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false,
}

let ViewPODetails = (state = initialstate, action) => {
    switch(action.type){

        case PREVIEW_DO_ACCESS:
        return Object.assign({}, state, action.payload)

        case PREVIEW_DO_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case PREVIEW_DO_FAILURE:
        return {...state, errMessage:action.payload}

        case PREVIEW_DO_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default ViewPODetails;