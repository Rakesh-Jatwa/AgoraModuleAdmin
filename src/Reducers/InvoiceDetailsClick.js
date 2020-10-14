import {VIDC_ACCESS,VIDC_SUCCESS,VIDC_FAILURE,VIDC_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
}

let InvoiceDetailsClick = (state = initialstate, action) => {
    switch(action.type){

        case VIDC_ACCESS:
        return Object.assign({}, state, action.payload)

        case VIDC_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case VIDC_FAILURE:
        return {...state, errMessage:action.payload}

        case VIDC_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default InvoiceDetailsClick;