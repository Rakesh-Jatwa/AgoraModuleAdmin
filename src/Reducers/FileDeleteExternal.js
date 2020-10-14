import {DELETE_EXTERNAL_ACCESS,DELETE_EXTERNAL_SUCCESS,DELETE_EXTERNAL_FAILURE,DELETE_EXTERNAL_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let FileDeleteExternal = (state = initialstate, action) => {
    switch(action.type){

        case DELETE_EXTERNAL_ACCESS:
        return Object.assign({}, state, action.payload)

        case DELETE_EXTERNAL_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case DELETE_EXTERNAL_FAILURE:
        return {...state, errMessage:action.payload, loading:false}

        case DELETE_EXTERNAL_ERROR:
        return {...state, errMessage:action.payload, loading:false}
        
        default :
        return {...state};

    }
}
export default FileDeleteExternal;