import {FR_ACCESS,FR_SUCCESS,FR_FAILURE,FR_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let FixedRoles = (state = initialstate, action) => {
    switch(action.type){

        case FR_ACCESS:
        return Object.assign({}, state, action.payload)

        case FR_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case FR_FAILURE:
        return {...state, errMessage:action.payload}

        case FR_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default FixedRoles;