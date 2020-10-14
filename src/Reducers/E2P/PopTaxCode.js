import {E2P_POP_TAX_ACCESS,E2P_POP_TAX_SUCCESS,E2P_POP_TAX_FAILURE,E2P_POP_TAX_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let E2PPopTaxCode = (state = initialstate, action) => {
    switch(action.type){

        case E2P_POP_TAX_ACCESS:
        return Object.assign({}, state, action.payload)

        case E2P_POP_TAX_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case E2P_POP_TAX_FAILURE:
        return {...state, errMessage:action.payload}

        case E2P_POP_TAX_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default E2PPopTaxCode;