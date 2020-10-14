import {UPLOAD_ACCESS, UPLOAD_SUCCESS,UPLOAD_FAILURE,UPLOAD_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:{},
    loading:false
}

let UploadDocument = (state = initialstate, action) => {
    switch(action.type){


        case UPLOAD_ACCESS:
        return Object.assign({}, state, action.payload)

        case UPLOAD_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case UPLOAD_FAILURE:
        return {...state, authmessage:action.payload, loading:false}

        case UPLOAD_ERROR:
        return {...state, authmessage:action.payload, loading:false}

        default :
        return {...state};

    }
}
export default UploadDocument;