import {GFA_ACCESS,GFA_SUCCESS,GFA_FAILURE,GFA_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
}

let GetFillAddress = (state = initialstate, action) => {
    switch(action.type){

        case GFA_ACCESS:
        return Object.assign({}, state, action.payload)

        case GFA_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GFA_FAILURE:
        return {...state, errMessage:action.payload}

        case GFA_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default GetFillAddress;