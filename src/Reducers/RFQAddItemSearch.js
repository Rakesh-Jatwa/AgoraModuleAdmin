import {REQ_ADD_ITEM_ACCESS,REQ_ADD_ITEM_SUCCESS,REQ_ADD_ITEM_ERROR} from '../Actions/Actions';
const initialstate = {
    status:'FAILURE',
    errMessage:'',
    responseList:[],
    loading:false,
}

let RFQAddItemSearch = (state = initialstate, action) => {
    switch(action.type){

        case REQ_ADD_ITEM_ACCESS:
        return Object.assign({}, state, action.payload)

        case REQ_ADD_ITEM_SUCCESS:
        return Object.assign({}, state, action.payload, {loading:false})

      
        case REQ_ADD_ITEM_ERROR:
        return {...state, errMessage:action.payload, loading:false}

        default :
        return {...state};

    }
}
export default RFQAddItemSearch;