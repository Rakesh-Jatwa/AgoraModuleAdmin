import {UG_LIST_ACCESS,UG_LIST_SUCCESS,UG_LIST_FAILURE,UG_LIST_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let UserGroupList = (state = initialstate, action) => {
    switch(action.type){

        case UG_LIST_ACCESS:
        return Object.assign({}, state, action.payload)

        case UG_LIST_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case UG_LIST_FAILURE:
        return {...state, errMessage:action.payload}

        case UG_LIST_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default UserGroupList;