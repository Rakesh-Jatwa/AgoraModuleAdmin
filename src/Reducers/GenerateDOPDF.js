import {GENERAE_DOPDF_ACCESS,GENERAE_DOPDF_SUCCESS,GENERAE_DOPDF_ERROR} from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let GenerateDOPDF = (state = initialstate, action) => {
    switch(action.type){

        case GENERAE_DOPDF_ACCESS:
        return Object.assign({}, state, action.payload)

        case GENERAE_DOPDF_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GENERAE_DOPDF_ERROR:
        return {...state, errMessage:action.payload,loading:false}
        
        default :
        return {...state};

    }
}
export default GenerateDOPDF;