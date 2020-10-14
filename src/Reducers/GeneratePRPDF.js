import {GENERAE_PRPDF_ACCESS,GENERAE_PRPDF_SUCCESS,GENERAE_PRPDF_ERROR} from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let GeneratePRPDF = (state = initialstate, action) => {
    switch(action.type){

        case GENERAE_PRPDF_ACCESS:
        return Object.assign({}, state, action.payload)

        case GENERAE_PRPDF_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GENERAE_PRPDF_ERROR:
        return {...state, errMessage:action.payload, loading:false}
        
        default :
        return {...state};

    }
}
export default GeneratePRPDF;