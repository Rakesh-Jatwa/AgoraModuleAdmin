import {CC_ACCESS,CC_SUCCESS,CC_FAILURE,CC_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let CategoryCode = (state = initialstate, action) => {
    switch(action.type){

        case CC_ACCESS:
        return Object.assign({}, state, action.payload)

        case CC_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case CC_FAILURE:
        return {...state, errMessage:action.payload}

        case CC_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default CategoryCode;