import {RFQPDF_ACCESS,RFQPDF_SUCCESS,RFQPDF_FAILURE,RFQPDF_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let RFQPDFGenerate = (state = initialstate, action) => {
    switch(action.type){

        case RFQPDF_ACCESS:
        return Object.assign({}, state, action.payload, {loading:true})

        case RFQPDF_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case RFQPDF_FAILURE:
        return {...state, errMessage:action.payload, loading:false}

        case RFQPDF_ERROR:
        return {...state, errMessage:action.payload,  loading:false}
        
        default :
        return {...state};

    }
}
export default RFQPDFGenerate;