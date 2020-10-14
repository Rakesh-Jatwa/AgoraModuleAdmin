import {ED_POLICY_ACCESS,ED_POLICY_SUCCESS,ED_POLICY_FAILURE,ED_POLICY_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let AcceptReject = (state = initialstate, action) => {
    switch(action.type){

        case ED_POLICY_ACCESS:
        return Object.assign({}, state, action.payload)

        case ED_POLICY_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case ED_POLICY_FAILURE:
        return {...state, errMessage:action.payload}

        case ED_POLICY_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default AcceptReject;