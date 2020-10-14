import {GENERAE_VPO_ACCESS,GENERAE_VPO_SUCCESS,GENERAE_VPO_ERROR} from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let GenerateGRNPDF = (state = initialstate, action) => {
    switch(action.type){

        case GENERAE_VPO_ACCESS:
        return Object.assign({}, state, action.payload)

        case GENERAE_VPO_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GENERAE_VPO_ERROR:
        return {...state, errMessage:action.payload, loading:false}
        
        default :
        return {...state};

    }
}
export default GenerateGRNPDF;