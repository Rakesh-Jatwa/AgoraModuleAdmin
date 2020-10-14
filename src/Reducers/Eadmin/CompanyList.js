import {COMPANY_LIST_ACCESS,COMPANY_LIST_SUCCESS,COMPANY_LIST_FAILURE,COMPANY_LIST_ERROR } from '../../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let CompanyList = (state = initialstate, action) => {
    switch(action.type){

        case COMPANY_LIST_ACCESS:
        return Object.assign({}, state, action.payload)

        case COMPANY_LIST_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case COMPANY_LIST_FAILURE:
        return {...state, errMessage:action.payload}

        case COMPANY_LIST_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default CompanyList;