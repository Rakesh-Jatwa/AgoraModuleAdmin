import {GFS_SUCCESS,GFS_FAILURE,GFS_ERROR, GFS_ACCESS } from '../Actions/Actions';
const initialstate = {
    status:'',
    errMessage:'',
    loading:false,
    responseList:[],
}

let GetFinalSubmitPR = (state = initialstate, action) => {
    switch(action.type){

        case GFS_ACCESS:
        return Object.assign({}, state, action.payload)

        case GFS_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GFS_FAILURE:
        return {...state, errMessage:action.payload}

        case GFS_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default GetFinalSubmitPR;