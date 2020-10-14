import {GAT_SUCCESS,GAT_FAILURE,GAT_ERROR, GAT_ACCESS } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    loading:false,
    responseList:[],
}

let GetApprovalType = (state = initialstate, action) => {
    switch(action.type){

        case GAT_ACCESS:
        return Object.assign({}, state, action.payload)

        case GAT_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GAT_FAILURE:
        return {...state, errMessage:action.payload}

        case GAT_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default GetApprovalType;