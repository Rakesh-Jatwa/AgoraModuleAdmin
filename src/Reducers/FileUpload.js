import {UPLOAD_ACCESS,UPLOAD_SUCCESS,UPLOAD_FAILURE,UPLOAD_ERROR } from '../Actions/Actions';
const initialstate = {
    filename:'',
    statusText:'',
    loading:false
}

let FileUpload = (state = initialstate, action) => {
    switch(action.type){

        case UPLOAD_ACCESS:
        return Object.assign({}, state, action.payload)

        case UPLOAD_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case UPLOAD_FAILURE:
        return {...state, statusText:action.payload, loading:false}

        case UPLOAD_ERROR:
        return {...state, statusText:action.payload, loading:false}
        
        default :
        return {...state};

    }
}
export default FileUpload;