import {APR_ACCESS,APR_SUCCESS,APR_FAILURE,APR_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let ApproverPR = (state = initialstate, action) => {
    switch(action.type){

        case APR_ACCESS:
        return Object.assign({}, state, action.payload)

        case APR_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case APR_FAILURE:
        return {...state, errMessage:action.payload, loading:false}

        case APR_ERROR:
        return {...state, errMessage:action.payload, loading:false}
        
        default :
        return {...state};

    }
}
export default ApproverPR;