import {VPO_ACCESS,VPO_SUCCESS,VPO_FAILURE,VPO_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let ViewPoClick = (state = initialstate, action) => {
    switch(action.type){

        case VPO_ACCESS:
        return Object.assign({}, state, action.payload)

        case VPO_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case VPO_FAILURE:
        return {...state, errMessage:action.payload}

        case VPO_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default ViewPoClick;