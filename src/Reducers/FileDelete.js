import {DELETE_ACCESS,DELETE_SUCCESS,DELETE_FAILURE,DELETE_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let FileDelete = (state = initialstate, action) => {
    switch(action.type){

        case DELETE_ACCESS:
        return Object.assign({}, state, action.payload)

        case DELETE_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case DELETE_FAILURE:
        return {...state, errMessage:action.payload}

        case DELETE_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default FileDelete;