import {CTL_SUCCESS,CTL_FAILURE,CTL_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:{},
}

let ContractRefNoAndDesc = (state = initialstate, action) => {
    switch(action.type){

        case CTL_SUCCESS:
        return Object.assign({}, state, action.payload)

        case CTL_FAILURE:
        return {...state, authmessage:action.payload}

        case CTL_ERROR:
        return {...state, authmessage:action.payload}

        default :
        return {...state};

    }
}
export default ContractRefNoAndDesc;