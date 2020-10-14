import {CHNAGE_PASS_ACCESS,CHNAGE_PASS_SUCCESS,CHNAGE_PASS_FAILURE,CHNAGE_PASS_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let ChangePassword = (state = initialstate, action) => {
    switch(action.type){

        case CHNAGE_PASS_ACCESS:
        return Object.assign({}, state, action.payload)

        case CHNAGE_PASS_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case CHNAGE_PASS_FAILURE:
        return {...state, errMessage:action.payload}

        case CHNAGE_PASS_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default ChangePassword;