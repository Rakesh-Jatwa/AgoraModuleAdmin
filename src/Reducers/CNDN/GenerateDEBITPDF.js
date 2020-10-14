import {GENERAE_DEBITPDF_ACCESS,GENERAE_DEBITPDF_SUCCESS,GENERAE_DEBITPDF_FAILURE,GENERAE_DEBITPDF_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let GenerateDEBITPDF = (state = initialstate, action) => {
    switch(action.type){

        case GENERAE_DEBITPDF_ACCESS:
        return Object.assign({}, state, action.payload)

        case GENERAE_DEBITPDF_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GENERAE_DEBITPDF_FAILURE:
        return {...state, errMessage:action.payload}

        case GENERAE_DEBITPDF_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};
    }
}
export default GenerateDEBITPDF;