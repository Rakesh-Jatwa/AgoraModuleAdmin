import {VIEW_SPR_ACCESS,VIEW_SPR_SUCCESS,VIEW_SPR_FAILURE,VIEW_SPR_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false,
}

let ViewSinglePr = (state = initialstate, action) => {
    switch(action.type){

        case VIEW_SPR_ACCESS:
        return Object.assign({}, state, action.payload)

        case VIEW_SPR_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case VIEW_SPR_FAILURE:
        return {...state, errMessage:action.payload}

        case VIEW_SPR_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default ViewSinglePr;