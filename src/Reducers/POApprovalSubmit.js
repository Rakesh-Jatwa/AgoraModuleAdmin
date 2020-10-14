import {POSA_SUCCESS,POSA_FAILURE,POSA_ERROR, POSA_ACCESS } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    loading:false,
    responseList:[],
}

let POApprovalSubmit = (state = initialstate, action) => {
    switch(action.type){

        case POSA_ACCESS:
        return Object.assign({}, state, action.payload)

        case POSA_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case POSA_FAILURE:
        return {...state, errMessage:action.payload}

        case POSA_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default POApprovalSubmit;