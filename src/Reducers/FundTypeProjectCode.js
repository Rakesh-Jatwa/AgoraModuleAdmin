import {FTPC_ACCESS,FTPC_SUCCESS,FTPC_FAILURE, FTPC_ERROR, FTPC_SUCCESS_L1, FTPC_SUCCESS_L2, FTPC_SUCCESS_L3, FTPC_SUCCESS_L4 , FTPC_SUCCESS_L5, FTPC_SUCCESS_L6, FTPC_SUCCESS_L7, FTPC_SUCCESS_L8, FTPC_SUCCESS_L9 } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    responseListL1:[],
    responseListL2:[],
    responseListL3:[],
    responseListL4:[],
    responseListL5:[],
    responseListL6:[],
    responseListL7:[],
    responseListL8:[],
    responseListL9:[],
}

let FundTypeProjectCode = (state = initialstate, action) => {
    switch(action.type){

        case FTPC_ACCESS:
        return Object.assign({}, state, action.payload)

        case FTPC_SUCCESS:
        return Object.assign({}, state, {responseList:action.payload}, {loading:false})

        case FTPC_SUCCESS_L1:
        return Object.assign({}, state, {responseListL1:action.payload}, {loading:false})

        case FTPC_SUCCESS_L2:
        return Object.assign({}, state, {responseListL2:action.payload}, {loading:false})

        case FTPC_SUCCESS_L3:
        return Object.assign({}, state, {responseListL3:action.payload}, {loading:false})

        case FTPC_SUCCESS_L4:
        return Object.assign({}, state, {responseListL4:action.payload}, {loading:false})

        case FTPC_SUCCESS_L5:
        return Object.assign({}, state, {responseListL5:action.payload}, {loading:false})

        case FTPC_SUCCESS_L6:
        return Object.assign({}, state, {responseListL6:action.payload}, {loading:false})

        case FTPC_SUCCESS_L7:
        return Object.assign({}, state, {responseListL7:action.payload}, {loading:false})

        case FTPC_SUCCESS_L8:
        return Object.assign({}, state, {responseListL8:action.payload}, {loading:false})

        case FTPC_SUCCESS_L9:
        return Object.assign({}, state, {responseListL9:action.payload}, {loading:false})

        case FTPC_FAILURE:
        return {...state, errMessage:action.payload}

        case FTPC_ERROR:
        return {...state, errMessage:action.payload}

        default :
        return {...state};

    }
}
export default FundTypeProjectCode;