import {PO_DETAILS_ACCESS,PO_DETAILS_SUCCESS,PO_DETAILS_ERROR} from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let PoDetails = (state = initialstate, action) => {
    switch(action.type){

        case PO_DETAILS_ACCESS:
        return Object.assign({}, state, action.payload)

        case PO_DETAILS_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case PO_DETAILS_ERROR:
        return {...state, errMessage:action.payload, loading:false}
        
        default :
        return {...state};

    }
}
export default PoDetails;