import {IBS_SUCCESS,IBS_FAILURE,IBS_ERROR, IBS_ACCESS } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    loading:false,
    responseList:[],
}

let ItemBasedSearch = (state = initialstate, action) => {
    switch(action.type){

        case IBS_ACCESS:
            return Object.assign({}, state, action.payload)

        case IBS_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case IBS_FAILURE:
        return {...state, errMessage:action.payload}

        case IBS_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default ItemBasedSearch;