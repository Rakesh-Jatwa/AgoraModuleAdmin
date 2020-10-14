import {DOWNLOAD_ACCESS,DOWNLOAD_SUCCESS,DOWNLOAD_FAILURE,DOWNLOAD_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let FileDownload = (state = initialstate, action) => {
    switch(action.type){

        case DOWNLOAD_ACCESS:
        return Object.assign({}, state, action.payload)

        case DOWNLOAD_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case DOWNLOAD_FAILURE:
        return {...state, errMessage:action.payload}

        case DOWNLOAD_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default FileDownload;