import {GAO_SUCCESS,GAO_FAILURE,GAO_ERROR, GAO_ACCESS } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    loading:false,
    responseList:[],
}

let GetAOList = (state = initialstate, action) => {
    switch(action.type){

        case GAO_ACCESS:
        return Object.assign({}, state, action.payload)

        case GAO_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case GAO_FAILURE:
        return {...state, errMessage:action.payload, loading:false}

        case GAO_ERROR:
        return {...state, errMessage:action.payload, loading:false}

        default :
        return {...state};

    }
}
export default GetAOList;