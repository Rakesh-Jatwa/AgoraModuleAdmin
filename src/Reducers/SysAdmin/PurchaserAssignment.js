import {PA_ACCESS,PA_SUCCESS,PA_FAILURE,PA_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let SearchResult = (state = initialstate, action) => {
    switch(action.type){

        case PA_ACCESS:
        return Object.assign({}, state, action.payload)

        case PA_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case PA_FAILURE:
        return {...state, errMessage:action.payload}

        case PA_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default SearchResult;