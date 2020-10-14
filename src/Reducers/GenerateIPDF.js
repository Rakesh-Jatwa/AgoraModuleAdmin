import {GENERAE_IPDF_ACCESS,GENERAE_IPDF_SUCCESS,GENERAE_IPDF_ERROR, GENERAE_IPDF_FAILURE} from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let GenerateIPDF = (state = initialstate, action) => {
    switch(action.type){

        case GENERAE_IPDF_ACCESS:
        return Object.assign({}, state, action.payload)

        case GENERAE_IPDF_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GENERAE_IPDF_ERROR:
        return {...state, errMessage:action.payload, loading:false}

        case GENERAE_IPDF_FAILURE:
        return {...state, errMessage:action.payload, loading:false}
        
        default :
        return {...state};

    }
}
export default GenerateIPDF;