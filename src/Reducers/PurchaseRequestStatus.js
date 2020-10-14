import {PR_ACCESS,PR_SUCCESS,PR_FAILURE, PR_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    loading:false,
    responseList:[],
    strMsgL:''
}

let SearchProductCancelList = (state = initialstate, action) => {
    switch(action.type){

        case PR_ACCESS:
        return Object.assign({}, state, action.payload)

        case PR_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case PR_FAILURE:
        return {...state, errMessage:action.payload}

        case PR_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default SearchProductCancelList;