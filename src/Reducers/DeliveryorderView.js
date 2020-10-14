import {GVDC_ACCESS,GVDC_SUCCESS,GVDC_FAILURE,GVDC_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
}

let DeliveryorderListing = (state = initialstate, action) => {
    switch(action.type){

        case GVDC_ACCESS:
        return Object.assign({}, state, action.payload)

        case GVDC_SUCCESS:
        console.log('action.payload',action.payload)
        return Object.assign({}, state, action.payload, {loading:false})

        case GVDC_FAILURE:
        return {...state, errMessage:action.payload}

        case GVDC_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default DeliveryorderListing;