import {UGD_ACCESS,UGD_SUCCESS,UGD_FAILURE,UGD_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let UserGroupDetails = (state = initialstate, action) => {
    switch(action.type){

        case UGD_ACCESS:
        return Object.assign({}, state, action.payload)

        case UGD_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case UGD_FAILURE:
        return {...state, errMessage:action.payload}

        case UGD_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default UserGroupDetails;