import {REQ_CON_ITEM_ACCESS,REQ_CON_ITEM_SUCCESS,REQ_CON_ITEM_FAILURE,REQ_CON_ITEM_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let RequesterContinue = (state = initialstate, action) => {
    switch(action.type){

        case REQ_CON_ITEM_ACCESS:
        return Object.assign({}, state, action.payload)

        case REQ_CON_ITEM_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case REQ_CON_ITEM_FAILURE:
        return {...state, errMessage:action.payload}

        case REQ_CON_ITEM_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default RequesterContinue;