import {IGRN_ACCESS,IGRN_SUCCESS,IGRN_FAILURE,IGRN_ERROR } from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false
}

let IssueGrnSearch = (state = initialstate, action) => {
    switch(action.type){

        case IGRN_ACCESS:
        return Object.assign({}, state, action.payload)

        case IGRN_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case IGRN_FAILURE:
        return {...state, errMessage:action.payload}

        case IGRN_ERROR:
        return {...state, errMessage:action.payload}
        
        default :
        return {...state};

    }
}
export default IssueGrnSearch;