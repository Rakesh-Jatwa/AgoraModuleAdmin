import {UOM_ACCESS,UOM_SUCCESS,UOM_FAILURE,UOM_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let UOM = (state = initialstate, action) => {
    switch(action.type){

        case UOM_ACCESS:
        return Object.assign({}, state, action.payload)

        case UOM_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case UOM_FAILURE:
        return {...state, errMessage:action.payload}

        case UOM_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default UOM;