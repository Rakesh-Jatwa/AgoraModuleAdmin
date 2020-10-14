import {GDL_ACCESS,GDL_SUCCESS,GDL_FAILURE,GDL_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
}

let DeliveryorderListing = (state = initialstate, action) => {
    switch(action.type){

        case GDL_ACCESS:
        return Object.assign({}, state, action.payload)

        case GDL_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GDL_FAILURE:
        return {...state, errMessage:action.payload}

        case GDL_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default DeliveryorderListing;