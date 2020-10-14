import {SEGMENTATION_ACCESS,SEGMENTATION_SUCCESS,SEGMENTATION_FAILURE, SEGMENTATION_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:{},
}

let Segmentation = (state = initialstate, action) => {
    switch(action.type){

        case SEGMENTATION_ACCESS:
        return Object.assign({}, state, action.payload)

        case SEGMENTATION_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case SEGMENTATION_FAILURE:
        return {...state, errMessage:action.payload}

        case SEGMENTATION_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default Segmentation;