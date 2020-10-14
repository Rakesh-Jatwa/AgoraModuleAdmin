import {GRND_ACCESS,GRND_SUCCESS,GRND_FAILURE, GRND_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
}

let GrndGeneration = (state = initialstate, action) => {
    switch(action.type){

        case GRND_ACCESS:
        return Object.assign({}, state, action.payload)

        case GRND_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GRND_FAILURE:
        return {...state, errMessage:action.payload}

        case GRND_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default GrndGeneration;