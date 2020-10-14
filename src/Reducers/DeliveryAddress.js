import {DELIVERY_ADDRESS_ACCESS,DELIVERY_ADDRESS_SUCCESS,DELIVERY_ADDRESS_FAILURE, DELIVERY_ADDRESS_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:{},
}

let DeliveryAddress = (state = initialstate, action) => {
    switch(action.type){

        case DELIVERY_ADDRESS_ACCESS:
        return Object.assign({}, state, action.payload)

        case DELIVERY_ADDRESS_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case DELIVERY_ADDRESS_FAILURE:
        return {...state, errMessage:action.payload}

        case DELIVERY_ADDRESS_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default DeliveryAddress;