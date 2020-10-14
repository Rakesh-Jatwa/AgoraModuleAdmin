import {GENERAE_RFQPDF_ACCESS,GENERAE_RFQPDF_SUCCESS,GENERAE_RFQPDF_ERROR} from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let GeneratePRPDF = (state = initialstate, action) => {
    switch(action.type){

        case GENERAE_RFQPDF_ACCESS:
        return Object.assign({}, state, action.payload)

        case GENERAE_RFQPDF_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GENERAE_RFQPDF_ERROR:
        return {...state, errMessage:action.payload, loading:false}
        
        default :
        return {...state};

    }
}
export default GeneratePRPDF;