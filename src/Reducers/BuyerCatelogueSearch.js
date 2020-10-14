import {BCS_SUCCESS,BCS_FAILURE,BCS_ERROR, BCS_ACCESS } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    loading:false,
    responseList:[],
}

let BuyerCatelogueSearch = (state = initialstate, action) => {
    switch(action.type){

        case BCS_ACCESS:
            return Object.assign({}, state, action.payload)

        case BCS_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case BCS_FAILURE:
        return {...state, errMessage:action.payload}

        case BCS_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default BuyerCatelogueSearch;