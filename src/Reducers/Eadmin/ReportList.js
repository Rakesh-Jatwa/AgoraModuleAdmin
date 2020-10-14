import {REPORT_LIST_ACCESS,REPORT_LIST_SUCCESS,REPORT_LIST_FAILURE, REPORT_LIST_MX_SUCCESS, REPORT_LIST_LST_SUCCESS,REPORT_LIST_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let ReportList = (state = initialstate, action) => {
    switch(action.type){

        case REPORT_LIST_ACCESS:
        return Object.assign({}, state, action.payload)

        case REPORT_LIST_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

    
        case REPORT_LIST_FAILURE:
        return {...state, errMessage:action.payload}

        case REPORT_LIST_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default ReportList;