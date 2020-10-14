import {QUOTE_PDF_ACCESS,QUOTE_PDF_SUCCESS,QUOTE_PDF_ERROR} from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let QuotationPDF = (state = initialstate, action) => {
    switch(action.type){

        case QUOTE_PDF_ACCESS:
        return Object.assign({}, state, action.payload)

        case QUOTE_PDF_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case QUOTE_PDF_ERROR:
        return {...state, errMessage:action.payload,loading:false}
        
        default :
        return {...state};

    }
}
export default QuotationPDF;