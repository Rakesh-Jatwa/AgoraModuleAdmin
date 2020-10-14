import {GAPL_SUCCESS,GAPL_FAILURE,GAPL_ERROR, GAPL_ACCESS } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    loading:false,
    responseList:[],
}

let GetAppovalList = (state = initialstate, action) => {
    switch(action.type){

        case GAPL_ACCESS:
        return Object.assign({}, state, action.payload)

        case GAPL_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GAPL_FAILURE:
        return {...state, errMessage:action.payload}

        case GAPL_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default GetAppovalList;