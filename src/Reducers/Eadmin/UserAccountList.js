import {USER_ACCOUNT_ACCESS,USER_ACCOUNT_SUCCESS,USER_ACCOUNT_FAILURE,USER_ACCOUNT_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let UserAccountList = (state = initialstate, action) => {
    switch(action.type){

        case USER_ACCOUNT_ACCESS:
        return Object.assign({}, state, action.payload)

        case USER_ACCOUNT_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case USER_ACCOUNT_FAILURE:
        return {...state, errMessage:action.payload}

        case USER_ACCOUNT_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default UserAccountList;