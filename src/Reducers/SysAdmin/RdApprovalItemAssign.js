import {ITEM_ASSIGMENT_ACCESS,ITEM_ASSIGMENT_SUCCESS,ITEM_ASSIGMENT_FAILURE,ITEM_ASSIGMENT_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let SearchResult = (state = initialstate, action) => {
    switch(action.type){

        case ITEM_ASSIGMENT_ACCESS:
        return Object.assign({}, state, action.payload)

        case ITEM_ASSIGMENT_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case ITEM_ASSIGMENT_FAILURE:
        return {...state, errMessage:action.payload}

        case ITEM_ASSIGMENT_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default SearchResult;
