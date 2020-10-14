import {GENERAE_POPDF_ACCESS,GENERAE_POPDF_SUCCESS,GENERAE_POPDF_ERROR} from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let GeneratePOPDF = (state = initialstate, action) => {
    switch(action.type){

        case GENERAE_POPDF_ACCESS:
        return Object.assign({}, state, action.payload)

        case GENERAE_POPDF_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GENERAE_POPDF_ERROR:
        return {...state, errMessage:action.payload, loading:false}
        
        default :
        return {...state};

    }
}
export default GeneratePOPDF;