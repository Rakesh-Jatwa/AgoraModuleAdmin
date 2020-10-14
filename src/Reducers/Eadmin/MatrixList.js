import {MATRIX_LIST_ACCESS,MATRIX_LIST_SUCCESS,MATRIX_LIST_FAILURE,MATRIX_LIST_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let MatrixList = (state = initialstate, action) => {
    switch(action.type){

        case MATRIX_LIST_ACCESS:
        return Object.assign({}, state, action.payload)

        case MATRIX_LIST_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case MATRIX_LIST_FAILURE:
        return {...state, errMessage:action.payload}

        case MATRIX_LIST_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default MatrixList;