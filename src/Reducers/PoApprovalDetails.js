import {GET_APPO_ACCESS,GET_APPO_SUCCESS,GET_APPO_FAILURE,GET_APPO_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let PoApprovalDetails = (state = initialstate, action) => {
    switch(action.type){

        case GET_APPO_ACCESS:
        return Object.assign({}, state, action.payload)

        case GET_APPO_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GET_APPO_FAILURE:
        return {...state, errMessage:action.payload, loading:false}

        case GET_APPO_ERROR:
        return {...state, errMessage:action.payload, loading:false}
        
        default :
        return {...state};

    }
}
export default PoApprovalDetails;