import {VIEWINV_ACCESS,VIEWINV_SUCCESS, VIEWINV_FAILURE, VIEWINV_ERROR} from '../Actions/Actions';
const initialstate = {
    filename:'',
    statusText:'',
    loading:false,
    responseList:[],
}

let InvoiceDetailsViewVendor = (state = initialstate, action) => {
    switch(action.type){

        case VIEWINV_ACCESS:
        return Object.assign({}, state, action.payload, {loading:true})

        case VIEWINV_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case VIEWINV_FAILURE:
        return {...state, errMessage:action.payload, loading:false}

        case VIEWINV_ERROR:
        return {...state, errMessage:action.payload,  loading:false}
        
        default :
        return {...state};

    }
}
export default InvoiceDetailsViewVendor;