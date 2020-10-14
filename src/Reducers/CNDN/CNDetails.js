import {CN_DETAILS_ACCESS,CN_DETAILS_SUCCESS,CN_DETAILS_FAILURE,CN_DETAILS_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let CNDetails = (state = initialstate, action) => {
    switch(action.type){

        case CN_DETAILS_ACCESS:
        return Object.assign({}, state, action.payload)

        case CN_DETAILS_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case CN_DETAILS_FAILURE:
        return {...state, errMessage:action.payload}

        case CN_DETAILS_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default CNDetails;