import {GL_CODE_ACCESS,GL_CODE_SUCCESS,GL_CODE_FAILURE, GL_CODE_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    loading:false,
    responseList:[],
    strMsgL:''
}

let GlCode = (state = initialstate, action) => {
    switch(action.type){

        case GL_CODE_ACCESS:
        return Object.assign({}, state, action.payload)

        case GL_CODE_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GL_CODE_FAILURE:
        return {...state, errMessage:action.payload, loading:false}

        case GL_CODE_ERROR:
        return {...state, errMessage:action.payload, loading:false}

        default :
        return {...state};

    }
}
export default GlCode;