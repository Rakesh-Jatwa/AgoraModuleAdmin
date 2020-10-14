import {CURRENCY_ACCESS,CURRENCY_SUCCESS,CURRENCY_FAILURE,CURRENCY_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let Currency = (state = initialstate, action) => {
    switch(action.type){

        case CURRENCY_ACCESS:
        return Object.assign({}, state, action.payload)

        case CURRENCY_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case CURRENCY_FAILURE:
        return {...state, errMessage:action.payload}

        case CURRENCY_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default Currency;