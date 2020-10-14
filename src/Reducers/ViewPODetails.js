import {VIEW_PO_ACCESS,VIEW_PO_SUCCESS,VIEW_PO_FAILURE,VIEW_PO_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false,
}

let ViewPODetails = (state = initialstate, action) => {
    switch(action.type){

        case VIEW_PO_ACCESS:
        return Object.assign({}, state, action.payload)

        case VIEW_PO_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case VIEW_PO_FAILURE:
        return {...state, errMessage:action.payload}

        case VIEW_PO_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default ViewPODetails;