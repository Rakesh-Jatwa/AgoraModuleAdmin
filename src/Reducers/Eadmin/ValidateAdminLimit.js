import {USER_VALIDATE_ACCESS,USER_VALIDATE_SUCCESS,USER_VALIDATE_FAILURE,USER_VALIDATE_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let ValidateAdminLimit = (state = initialstate, action) => {
    switch(action.type){

        case USER_VALIDATE_ACCESS:
        return Object.assign({}, state, action.payload)

        case USER_VALIDATE_SUCCESS:
        console.log('ValidateAdminLimit', action.payload)
        return Object.assign({}, state, action.payload, {loading:false})

        case USER_VALIDATE_FAILURE:
        return {...state, errMessage:action.payload}

        case USER_VALIDATE_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default ValidateAdminLimit;