import {ADDRESS_ACCESS,ADDRESS_SUCCESS,ADDRESS_FAILURE, ADDRESS_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:{},
}

let Address = (state = initialstate, action) => {
    switch(action.type){

        case ADDRESS_ACCESS:
        return Object.assign({}, state, action.payload)

        case ADDRESS_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case ADDRESS_FAILURE:
        return {...state, errMessage:action.payload}

        case ADDRESS_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default Address;