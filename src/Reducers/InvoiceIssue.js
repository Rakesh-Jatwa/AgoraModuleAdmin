import {INVISUE_ACCESS,INVISUE_SUCCESS, INVISUE_FAILURE, INVISUE_ERROR} from '../Actions/Actions';
const initialstate = {
    filename:'',
    statusText:'',
    loading:false,
    responseList:[],
}

let IssueInvoice = (state = initialstate, action) => {
    switch(action.type){

        case INVISUE_ACCESS:
        return Object.assign({}, state, action.payload, {loading:true})

        case INVISUE_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

        case INVISUE_FAILURE:
        return {...state, errMessage:action.payload, loading:false}

        case INVISUE_ERROR:
        return {...state, errMessage:action.payload,  loading:false}
        
        default :
        return {...state};

    }
}
export default IssueInvoice;