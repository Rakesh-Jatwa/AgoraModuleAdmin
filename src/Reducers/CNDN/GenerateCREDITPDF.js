import {GENERAE_CREDITPDF_ACCESS,GENERAE_CREDITPDF_SUCCESS,GENERAE_CREDITPDF_FAILURE,GENERAE_CREDITPDF_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let GenerateCREDITPDF = (state = initialstate, action) => {
    switch(action.type){

        case GENERAE_CREDITPDF_ACCESS:
        return Object.assign({}, state, action.payload)

        case GENERAE_CREDITPDF_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GENERAE_CREDITPDF_FAILURE:
        return {...state, errMessage:action.payload}

        case GENERAE_CREDITPDF_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};
    }
}
export default GenerateCREDITPDF;