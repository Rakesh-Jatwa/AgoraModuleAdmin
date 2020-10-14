import {CD_ACCESS,CD_SUCCESS,CD_FAILURE, CD_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    loading:false,
    responseList:[],
}

let CatalogueDropdown = (state = initialstate, action) => {
    switch(action.type){

        case CD_ACCESS:
        return Object.assign({}, state, action.payload)

        case CD_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case CD_FAILURE:
        return {...state, errMessage:action.payload}

        case CD_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default CatalogueDropdown;