import {GDS_ACCESS,GDS_SUCCESS,GDS_FAILURE,GDS_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
}

let DeliveryorderSearch = (state = initialstate, action) => {
    switch(action.type){

        case GDS_ACCESS:
        return Object.assign({}, state, action.payload)

        case GDS_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GDS_FAILURE:
        return {...state, errMessage:action.payload}

        case GDS_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default DeliveryorderSearch;