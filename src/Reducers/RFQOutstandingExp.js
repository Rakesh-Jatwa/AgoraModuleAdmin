import {VIEW_LIEXP_ACCESS,VIEW_LIEXP_SUCCESS,VIEW_LIEXP_FAILURE,VIEW_LIEXP_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
}

let RFQOutstandingExp = (state = initialstate, action) => {
    switch(action.type){

        case VIEW_LIEXP_ACCESS:
        return Object.assign({}, state, action.payload)

        case VIEW_LIEXP_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case VIEW_LIEXP_FAILURE:
        return {...state, errMessage:action.payload}

        case VIEW_LIEXP_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default RFQOutstandingExp;