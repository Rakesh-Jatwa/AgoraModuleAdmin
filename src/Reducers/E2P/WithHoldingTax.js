import {E2P_PAY_FOR_ACCESS,E2P_PAY_FOR_SUCCESS,E2P_PAY_FOR_FAILURE,E2P_PAY_FOR_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let E2PWithHoldingTax = (state = initialstate, action) => {
    switch(action.type){

        case E2P_PAY_FOR_ACCESS:
        return Object.assign({}, state, action.payload)

        case E2P_PAY_FOR_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case E2P_PAY_FOR_FAILURE:
        return {...state, errMessage:action.payload}

        case E2P_PAY_FOR_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default E2PWithHoldingTax;