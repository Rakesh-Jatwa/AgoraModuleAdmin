import {AD_ACCESS,AD_SUCCESS,AD_FAILURE,AD_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let AccountData = (state = initialstate, action) => {
    switch(action.type){

        case AD_ACCESS:
        return Object.assign({}, state, action.payload)

        case AD_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case AD_FAILURE:
        return {...state, errMessage:action.payload}

        case AD_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default AccountData;