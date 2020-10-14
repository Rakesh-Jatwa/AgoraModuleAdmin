import {DASHBOARD_ACCESS,DASHBOARD_SUCCESS,DASHBOARD_FAILURE, DASHBOARD_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:{},
}

let DeliveryAddress = (state = initialstate, action) => {
    switch(action.type){

        case DASHBOARD_ACCESS:
        return Object.assign({}, state, action.payload)

        case DASHBOARD_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case DASHBOARD_FAILURE:
        return {...state, errMessage:action.payload}

        case DASHBOARD_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default DeliveryAddress;