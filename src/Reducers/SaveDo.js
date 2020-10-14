import {SDO_ACCESS,SDO_SUCCESS,SDO_FAILURE,SDO_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false,
}

let SaveDo = (state = initialstate, action) => {
    switch(action.type){

        case SDO_ACCESS:
        return Object.assign({}, state, action.payload)

        case SDO_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case SDO_FAILURE:
        return {...state, errMessage:action.payload, loading:false}

        case SDO_ERROR:
        return {...state, errMessage:action.payload, loading:false}

        default :
        return {...state};

    }
}
export default SaveDo;