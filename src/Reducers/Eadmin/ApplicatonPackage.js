import {APP_PACK_ACCESS,APP_PACK_SUCCESS,APP_PACK_FAILURE,APP_PACK_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let ApplicatonPackage = (state = initialstate, action) => {
    switch(action.type){

        case APP_PACK_ACCESS:
        return Object.assign({}, state, action.payload)

        case APP_PACK_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case APP_PACK_FAILURE:
        return {...state, errMessage:action.payload}

        case APP_PACK_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default ApplicatonPackage;