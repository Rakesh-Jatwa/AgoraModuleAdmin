import {UPLOAD_EXTERNAL_ACCESS,UPLOAD_EXTERNAL_SUCCESS,UPLOAD_EXTERNAL_FAILURE,UPLOAD_EXTERNAL_ERROR } from '../Actions/Actions';
const initialstate = {
    filename:'',
    statusText:'',
    loading:false
}

let FileUploadExternal = (state = initialstate, action) => {
    switch(action.type){

        case UPLOAD_EXTERNAL_ACCESS:
            return Object.assign({}, state, action.payload)

        case UPLOAD_EXTERNAL_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case UPLOAD_EXTERNAL_FAILURE:
        return {...state, statusText:action.payload, loading:false}

        case UPLOAD_EXTERNAL_ERROR:
        return {...state, statusText:action.payload, loading:false}
        
        default :
        return {...state};

    }
}
export default FileUploadExternal;