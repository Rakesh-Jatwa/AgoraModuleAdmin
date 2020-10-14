import {CRPDF_ACCESS,CRPDF_SUCCESS,CRPDF_ERROR} from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let GetGenerateCRPDF = (state = initialstate, action) => {
    switch(action.type){

        case CRPDF_ACCESS:
        return Object.assign({}, state, action.payload)

        case CRPDF_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case CRPDF_ERROR:
        return {...state, errMessage:action.payload,loading:false}
        
        default :
        return {...state};

    }
}
export default GetGenerateCRPDF;