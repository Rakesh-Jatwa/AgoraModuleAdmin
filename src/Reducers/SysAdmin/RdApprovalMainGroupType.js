import {GROUP_TYPE_ACCESS,GROUP_TYPE_SUCCESS,GROUP_TYPE_FAILURE,GROUP_TYPE_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let SearchResult = (state = initialstate, action) => {
    switch(action.type){

        case GROUP_TYPE_ACCESS:
        return Object.assign({}, state, action.payload)

        case GROUP_TYPE_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GROUP_TYPE_FAILURE:
        return {...state, errMessage:action.payload}

        case GROUP_TYPE_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default SearchResult;
