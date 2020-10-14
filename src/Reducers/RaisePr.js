import {RPR_ACCESS,RPR_SUCCESS,RPR_FAILURE, RPR_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    loading:false,
    responseList:{},
}

let RaisePr = (state = initialstate, action) => {
    switch(action.type){

        case RPR_ACCESS:
        return Object.assign({}, state, action.payload, {loading:true})

        case RPR_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case RPR_FAILURE:
        return Object.assign({}, state, {errMessage:action.payload}, {loading:false})

        default :
        return {...RPR_ERROR};

    }
}
export default RaisePr;