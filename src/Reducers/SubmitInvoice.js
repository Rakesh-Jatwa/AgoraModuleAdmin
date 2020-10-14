import {SUBINV_ACCESS,SUBINV_SUCCESS, SUBINV_FAILURE, SUBINV_ERROR} from '../Actions/Actions';
const initialstate = {
    filename:'',
    statusText:'',
    responseList:{},
    loading:false
}

let SubmitInvoice = (state = initialstate, action) => {
    switch(action.type){

        case SUBINV_ACCESS:
        return Object.assign({}, state, action.payload)

        case SUBINV_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})
        
        case SUBINV_FAILURE:
        return {...state, errMessage:action.payload, loading:false}

        case SUBINV_ERROR:
        return {...state, errMessage:action.payload, loading:false}

        default :
        return {...state};

    }
}
export default SubmitInvoice;