import {SR_ACCESS,SR_SUCCESS,SR_FAILURE,SR_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let SearchResult = (state = initialstate, action) => {
    switch(action.type){

        case SR_ACCESS:
        return Object.assign({}, state, action.payload)

        case SR_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case SR_FAILURE:
        return {...state, errMessage:action.payload}

        case SR_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default SearchResult;