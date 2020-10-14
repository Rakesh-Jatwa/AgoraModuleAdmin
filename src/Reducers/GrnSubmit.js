import {GRNS_ACCESS,GRNS_SUCCESS,GRNS_FAILURE, GRNS_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    loading:false,
    responseList:[],
    strMsgL:''
}

let GrnSubmit = (state = initialstate, action) => {
    switch(action.type){

        case GRNS_ACCESS:
        return Object.assign({}, state, action.payload)

        case GRNS_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GRNS_FAILURE:
        return {...state, errMessage:action.payload}

        case GRNS_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default GrnSubmit;