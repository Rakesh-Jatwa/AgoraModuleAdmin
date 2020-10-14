import {DL_ACCESS,DL_SUCCESS,DL_FAILURE, DL_MX_SUCCESS, DL_LST_SUCCESS,DL_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    responseList_1:[],
    responseList_2:[],
    loading:false
}

let FixedRoles = (state = initialstate, action) => {
    switch(action.type){

        case DL_ACCESS:
        return Object.assign({}, state, action.payload)

        case DL_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case DL_MX_SUCCESS:
        return Object.assign({}, state,  {loading:false, responseList_1:action.payload})

        case DL_LST_SUCCESS:
        return Object.assign({}, state,  {loading:false, responseList_2:action.payload})

        case DL_FAILURE:
        return {...state, errMessage:action.payload}

        case DL_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default FixedRoles;