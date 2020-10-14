import {CRND_SUCCESS,CRND_FAILURE,CRND_ERROR, CRND_ACCESS } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:{},
}

let ContractRefNoAndDesc = (state = initialstate, action) => {
    switch(action.type){

      

        case CRND_SUCCESS:
        return Object.assign({}, state, action.payload)

        case CRND_FAILURE:
        return {...state, authmessage:action.payload}

        case CRND_ERROR:
        return {...state, authmessage:action.payload}

        default :
        return {...state};

    }
}
export default ContractRefNoAndDesc;