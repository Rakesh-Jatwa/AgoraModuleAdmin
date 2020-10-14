import {APPROVAL_GROUP_ACCESS, APPROVAL_GROUP_SUCCESS, APPROVAL_GROUP_FAILURE, APPROVAL_GROUP_ERROR } from '../../Actions/Actions';

const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let SearchResult = (state = initialstate, action) => {
    switch(action.type){

        case APPROVAL_GROUP_ACCESS:
        return Object.assign({}, state, action.payload)

        case APPROVAL_GROUP_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case APPROVAL_GROUP_FAILURE:
        return {...state, errMessage:action.payload}

        case APPROVAL_GROUP_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default SearchResult;
