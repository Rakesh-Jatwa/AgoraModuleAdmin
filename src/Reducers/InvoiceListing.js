import {INVILIST_ACCESS,INVILIST_SUCCESS, INVILIST_FAILURE, INVILIST_ERROR} from '../Actions/Actions';
const initialstate = {
    filename:'',
    statusText:'',
    loading:false,
    responseList:[],
}

let InvoiceListing = (state = initialstate, action) => {
    switch(action.type){

        case INVILIST_ACCESS:
        return Object.assign({}, state, action.payload, {loading:true})

        case INVILIST_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case INVILIST_FAILURE:
        return {...state, errMessage:action.payload, loading:false}

        case INVILIST_ERROR:
        return {...state, errMessage:action.payload,  loading:false}
        
        default :
        return {...state};

    }
}
export default InvoiceListing;