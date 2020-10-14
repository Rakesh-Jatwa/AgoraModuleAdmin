import {GPO_ACCESS,GPO_SUCCESS,GPO_FAILURE,GPO_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
}

let PoApprovalSetup = (state = initialstate, action) => {
    switch(action.type){

        case GPO_ACCESS:
        return Object.assign({}, state, action.payload)

        case GPO_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GPO_FAILURE:
        return {...state, errMessage:action.payload}

        case GPO_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default PoApprovalSetup;