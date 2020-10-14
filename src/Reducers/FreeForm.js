import {FREE_FROM_SUCCESS,FREE_FROM_FAILURE,FREE_FROM_ERROR, FREE_FROM_ACCESS } from '../Actions/Actions';
const initialstate = {
    status:'',
    errMessage:'',
    loading:false,
    responseList:[],
}

let FreeForm = (state = initialstate, action) => {
    switch(action.type){

        case FREE_FROM_ACCESS:
        return Object.assign({}, state, action.payload)

        case FREE_FROM_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case FREE_FROM_FAILURE:
        return {...state, errMessage:action.payload}

        case FREE_FROM_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default FreeForm;