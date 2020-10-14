import {USER_ASSIGMENT_ACCESS,USER_ASSIGMENT_SUCCESS,USER_ASSIGMENT_FAILURE,USER_ASSIGMENT_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let SearchResult = (state = initialstate, action) => {
    switch(action.type){

        case USER_ASSIGMENT_ACCESS:
        return Object.assign({}, state, action.payload)

        case USER_ASSIGMENT_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case USER_ASSIGMENT_FAILURE:
        return {...state, errMessage:action.payload}

        case USER_ASSIGMENT_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default SearchResult;
