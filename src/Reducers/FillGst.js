import {FILL_GST_ACCESS,FILL_GST_SUCCESS,FILL_GST_FAILURE,FILL_GST_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let FillGst = (state = initialstate, action) => {
    switch(action.type){

        case FILL_GST_ACCESS:
        return Object.assign({}, state, action.payload)

        case FILL_GST_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case FILL_GST_FAILURE:
        return {...state, errMessage:action.payload}

        case FILL_GST_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default FillGst;